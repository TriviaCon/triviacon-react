export const sqlite = async (): Promise<typeof import('sqlite3')> => {
  if (typeof window !== 'undefined') {
    return undefined!
  }

  const sqlite3 = await import('sqlite3')
  return sqlite3.default
}

import { type Database, open } from 'sqlite'
const dbg = console.log
import type { Stats } from '@shared/types/quiz'
import questions from './questions'
import categories from './categories'
import answerOptions from './answerOptions'
import meta from './meta'

export let db: Database | null = null

const _new = async (path: string) => {
  dbg('Creating new database', path)
  db = await open({ filename: path, driver: (await sqlite()).Database })
  db.on('trace', dbg)
  db.exec(`CREATE TABLE IF NOT EXISTS meta(
          key TEXT not null constraint meta_pk primary key,
          value TEXT
  )`)

  // Create Categories table
  db.exec(`
  CREATE TABLE IF NOT EXISTS Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`)

  // Create Questions table
  db.exec(`
  CREATE TABLE IF NOT EXISTS Questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryId INTEGER,
    type TEXT NOT NULL DEFAULT 'single-answer',
    text TEXT,
    media TEXT,
    FOREIGN KEY(categoryId) REFERENCES Categories(id)
  )
`)

  // Create AnswerOptions table
  db.exec(`
  CREATE TABLE IF NOT EXISTS AnswerOptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    questionId INTEGER,
    text TEXT,
    correct INTEGER NOT NULL DEFAULT 0,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(questionId) REFERENCES Questions(id)
  )
`)
}

const _open = async (path: string) => {
  dbg('Opening new database', path)
  db = await open({ filename: path, driver: (await sqlite()).Database })
  db.on('trace', dbg)
}

const convertJson = async () => {
  const fs = await import('fs')
  const fileContent = JSON.parse(await fs.promises.readFile('mocks/big_mockQuiz.json', 'utf8'))

  if (!db) {
    throw new Error('Database not initialized')
  }

  const { categories } = fileContent

  for (const category of categories) {
    // Insert category
    const categoryStmt = await db.prepare('INSERT INTO Categories (name) VALUES (?)')
    const categoryResult = await categoryStmt.run(category.name)
    const categoryId = categoryResult.lastID

    for (const question of category.questions) {
      // Insert question
      const questionStmt = await db.prepare(
        'INSERT INTO Questions (categoryId, type, text, media) VALUES (?, ?, ?, ?)'
      )
      const questionResult = await questionStmt.run(
        categoryId,
        question.type || 'single-answer',
        question.text,
        question.media || null
      )
      const questionId = questionResult.lastID

      // Legacy: convert old answer+hints format to answerOptions
      if (question.answer) {
        const answerStmt = await db.prepare(
          'INSERT INTO AnswerOptions (questionId, text, correct, sortOrder) VALUES (?, ?, 1, 0)'
        )
        await answerStmt.run(questionId, question.answer)
      }
      if (question.hints) {
        for (let i = 0; i < question.hints.length; i++) {
          const optStmt = await db.prepare(
            'INSERT INTO AnswerOptions (questionId, text, correct, sortOrder) VALUES (?, ?, 0, ?)'
          )
          await optStmt.run(questionId, question.hints[i], i + 1)
        }
      }
    }
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
    'SELECT COUNT(*) as count FROM Questions WHERE media IS NOT NULL'
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
  convertJson,
  getStats,
  questions,
  categories,
  answerOptions,
  meta
}
