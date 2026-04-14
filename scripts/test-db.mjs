#!/usr/bin/env node
/**
 * Integration test for the SQLite data layer.
 * Exercises: open (with migration), CRUD for categories/questions/answer-options, new file, stats.
 * Run: node scripts/test-db.mjs
 */
import sqlite3Pkg from 'sqlite3'
import { open } from 'sqlite'
import { copyFileSync, unlinkSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MOCK_SRC = resolve(__dirname, '../mocks/mockQuiz.tcq')
const TEST_FILE = resolve(__dirname, '../mocks/_test_copy.tcq')
const NEW_FILE = resolve(__dirname, '../mocks/_test_new.tcq')

const sqlite3 = sqlite3Pkg.default ?? sqlite3Pkg

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) {
    passed++
    console.log(`  \x1b[32m✓\x1b[0m ${label}`)
  } else {
    failed++
    console.log(`  \x1b[31m✗\x1b[0m ${label}`)
  }
}

function section(name) {
  console.log(`\n\x1b[1m${name}\x1b[0m`)
}

// ── Helpers to replicate data layer queries ─────────────────────

async function openAndMigrate(path) {
  const db = await open({ filename: path, driver: sqlite3.Database })

  // Teams migration
  await db.exec(`CREATE TABLE IF NOT EXISTS Teams (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, score INTEGER NOT NULL DEFAULT 0, sortOrder INTEGER NOT NULL DEFAULT 0
  )`)

  // Legacy schema migration
  const cols = await db.all('PRAGMA table_info(Questions)')
  const hasType = cols.some((c) => c.name === 'type')

  if (!hasType) {
    await db.exec(`ALTER TABLE Questions ADD COLUMN type TEXT NOT NULL DEFAULT 'multiple-choice'`)
    await db.exec(`CREATE TABLE IF NOT EXISTS AnswerOptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, questionId INTEGER, text TEXT,
      correct INTEGER NOT NULL DEFAULT 0, sortOrder INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(questionId) REFERENCES Questions(id)
    )`)

    const hintsExist = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Hints'")
    if (hintsExist) {
      await db.exec(`INSERT INTO AnswerOptions (questionId, text, correct, sortOrder)
        SELECT h.questionId, h.hint,
          CASE WHEN h.hint = q.answer THEN 1 ELSE 0 END,
          (SELECT COUNT(*) FROM Hints h2 WHERE h2.questionId = h.questionId AND h2.id < h.id)
        FROM Hints h JOIN Questions q ON h.questionId = q.id`)

      await db.exec(`INSERT INTO AnswerOptions (questionId, text, correct, sortOrder)
        SELECT q.id, q.answer, 1, 0 FROM Questions q
        WHERE q.answer IS NOT NULL AND q.answer != ''
          AND q.id NOT IN (SELECT DISTINCT questionId FROM Hints)`)

      await db.exec(`UPDATE Questions SET type = 'single-answer'
        WHERE id NOT IN (SELECT DISTINCT questionId FROM Hints)`)
    }
  }

  return db
}

async function createNew(path) {
  const db = await open({ filename: path, driver: sqlite3.Database })
  await db.exec(`CREATE TABLE IF NOT EXISTS meta(key TEXT NOT NULL PRIMARY KEY, value TEXT)`)
  await db.exec(`CREATE TABLE IF NOT EXISTS Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`)
  await db.exec(`CREATE TABLE IF NOT EXISTS Questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, categoryId INTEGER, type TEXT NOT NULL DEFAULT 'single-answer',
    text TEXT, media TEXT, FOREIGN KEY(categoryId) REFERENCES Categories(id))`)
  await db.exec(`CREATE TABLE IF NOT EXISTS AnswerOptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, questionId INTEGER, text TEXT,
    correct INTEGER NOT NULL DEFAULT 0, sortOrder INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(questionId) REFERENCES Questions(id))`)
  await db.exec(`CREATE TABLE IF NOT EXISTS Teams (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, score INTEGER NOT NULL DEFAULT 0, sortOrder INTEGER NOT NULL DEFAULT 0)`)
  return db
}

// ── Cleanup ─────────────────────────────────────────────────────

function cleanup() {
  for (const f of [TEST_FILE, NEW_FILE]) {
    if (existsSync(f)) unlinkSync(f)
  }
}

// ── Tests ───────────────────────────────────────────────────────

async function main() {
  cleanup()

  // ── 1. Open & migrate legacy .tcq ────────────────────────────
  section('1. Open & migrate legacy mockQuiz.tcq')
  copyFileSync(MOCK_SRC, TEST_FILE)
  const db = await openAndMigrate(TEST_FILE)

  const cats = await db.all('SELECT id, name FROM Categories')
  assert(cats.length === 10, `10 categories loaded (got ${cats.length})`)

  const questions = await db.all('SELECT id, categoryId, type, text, media FROM Questions')
  assert(questions.length === 50, `50 questions loaded (got ${questions.length})`)

  const mcCount = questions.filter(q => q.type === 'multiple-choice').length
  assert(mcCount === 47, `47 multiple-choice questions (got ${mcCount})`)

  const saCount = questions.filter(q => q.type === 'single-answer').length
  assert(saCount === 3, `3 single-answer questions (got ${saCount})`)

  const allOpts = await db.all('SELECT * FROM AnswerOptions')
  assert(allOpts.length === 185, `185 answer options created (got ${allOpts.length})`)

  const q1Opts = await db.all('SELECT * FROM AnswerOptions WHERE questionId = 1 ORDER BY sortOrder')
  assert(q1Opts.length === 4, `Q1 has 4 options (got ${q1Opts.length})`)
  const q1Correct = q1Opts.filter(o => o.correct)
  assert(q1Correct.length === 1 && q1Correct[0].text === 'H2O', `Q1 correct answer is H2O`)

  const meta = await db.all('SELECT key, value FROM meta')
  const metaMap = Object.fromEntries(meta.map(r => [r.key, r.value]))
  assert(metaMap.name === 'Awesome quiz', `Quiz name = "Awesome quiz"`)
  assert(metaMap.author === 'Alu', `Author = "Alu"`)

  // ── 2. Idempotent migration ──────────────────────────────────
  section('2. Idempotent migration (re-open migrated file)')
  await db.close()
  const db2 = await openAndMigrate(TEST_FILE)
  const opts2 = await db2.all('SELECT COUNT(*) as c FROM AnswerOptions')
  assert(opts2[0].c === 185, `Still 185 answer options after re-open (got ${opts2[0].c})`)

  // ── 3. CRUD: Categories ──────────────────────────────────────
  section('3. CRUD: Categories')
  const ins = await db2.run('INSERT INTO Categories (name) VALUES (?)', 'Test Category')
  assert(ins.lastID > 10, `Created category with id ${ins.lastID}`)

  await db2.run('UPDATE Categories SET name = ? WHERE id = ?', 'Renamed Category', ins.lastID)
  const renamed = await db2.get('SELECT name FROM Categories WHERE id = ?', ins.lastID)
  assert(renamed.name === 'Renamed Category', `Renamed category to "${renamed.name}"`)

  await db2.run('DELETE FROM Categories WHERE id = ?', ins.lastID)
  const deleted = await db2.get('SELECT * FROM Categories WHERE id = ?', ins.lastID)
  assert(!deleted, 'Category deleted successfully')

  // ── 4. CRUD: Questions ───────────────────────────────────────
  section('4. CRUD: Questions')
  const qIns = await db2.run(
    'INSERT INTO Questions (categoryId, type, text, media) VALUES (?, ?, ?, ?)',
    1, 'single-answer', 'Test question?', null
  )
  assert(qIns.lastID > 50, `Created question with id ${qIns.lastID}`)

  await db2.run('UPDATE Questions SET text = ? WHERE id = ?', 'Updated question?', qIns.lastID)
  const updQ = await db2.get('SELECT text FROM Questions WHERE id = ?', qIns.lastID)
  assert(updQ.text === 'Updated question?', 'Question text updated')

  // ── 5. CRUD: Answer Options ──────────────────────────────────
  section('5. CRUD: Answer Options')
  const aoIns = await db2.run(
    'INSERT INTO AnswerOptions (questionId, text, correct, sortOrder) VALUES (?, ?, ?, ?)',
    qIns.lastID, 'Option A', 1, 0
  )
  assert(aoIns.lastID > 185, `Created answer option with id ${aoIns.lastID}`)

  const ao2 = await db2.run(
    'INSERT INTO AnswerOptions (questionId, text, correct, sortOrder) VALUES (?, ?, ?, ?)',
    qIns.lastID, 'Option B', 0, 1
  )

  await db2.run('UPDATE AnswerOptions SET text = ? WHERE id = ?', 'Updated Option B', ao2.lastID)
  const updAo = await db2.get('SELECT text FROM AnswerOptions WHERE id = ?', ao2.lastID)
  assert(updAo.text === 'Updated Option B', 'Answer option text updated')

  await db2.run('DELETE FROM AnswerOptions WHERE id = ?', ao2.lastID)
  const delAo = await db2.get('SELECT * FROM AnswerOptions WHERE id = ?', ao2.lastID)
  assert(!delAo, 'Answer option deleted')

  // Cascade delete (question → answer options)
  await db2.run('DELETE FROM AnswerOptions WHERE questionId = ?', qIns.lastID)
  await db2.run('DELETE FROM Questions WHERE id = ?', qIns.lastID)
  const delQ = await db2.get('SELECT * FROM Questions WHERE id = ?', qIns.lastID)
  assert(!delQ, 'Question and options deleted')

  // ── 6. CRUD: Meta ────────────────────────────────────────────
  section('6. CRUD: Meta')
  await db2.run('INSERT OR REPLACE INTO meta(key, value) VALUES (?, ?)', 'name', 'New Quiz Name')
  const newName = await db2.get("SELECT value FROM meta WHERE key = 'name'")
  assert(newName.value === 'New Quiz Name', 'Meta name updated')

  // ── 7. Stats ─────────────────────────────────────────────────
  section('7. Stats')
  const total = await db2.get('SELECT COUNT(*) as count FROM Questions')
  assert(total.count === 50, `Total questions: ${total.count}`)
  const withMedia = await db2.get("SELECT COUNT(*) as count FROM Questions WHERE media IS NOT NULL AND media <> ''")
  assert(withMedia.count === 19, `Questions with media: ${withMedia.count}`)

  // ── 8. Teams persistence ─────────────────────────────────────
  section('8. Teams persistence')
  await db2.run('INSERT INTO Teams (id, name, score, sortOrder) VALUES (?, ?, ?, ?)', 't1', 'Alpha', 10, 0)
  await db2.run('INSERT INTO Teams (id, name, score, sortOrder) VALUES (?, ?, ?, ?)', 't2', 'Beta', 20, 1)
  const teams = await db2.all('SELECT id, name, score FROM Teams ORDER BY sortOrder')
  assert(teams.length === 2, `2 teams persisted`)
  assert(teams[0].name === 'Alpha' && teams[0].score === 10, 'Team Alpha with score 10')

  await db2.close()

  // ── 9. New file creation ─────────────────────────────────────
  section('9. New file creation')
  const db3 = await createNew(NEW_FILE)
  const tables = await db3.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  const tableNames = tables.map(t => t.name).sort()
  assert(
    JSON.stringify(tableNames) === JSON.stringify(['AnswerOptions', 'Categories', 'Questions', 'Teams', 'meta']),
    `All 5 tables created: ${tableNames.join(', ')}`
  )

  // Insert a full question flow
  const newCat = await db3.run('INSERT INTO Categories (name) VALUES (?)', 'Science')
  const newQ = await db3.run(
    'INSERT INTO Questions (categoryId, type, text) VALUES (?, ?, ?)',
    newCat.lastID, 'multiple-choice', 'What is 2+2?'
  )
  await db3.run('INSERT INTO AnswerOptions (questionId, text, correct, sortOrder) VALUES (?, ?, ?, ?)', newQ.lastID, '4', 1, 0)
  await db3.run('INSERT INTO AnswerOptions (questionId, text, correct, sortOrder) VALUES (?, ?, ?, ?)', newQ.lastID, '5', 0, 1)
  const newOpts = await db3.all('SELECT * FROM AnswerOptions WHERE questionId = ?', newQ.lastID)
  assert(newOpts.length === 2, 'New quiz: 2 answer options created')
  assert(newOpts[0].correct === 1 && newOpts[0].text === '4', 'Correct option is "4"')

  await db3.close()

  // ── Summary ──────────────────────────────────────────────────
  console.log(`\n\x1b[1m${passed + failed} tests: \x1b[32m${passed} passed\x1b[0m${failed ? `, \x1b[31m${failed} failed\x1b[0m` : ''}`)
  cleanup()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error(err)
  cleanup()
  process.exit(1)
})
