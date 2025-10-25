const { app, BrowserWindow, ipcMain, dialog, shell, Notification } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let downloadQueue = [];
let activeDownloads = new Map();
const MAX_CONCURRENT = 3;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Check if wget is installed
ipcMain.handle('check-wget', async () => {
  return new Promise((resolve) => {
    const check = spawn('which', ['wget']);
    check.on('close', (code) => {
      resolve(code === 0);
    });
  });
});

// Select download directory
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Helper function to serialize queue data
function serializeQueueData() {
  return {
    queue: downloadQueue.map(item => ({
      id: item.id,
      url: item.url,
      outputPath: item.outputPath,
      addedAt: item.addedAt
    })),
    active: Array.from(activeDownloads.values()).map(d => ({
      id: d.id,
      url: d.url,
      progress: d.progress,
      filename: d.filename,
      totalSize: d.totalSize,
      speed: d.speed,
      eta: d.eta,
      status: d.status
    }))
  };
}

// Process download queue
function processQueue() {
  const activeCount = activeDownloads.size;
  
  if (activeCount >= MAX_CONCURRENT || downloadQueue.length === 0) {
    return;
  }
  
  const item = downloadQueue.shift();
  startSingleDownload(item);
  
  mainWindow.webContents.send('queue-updated', serializeQueueData());
  
  if (downloadQueue.length > 0) {
    processQueue();
  }
}

function startSingleDownload({ id, url, outputPath, options }) {
  const args = [];
  
  if (options.continue) args.push('-c');
  if (options.recursive) args.push('-r');
  if (options.timestamping) args.push('-N');
  if (options.noCache) args.push('--no-cache');
  if (options.userAgent) args.push('--user-agent=Mozilla/5.0');
  if (options.limitRate && options.rateLimit && options.rateLimit.trim() !== '') {
  args.push(`--limit-rate=${options.rateLimit.trim()}`);
}
  
  args.push('-P', outputPath);
  args.push('--progress=bar:force');
  args.push(url);

  const downloadProcess = spawn('wget', args);
  
  const downloadInfo = {
    id,
    url,
    outputPath,
    process: downloadProcess,
    progress: 0,
    filename: '',
    totalSize: '',
    speed: '',
    eta: '',
    status: 'downloading'
  };
  
  activeDownloads.set(id, downloadInfo);

  downloadProcess.stderr.on('data', (data) => {
    const output = data.toString();
    
    const filenameMatch = output.match(/Saving to: ['"](.+?)['"]/);
    if (filenameMatch) {
      downloadInfo.filename = path.basename(filenameMatch[1]);
      downloadInfo.fullPath = path.join(outputPath, path.basename(filenameMatch[1]));
    }

    const sizeMatch = output.match(/Length: (\d+) \(([\d.]+[KMG]?)\)/);
    if (sizeMatch) {
      downloadInfo.totalSize = sizeMatch[2];
    }

    const progressMatch = output.match(/(\d+)%/);
    if (progressMatch) {
      downloadInfo.progress = parseInt(progressMatch[1]);
      
      const speedMatch = output.match(/([\d.]+[KMG]?B\/s)/);
      const etaMatch = output.match(/eta (\S+)/);
      
      downloadInfo.speed = speedMatch ? speedMatch[1] : '';
      downloadInfo.eta = etaMatch ? etaMatch[1] : '';
    }
    
    mainWindow.webContents.send('download-progress', {
      id,
      progress: downloadInfo.progress,
      speed: downloadInfo.speed,
      eta: downloadInfo.eta,
      filename: downloadInfo.filename,
      totalSize: downloadInfo.totalSize
    });
  });

  downloadProcess.on('close', (code) => {
    const success = code === 0;
    
    if (success && Notification.isSupported()) {
      new Notification({
        title: 'Download Complete',
        body: `${downloadInfo.filename || 'File'} downloaded successfully!`,
        icon: path.join(__dirname, 'icon.png')
      }).show();
    }
    
    mainWindow.webContents.send('download-complete', {
      id,
      success,
      filename: downloadInfo.filename,
      totalSize: downloadInfo.totalSize,
      url,
      fullPath: downloadInfo.fullPath
    });
    
    activeDownloads.delete(id);
    processQueue();
  });

  downloadProcess.on('error', (error) => {
    mainWindow.webContents.send('download-error', {
      id,
      error: error.message
    });
    activeDownloads.delete(id);
    processQueue();
  });
}

// Add to download queue
ipcMain.handle('add-to-queue', async (event, { url, outputPath, options }) => {
  const id = Date.now() + Math.random();
  
  downloadQueue.push({
    id,
    url,
    outputPath,
    options,
    addedAt: new Date().toISOString()
  });
  
  mainWindow.webContents.send('queue-updated', serializeQueueData());
  
  processQueue();
  
  return { success: true, id };
});

// Get queue status
ipcMain.handle('get-queue', async () => {
  return serializeQueueData();
});

// Cancel specific download
ipcMain.handle('cancel-download', async (event, id) => {
  const download = activeDownloads.get(id);
  if (download) {
    download.process.kill();
    activeDownloads.delete(id);
    mainWindow.webContents.send('queue-updated', serializeQueueData());
    return { success: true };
  }
  
  const queueIndex = downloadQueue.findIndex(item => item.id === id);
  if (queueIndex !== -1) {
    downloadQueue.splice(queueIndex, 1);
    mainWindow.webContents.send('queue-updated', serializeQueueData());
    return { success: true };
  }
  
  return { success: false };
});

// Clear queue
ipcMain.handle('clear-queue', async () => {
  downloadQueue = [];
  mainWindow.webContents.send('queue-updated', serializeQueueData());
  return { success: true };
});

// Open file location
ipcMain.handle('open-file-location', async (event, filePath) => {
  try {
    shell.showItemInFolder(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open file
ipcMain.handle('open-file', async (event, filePath) => {
  try {
    await shell.openPath(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get download history
ipcMain.handle('get-history', async () => {
  const historyPath = path.join(app.getPath('userData'), 'history.json');
  
  try {
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading history:', error);
  }
  
  return [];
});

// Save to history
ipcMain.handle('save-to-history', async (event, item) => {
  const historyPath = path.join(app.getPath('userData'), 'history.json');
  
  try {
    let history = [];
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf8');
      history = JSON.parse(data);
    }
    
    history.unshift({
      ...item,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    
    history = history.slice(0, 100);
    
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving history:', error);
    return { success: false, error: error.message };
  }
});

// Delete history item
ipcMain.handle('delete-history-item', async (event, id) => {
  const historyPath = path.join(app.getPath('userData'), 'history.json');
  
  try {
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf8');
      let history = JSON.parse(data);
      history = history.filter(item => item.id !== id);
      fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Clear history
ipcMain.handle('clear-history', async () => {
  const historyPath = path.join(app.getPath('userData'), 'history.json');
  
  try {
    if (fs.existsSync(historyPath)) {
      fs.unlinkSync(historyPath);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get/Set preferences
ipcMain.handle('get-preferences', async () => {
  const prefsPath = path.join(app.getPath('userData'), 'preferences.json');
  
  try {
    if (fs.existsSync(prefsPath)) {
      const data = fs.readFileSync(prefsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading preferences:', error);
  }
  
  return { darkMode: false };
});

ipcMain.handle('save-preferences', async (event, prefs) => {
  const prefsPath = path.join(app.getPath('userData'), 'preferences.json');
  
  try {
    fs.writeFileSync(prefsPath, JSON.stringify(prefs, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});