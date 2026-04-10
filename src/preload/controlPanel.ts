import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/types/ipc'
import type { GameState } from '@shared/types/state'
import type { Question, AnswerOption } from '@shared/types/quiz'

const api = {
  // ── State subscription ─────────────────────────────────────────
  onStateUpdate: (callback: (state: GameState) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, state: GameState): void => callback(state)
    ipcRenderer.on(IPC.STATE_UPDATE, handler)
    return () => ipcRenderer.removeListener(IPC.STATE_UPDATE, handler)
  },

  // ── File operations ────────────────────────────────────────────
  fileNew: (): Promise<string | null> => ipcRenderer.invoke(IPC.FILE_NEW),
  fileOpen: (): Promise<string | null> => ipcRenderer.invoke(IPC.FILE_OPEN),
  fileSave: (): Promise<boolean> => ipcRenderer.invoke(IPC.FILE_SAVE),
  fileSaveAs: (): Promise<string | null> => ipcRenderer.invoke(IPC.FILE_SAVE_AS),

  // ── Categories ─────────────────────────────────────────────────
  categoriesAll: (): Promise<unknown> => ipcRenderer.invoke(IPC.QUIZ_CATEGORIES_ALL),
  categoryById: (id: number): Promise<unknown> => ipcRenderer.invoke(IPC.QUIZ_CATEGORY_BY_ID, id),
  categoryCreate: (name: string): Promise<number> =>
    ipcRenderer.invoke(IPC.QUIZ_CATEGORY_CREATE, name),
  categoryUpdate: (id: number, name: string): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_CATEGORY_UPDATE, id, name),
  categoryRemove: (id: number): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_CATEGORY_REMOVE, id),

  // ── Questions ──────────────────────────────────────────────────
  questionsByCategory: (categoryId: number): Promise<unknown> =>
    ipcRenderer.invoke(IPC.QUIZ_QUESTIONS_BY_CATEGORY, categoryId),
  questionById: (id: number): Promise<unknown> =>
    ipcRenderer.invoke(IPC.QUIZ_QUESTION_BY_ID, id),
  questionCreate: (question: Omit<Question, 'id'>): Promise<number> =>
    ipcRenderer.invoke(IPC.QUIZ_QUESTION_CREATE, question),
  questionUpdate: (id: number, updates: Partial<Omit<Question, 'id'>>): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_QUESTION_UPDATE, id, updates),
  questionDelete: (id: number): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_QUESTION_DELETE, id),

  // ── Answer Options ─────────────────────────────────────────────
  answerOptionsByQuestion: (questionId: number): Promise<unknown> =>
    ipcRenderer.invoke(IPC.QUIZ_ANSWER_OPTIONS_BY_QUESTION, questionId),
  answerOptionCreate: (
    questionId: number,
    text?: string,
    correct?: boolean,
    sortOrder?: number
  ): Promise<number> =>
    ipcRenderer.invoke(IPC.QUIZ_ANSWER_OPTION_CREATE, questionId, text, correct, sortOrder),
  answerOptionUpdate: (
    id: number,
    fields: Partial<Omit<AnswerOption, 'id' | 'questionId'>>
  ): Promise<void> => ipcRenderer.invoke(IPC.QUIZ_ANSWER_OPTION_UPDATE, id, fields),
  answerOptionRemove: (id: number): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_ANSWER_OPTION_REMOVE, id),

  // ── Meta ───────────────────────────────────────────────────────
  quizMetaGet: (): Promise<unknown> => ipcRenderer.invoke(IPC.QUIZ_META_GET),
  quizMetaUpdateName: (name: string): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_META_UPDATE_NAME, name),
  quizMetaUpdateAuthor: (author: string): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_META_UPDATE_AUTHOR, author),
  quizMetaUpdateDate: (date: string): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_META_UPDATE_DATE, date),
  quizMetaUpdateLocation: (location: string): Promise<void> =>
    ipcRenderer.invoke(IPC.QUIZ_META_UPDATE_LOCATION, location),

  // ── Stats ──────────────────────────────────────────────────────
  quizStats: (): Promise<unknown> => ipcRenderer.invoke(IPC.QUIZ_STATS),

  // ── Display management ─────────────────────────────────────────
  openGameScreen: (): Promise<void> => ipcRenderer.invoke(IPC.DISPLAY_OPEN_SCREEN),
  toggleGameFullscreen: (): Promise<boolean> =>
    ipcRenderer.invoke(IPC.DISPLAY_TOGGLE_FULLSCREEN),

  // ── Window management ──────────────────────────────────────────
  closeWindow: (): Promise<void> => ipcRenderer.invoke(IPC.WINDOW_CLOSE)
}

export type ControlPanelApi = typeof api

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('api', api)
} else {
  // @ts-expect-error fallback for non-isolated context
  window.api = api
}
