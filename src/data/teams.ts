import { db } from './db'
import type { Team } from '@shared/types/quiz'

const all = async (): Promise<Team[]> => {
  if (!db) return []
  const rows = await db.all('SELECT id, name, score FROM Teams ORDER BY sortOrder')
  return rows as Team[]
}

const upsert = async (team: Team, sortOrder: number): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')
  await db.run(
    'INSERT OR REPLACE INTO Teams (id, name, score, sortOrder) VALUES (?, ?, ?, ?)',
    team.id,
    team.name,
    team.score,
    sortOrder
  )
}

const remove = async (id: string): Promise<void> => {
  if (!db) throw new Error('No quiz loaded')
  await db.run('DELETE FROM Teams WHERE id = ?', id)
}

const clear = async (): Promise<void> => {
  if (!db) return
  await db.run('DELETE FROM Teams')
}

/** Persist the full teams array (replaces all rows). */
const saveAll = async (teams: Team[]): Promise<void> => {
  if (!db) return
  await db.run('DELETE FROM Teams')
  for (let i = 0; i < teams.length; i++) {
    await db.run(
      'INSERT INTO Teams (id, name, score, sortOrder) VALUES (?, ?, ?, ?)',
      teams[i].id,
      teams[i].name,
      teams[i].score,
      i
    )
  }
}

export default {
  all,
  upsert,
  remove,
  clear,
  saveAll
}
