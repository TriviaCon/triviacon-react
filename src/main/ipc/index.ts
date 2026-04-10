import { ipcMain, dialog } from 'electron'
import { IPC } from '@shared/types/ipc'
import { QUIZ_FILE_FILTER } from '@shared/constants'
import db from '../../data/db'
import categories from '../../data/categories'
import questions from '../../data/questions'
import answerOptions from '../../data/answerOptions'
import meta from '../../data/meta'

export function registerIpcHandlers(): void {
  // ── File operations ──────────────────────────────────────────────

  ipcMain.handle(IPC.FILE_NEW, async () => {
    const result = await dialog.showSaveDialog({
      filters: [QUIZ_FILE_FILTER]
    })
    if (result.canceled || !result.filePath) return null
    await db.new(result.filePath)
    return result.filePath
  })

  ipcMain.handle(IPC.FILE_OPEN, async () => {
    const result = await dialog.showOpenDialog({
      filters: [QUIZ_FILE_FILTER],
      properties: ['openFile']
    })
    if (result.canceled || result.filePaths.length === 0) return null
    const filePath = result.filePaths[0]
    await db.open(filePath)
    return filePath
  })

  ipcMain.handle(IPC.FILE_SAVE, async () => {
    // Current file is already being written to in-place via SQLite
    return true
  })

  ipcMain.handle(IPC.FILE_SAVE_AS, async () => {
    const result = await dialog.showSaveDialog({
      filters: [QUIZ_FILE_FILTER]
    })
    if (result.canceled || !result.filePath) return null
    // TODO: copy current DB to new path
    return result.filePath
  })

  // ── Categories ───────────────────────────────────────────────────

  ipcMain.handle(IPC.QUIZ_CATEGORIES_ALL, () => categories.all())

  ipcMain.handle(IPC.QUIZ_CATEGORY_BY_ID, (_, id: number) => categories.byId(id))

  ipcMain.handle(IPC.QUIZ_CATEGORY_CREATE, (_, name: string) => categories.create(name))

  ipcMain.handle(IPC.QUIZ_CATEGORY_UPDATE, (_, id: number, name: string) =>
    categories.update(id, name)
  )

  ipcMain.handle(IPC.QUIZ_CATEGORY_REMOVE, (_, id: number) => categories.remove(id))

  // ── Questions ────────────────────────────────────────────────────

  ipcMain.handle(IPC.QUIZ_QUESTIONS_BY_CATEGORY, (_, categoryId: number) =>
    questions.allByCategoryId(categoryId)
  )

  ipcMain.handle(IPC.QUIZ_QUESTION_BY_ID, (_, id: number) => questions.byId(id))

  ipcMain.handle(IPC.QUIZ_QUESTION_CREATE, (_, question) => questions.create(question))

  ipcMain.handle(IPC.QUIZ_QUESTION_UPDATE, (_, id: number, updates) =>
    questions.update(id, updates)
  )

  ipcMain.handle(IPC.QUIZ_QUESTION_DELETE, (_, id: number) => questions.delete(id))

  // ── Answer Options ───────────────────────────────────────────────

  ipcMain.handle(IPC.QUIZ_ANSWER_OPTIONS_BY_QUESTION, (_, questionId: number) =>
    answerOptions.byQuestionId(questionId)
  )

  ipcMain.handle(
    IPC.QUIZ_ANSWER_OPTION_CREATE,
    (_, questionId: number, text?: string, correct?: boolean, sortOrder?: number) =>
      answerOptions.create(questionId, text, correct, sortOrder)
  )

  ipcMain.handle(IPC.QUIZ_ANSWER_OPTION_UPDATE, (_, id: number, fields) =>
    answerOptions.update(id, fields)
  )

  ipcMain.handle(IPC.QUIZ_ANSWER_OPTION_REMOVE, (_, id: number) => answerOptions.remove(id))

  // ── Meta ─────────────────────────────────────────────────────────

  ipcMain.handle(IPC.QUIZ_META_GET, () => meta.get())

  ipcMain.handle(IPC.QUIZ_META_UPDATE_NAME, (_, name: string) => meta.updateName(name))

  ipcMain.handle(IPC.QUIZ_META_UPDATE_AUTHOR, (_, author: string) => meta.updateAuthor(author))

  ipcMain.handle(IPC.QUIZ_META_UPDATE_DATE, (_, date: string) => meta.updateDate(date))

  ipcMain.handle(IPC.QUIZ_META_UPDATE_LOCATION, (_, location: string) =>
    meta.updateLocation(location)
  )

  ipcMain.handle(IPC.QUIZ_META_UPDATE_SPLASH, (_, splash: string) => meta.updateSplash(splash))

  // ── Stats ────────────────────────────────────────────────────────

  ipcMain.handle(IPC.QUIZ_STATS, () => db.getStats())
}
