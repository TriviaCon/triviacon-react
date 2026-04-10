import { db } from './db'
import type { AnswerOption } from '@shared/types/quiz'

const create = async (
  questionId: number,
  text: string = '',
  correct: boolean = false,
  sortOrder: number = 0
): Promise<number> => {
  if (!db) throw new Error('No quiz loaded')

  const result = await db.run(
    'INSERT INTO AnswerOptions (questionId, text, correct, sortOrder) VALUES (?, ?, ?, ?)',
    questionId,
    text,
    correct ? 1 : 0,
    sortOrder
  )
  if (!result.lastID) throw new Error('Insert failed — no lastID')
  return result.lastID
}

const byQuestionId = async (questionId: number): Promise<AnswerOption[]> => {
  if (!db) return []
  const rows = await db.all(
    'SELECT id, questionId, text, correct, sortOrder FROM AnswerOptions WHERE questionId = ? ORDER BY sortOrder',
    questionId
  )
  return rows.map((r) => ({ ...r, correct: !!r.correct }))
}

const update = async (
  id: number,
  fields: Partial<Omit<AnswerOption, 'id' | 'questionId'>>
): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')

  const updates: string[] = []
  const values: (string | number)[] = []

  if (fields.text !== undefined) {
    updates.push('text = ?')
    values.push(fields.text)
  }
  if (fields.correct !== undefined) {
    updates.push('correct = ?')
    values.push(fields.correct ? 1 : 0)
  }
  if (fields.sortOrder !== undefined) {
    updates.push('sortOrder = ?')
    values.push(fields.sortOrder)
  }

  if (updates.length === 0) return

  values.push(id)
  await db.run(`UPDATE AnswerOptions SET ${updates.join(', ')} WHERE id = ?`, ...values)
}

const remove = async (id: number): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')
  await db.run('DELETE FROM AnswerOptions WHERE id = ?', id)
}

const removeByQuestionId = async (questionId: number): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')
  await db.run('DELETE FROM AnswerOptions WHERE questionId = ?', questionId)
}

export default {
  byQuestionId,
  create,
  update,
  remove,
  removeByQuestionId
}
