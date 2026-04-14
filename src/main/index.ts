import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import {
  createControlPanelWindow,
  createGameScreenWindow,
  getControlPanelWindow,
  getGameScreenWindow,
  toggleGameScreenFullscreen
} from './windows'
import { registerIpcHandlers, getEngine } from './ipc'
import { IPC } from '@shared/types/ipc'
import { GamePhase } from '@shared/types/state'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.triviacon.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()

  // Display management
  ipcMain.handle(IPC.DISPLAY_OPEN_SCREEN, () => {
    const existing = getGameScreenWindow()
    if (existing) {
      existing.focus()
      return
    }

    const engine = getEngine()

    // Transition from Builder to Categories on first open
    if (engine.getState().phase === GamePhase.Builder) {
      engine.showCategories()
      const cp = getControlPanelWindow()
      if (cp && !cp.isDestroyed()) cp.webContents.send(IPC.STATE_UPDATE, engine.getState())
    }

    const win = createGameScreenWindow()
    win.webContents.once('did-finish-load', () => {
      if (!win.isDestroyed()) win.webContents.send(IPC.STATE_UPDATE, engine.getState())
    })
  })

  ipcMain.handle(IPC.DISPLAY_TOGGLE_FULLSCREEN, () => {
    return toggleGameScreenFullscreen()
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
