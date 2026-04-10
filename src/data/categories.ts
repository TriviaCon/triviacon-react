import { db } from './db'
import { Category } from '@renderer/types'

const create = async (name: string): Promise<number> => {
  if (!db) throw new Error('No quiz loaded')
  const result = await db.run('INSERT INTO Categories (name) VALUES (?)', name)
  if (!result.lastID) throw new Error('Failed to create category')
  return result.lastID
}

const all = async (): Promise<Category[]> => {
  if (!db) return []
  const categories = await db.all('SELECT id, name FROM Categories')
  return categories as Category[]
}

const byId = async (id: number): Promise<Category | null> => {
  if (!db) return null
  const category = await db.get('SELECT id, name FROM Categories WHERE id = ?', id)
  return category || null
}

const update = async (id: number, name: string): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')
  await db.run('UPDATE Categories SET name = ? WHERE id = ?', name, id)
}

const remove = async (id: number): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')
  await db.run('DELETE FROM Categories WHERE id = ?', id)
}

export default {
  all,
  byId,
  create,
  update,
  remove
}
