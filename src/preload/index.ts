import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ipcRenderer: {
        invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
        on: (channel: string, listener: (...args: any[]) => void) =>
          ipcRenderer.on(channel, (_event, ...args) => listener(...args)),
        removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
      }
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
