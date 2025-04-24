import { db } from './db'
import { Category } from '@renderer/types'

// Create a new category
const create = async (name: string): Promise<number> => {
  if (!db) {
    throw new Error('Database not initialized')
  }

  const result = await db.run('INSERT INTO Categories (name) VALUES (?)', name)
  if (!result.lastID) {
    console.error('No lastID??', result)
    throw new Error('No lastID??')
  }
  return result.lastID // Return the ID of the newly created category
}

// Read all categories (already implemented)
const all = async (): Promise<Category[]> => {
  if (!db) {
    throw new Error('Database not initialized')
  }

  const categories = await db.all('SELECT id, name FROM Categories')
  return categories as Category[]
}

// Read a category by ID
const byId = async (id: number): Promise<Category | null> => {
  if (!db) {
    throw new Error('Database not initialized')
  }

  const category = await db.get('SELECT id, name FROM Categories WHERE id = ?', id)
  return category || null
}

// Update an existing category
const update = async (id: number, name: string): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized')
  }

  await db.run('UPDATE Categories SET name = ? WHERE id = ?', name, id)
}

// Delete a category
const remove = async (id: number): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized')
  }

  await db.run('DELETE FROM Categories WHERE id = ?', id)
}

export default {
  all,
  byId,
  create,
  update,
  remove
}
