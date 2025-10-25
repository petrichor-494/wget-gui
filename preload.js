const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // System checks
  checkWget: () => ipcRenderer.invoke('check-wget'),
  
  // Directory operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // Queue operations
  addToQueue: (options) => ipcRenderer.invoke('add-to-queue', options),
  getQueue: () => ipcRenderer.invoke('get-queue'),
  cancelDownload: (id) => ipcRenderer.invoke('cancel-download', id),
  clearQueue: () => ipcRenderer.invoke('clear-queue'),
  
  // File operations
  openFileLocation: (filePath) => ipcRenderer.invoke('open-file-location', filePath),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  
  // History operations
  getHistory: () => ipcRenderer.invoke('get-history'),
  saveToHistory: (item) => ipcRenderer.invoke('save-to-history', item),
  deleteHistoryItem: (id) => ipcRenderer.invoke('delete-history-item', id),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  
  // Preferences
  getPreferences: () => ipcRenderer.invoke('get-preferences'),
  savePreferences: (prefs) => ipcRenderer.invoke('save-preferences', prefs),
  
  // Event listeners
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data));
  },
  onDownloadComplete: (callback) => {
    ipcRenderer.on('download-complete', (event, data) => callback(data));
  },
  onDownloadError: (callback) => {
    ipcRenderer.on('download-error', (event, data) => callback(data));
  },
  onQueueUpdated: (callback) => {
    ipcRenderer.on('queue-updated', (event, data) => callback(data));
  },
  
  // Remove listeners
  removeDownloadListeners: () => {
    ipcRenderer.removeAllListeners('download-progress');
    ipcRenderer.removeAllListeners('download-complete');
    ipcRenderer.removeAllListeners('download-error');
    ipcRenderer.removeAllListeners('queue-updated');
  }
});