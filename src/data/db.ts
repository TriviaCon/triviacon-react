import sqlite3 from 'sqlite3'
import { type Database, open } from 'sqlite'
import type { Stats } from '@shared/types/quiz'

const dbg = console.log

export let db: Database | null = null

const _new = async (path: string) => {
  dbg('Creating new database', path)
  db = await open({ filename: path, driver: sqlite3.Database })
  db.on('trace', dbg)

  await db.exec(`CREATE TABLE IF NOT EXISTS meta(
    key TEXT NOT NULL CONSTRAINT meta_pk PRIMARY KEY,
    value TEXT
  )`)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId INTEGER,
      type TEXT NOT NULL DEFAULT 'single-answer',
      text TEXT,
      media TEXT,
      FOREIGN KEY(categoryId) REFERENCES Categories(id)
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS AnswerOptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER,
      text TEXT,
      correct INTEGER NOT NULL DEFAULT 0,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(questionId) REFERENCES Questions(id)
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      sortOrder INTEGER NOT NULL DEFAULT 0
    )
  `)
}

const _open = async (path: string) => {
  dbg('Opening database', path)
  db = await open({ filename: path, driver: sqlite3.Database })
  db.on('trace', dbg)

  // ── Migrations ──────────────────────────────────────────────────

  // 1. Teams table (added for crash recovery)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      sortOrder INTEGER NOT NULL DEFAULT 0
    )
  `)

  // 2. Migrate legacy schema (Questions.answer + Hints → AnswerOptions)
  //    Old: Questions has `answer` column; Hints table holds ALL MC options (including the correct one)
  //    New: Questions has `type` column; AnswerOptions table with `correct` flag per option
  const cols = await db.all('PRAGMA table_info(Questions)')
  const hasType = cols.some((c) => c.name === 'type')

  if (!hasType) {
    dbg('Migrating legacy schema → AnswerOptions...')

    // Add 'type' column (default multiple-choice since legacy questions all had hints)
    await db.exec(`ALTER TABLE Questions ADD COLUMN type TEXT NOT NULL DEFAULT 'multiple-choice'`)

    // Create AnswerOptions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS AnswerOptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        questionId INTEGER,
        text TEXT,
        correct INTEGER NOT NULL DEFAULT 0,
        sortOrder INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY(questionId) REFERENCES Questions(id)
      )
    `)

    const hintsExist = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Hints'"
    )

    if (hintsExist) {
      // In the legacy schema, Hints ARE the MC options (including the correct answer).
      // Mark the hint as correct when it matches Questions.answer.
      await db.exec(`
        INSERT INTO AnswerOptions (questionId, text, correct, sortOrder)
        SELECT h.questionId, h.hint,
          CASE WHEN h.hint = q.answer THEN 1 ELSE 0 END,
          (SELECT COUNT(*) FROM Hints h2 WHERE h2.questionId = h.questionId AND h2.id < h.id)
        FROM Hints h
        JOIN Questions q ON h.questionId = q.id
      `)

      // For questions that have an answer but NO hints (pure single-answer), create one correct option
      await db.exec(`
        INSERT INTO AnswerOptions (questionId, text, correct, sortOrder)
        SELECT q.id, q.answer, 1, 0
        FROM Questions q
        WHERE q.answer IS NOT NULL AND q.answer != ''
          AND q.id NOT IN (SELECT DISTINCT questionId FROM Hints)
      `)

      // Mark hint-less questions as single-answer type
      await db.exec(`
        UPDATE Questions SET type = 'single-answer'
        WHERE id NOT IN (SELECT DISTINCT questionId FROM Hints)
      `)
    } else {
      // No Hints table at all — treat every question as single-answer
      await db.exec(`UPDATE Questions SET type = 'single-answer'`)
      await db.exec(`
        INSERT INTO AnswerOptions (questionId, text, correct, sortOrder)
        SELECT id, answer, 1, 0 FROM Questions WHERE answer IS NOT NULL AND answer != ''
      `)
    }

    dbg('Migration complete.')
  }
}

const getFilePath = (): string | null => {
  return db?.config?.filename ?? null
}

const copyTo = async (destPath: string): Promise<void> => {
  const srcPath = getFilePath()
  if (!srcPath) throw new Error('No database open')
  const fs = await import('fs')
  await fs.promises.copyFile(srcPath, destPath)
}

const getStats = async (): Promise<Stats> => {
  if (!db) return { totalQuestions: 0, questionsWithMedia: 0 }

  const totalQuestions = await db.get('SELECT COUNT(*) as count FROM Questions')
  const questionsWithMedia = await db.get(
    "SELECT COUNT(*) as count FROM Questions WHERE media IS NOT NULL AND media <> ''"
  )

  return {
    totalQuestions: totalQuestions.count,
    questionsWithMedia: questionsWithMedia.count
  }
}

export default {
  new: _new,
  open: _open,
  copyTo,
  getFilePath,
  getStats
}
