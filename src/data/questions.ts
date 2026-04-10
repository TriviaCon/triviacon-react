import type { Question } from '@shared/types/quiz'
import { db } from './db'

const allByCategoryId = async (categoryId: number): Promise<Question[]> => {
  if (!db) return []
  const questions = await db.all(
    'SELECT id, categoryId, type, text, media FROM Questions WHERE categoryId = ?',
    categoryId
  )
  return questions
}

const byId = async (id: number): Promise<Question | null> => {
  if (!db) return null
  const question = await db.get(
    'SELECT id, categoryId, type, text, media FROM Questions WHERE id = ?',
    id
  )
  return question || null
}

const update = async (id: number, updates: Partial<Omit<Question, 'id'>>): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')

  const fields = Object.keys(updates)
  const values = Object.values(updates)

  if (fields.length === 0) throw new Error('No fields to update')

  const setClause = fields.map((field) => `${field} = ?`).join(', ')
  await db.run(`UPDATE Questions SET ${setClause} WHERE id = ?`, ...values, id)
}

const _delete = async (id: number): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')

  // Delete associated answer options first
  await db.run('DELETE FROM AnswerOptions WHERE questionId = ?', id)
  await db.run('DELETE FROM Questions WHERE id = ?', id)
}

const create = async (question: Omit<Question, 'id'>): Promise<number> => {
  if (!db) throw new Error('No quiz loaded')

  const { categoryId, type, text, media } = question
  const result = await db.run(
    'INSERT INTO Questions (categoryId, type, text, media) VALUES (?, ?, ?, ?)',
    categoryId,
    type,
    text,
    media
  )
  return result.lastID!
}

export default {
  byId,
  allByCategoryId,
  update,
  delete: _delete,
  create
}
