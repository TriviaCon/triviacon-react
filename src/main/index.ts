import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import {
  createControlPanelWindow,
  createGameScreenWindow,
  toggleGameScreenFullscreen
} from './windows'
import { registerIpcHandlers } from './ipc'
import { IPC } from '@shared/types/ipc'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.triviacon.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()

  // Display management
  ipcMain.handle(IPC.DISPLAY_OPEN_SCREEN, () => {
    createGameScreenWindow()
  })

  ipcMain.handle(IPC.DISPLAY_TOGGLE_FULLSCREEN, () => {
    return toggleGameScreenFullscreen()
  })

  ipcMain.handle(IPC.WINDOW_CLOSE, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.close()
  })

  createControlPanelWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createControlPanelWindow()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
