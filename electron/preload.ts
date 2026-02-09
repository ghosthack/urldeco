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
    const listener = (_event: Electron.IpcRendererEvent, info: { version: string }) => callback(info)
    ipcRenderer.on('update-available', listener)
    return () => { ipcRenderer.removeListener('update-available', listener) }
  },
  onUpdateDownloaded: (callback: (info: { version: string }) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, info: { version: string }) => callback(info)
    ipcRenderer.on('update-downloaded', listener)
    return () => { ipcRenderer.removeListener('update-downloaded', listener) }
  },
  onUpdateError: (callback: (error: string) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, error: string) => callback(error)
    ipcRenderer.on('update-error', listener)
    return () => { ipcRenderer.removeListener('update-error', listener) }
  },
  onUpdateProgress: (callback: (progress: { percent: number }) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, progress: { percent: number }) => callback(progress)
    ipcRenderer.on('download-progress', listener)
    return () => { ipcRenderer.removeListener('download-progress', listener) }
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
      onUpdateAvailable: (callback: (info: { version: string }) => void) => () => void
      onUpdateDownloaded: (callback: (info: { version: string }) => void) => () => void
      onUpdateError: (callback: (error: string) => void) => () => void
      onUpdateProgress: (callback: (progress: { percent: number }) => void) => () => void
    }
  }
}
