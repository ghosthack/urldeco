import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  
  // Version
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Auto updater
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
  
  // Event listeners
  onUpdateAvailable: (callback: (info: { version: string }) => void) => {
    ipcRenderer.on('update-available', (_event, info) => callback(info))
  },
  onUpdateDownloaded: (callback: (info: { version: string }) => void) => {
    ipcRenderer.on('update-downloaded', (_event, info) => callback(info))
  },
  onUpdateError: (callback: (error: string) => void) => {
    ipcRenderer.on('update-error', (_event, error) => callback(error))
  },
  onUpdateProgress: (callback: (progress: { percent: number }) => void) => {
    ipcRenderer.on('download-progress', (_event, progress) => callback(progress))
  },
})

// TypeScript declaration
declare global {
  interface Window {
    electronAPI: {
      platform: string
      getVersion: () => Promise<string>
      checkForUpdates: () => Promise<void>
      quitAndInstall: () => Promise<void>
      onUpdateAvailable: (callback: (info: { version: string }) => void) => void
      onUpdateDownloaded: (callback: (info: { version: string }) => void) => void
      onUpdateError: (callback: (error: string) => void) => void
      onUpdateProgress: (callback: (progress: { percent: number }) => void) => void
    }
  }
}
