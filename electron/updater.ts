import { autoUpdater } from 'electron-updater'
import { BrowserWindow, dialog } from 'electron'
import log from 'electron-log'

// Configure logging
autoUpdater.logger = log

let mainWindow: BrowserWindow | null = null

export function setupAutoUpdater(win: BrowserWindow) {
  mainWindow = win

  // Configure auto updater
  autoUpdater.checkForUpdatesAndNotify()

  // Check for updates on startup (with delay to not block UI)
  setTimeout(() => {
    checkForUpdates()
  }, 3000)

  // Auto updater events
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...')
  })

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info)
    mainWindow?.webContents.send('update-available', { version: info.version })
    
    dialog.showMessageBox(mainWindow!, {
      type: 'info',
      title: 'Update Available',
      message: `A new version (${info.version}) is available. It will be downloaded in the background.`,
      buttons: ['OK']
    })
  })

  autoUpdater.on('update-not-available', () => {
    log.info('Update not available')
  })

  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err)
    mainWindow?.webContents.send('update-error', err.message)
  })

  autoUpdater.on('download-progress', (progress) => {
    log.info(`Download progress: ${progress.percent}%`)
    mainWindow?.webContents.send('download-progress', { 
      percent: Math.round(progress.percent) 
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info)
    mainWindow?.webContents.send('update-downloaded', { version: info.version })
    
    dialog.showMessageBox(mainWindow!, {
      type: 'info',
      title: 'Update Ready',
      message: `Version ${info.version} has been downloaded. Restart the application to apply the updates.`,
      buttons: ['Restart Now', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })
}

export async function checkForUpdates() {
  try {
    await autoUpdater.checkForUpdates()
  } catch (error) {
    log.error('Failed to check for updates:', error)
  }
}

export function quitAndInstall() {
  autoUpdater.quitAndInstall()
}
