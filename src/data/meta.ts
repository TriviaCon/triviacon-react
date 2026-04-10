import { db } from './db'

const getMetaValues = async (keys: string[]): Promise<Record<string, string | undefined>> => {
  if (!db) return {}
  const inHelper = keys.map((k) => `"${k}"`).join(',')
  const result = await db.all(`SELECT key, value FROM meta WHERE key IN (${inHelper})`)
  return result.reduce((pv, cv) => ({ ...pv, [cv.key]: cv.value }), {})
}

const updateMeta = async (key: string, value: string) => {
  if (!db) {
    throw new Error('Database not initialized')
  }
  await db.run('INSERT OR REPLACE into meta(key, value) values (?, ?)', key, value)
}

const get = async () => {
  const meta = await getMetaValues(['author', 'location', 'date', 'name', 'splash'])
  return {
    author: meta.author ?? '',
    location: meta.location ?? '',
    date: meta.date ?? '',
    name: meta.name ?? '',
    splash: meta.splash ?? ''
  }
}

const updateAuthor = async (author: string) => updateMeta('author', author)
const updateLocation = async (location: string) => updateMeta('location', location)
const updateDate = async (date: string) => updateMeta('date', date)
const updateName = async (name: string) => updateMeta('name', name)
const updateSplash = async (splash: string) => updateMeta('splash', splash)

export default {
  get,
  updateAuthor,
  updateLocation,
  updateDate,
  updateName,
  updateSplash
}
