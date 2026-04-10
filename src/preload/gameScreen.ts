import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/types/ipc'
import type { GameState } from '@shared/types/state'

const api = {
  onStateUpdate: (callback: (state: GameState) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, state: GameState): void => callback(state)
    ipcRenderer.on(IPC.STATE_UPDATE, handler)
    return () => ipcRenderer.removeListener(IPC.STATE_UPDATE, handler)
  }
}

export type GameScreenApi = typeof api

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('api', api)
} else {
  // @ts-expect-error fallback for non-isolated context
  window.api = api
}
