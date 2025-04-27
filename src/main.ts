import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import simpleGit from 'simple-git';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // In development, load the file directly
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  // Open DevTools in development
  mainWindow.webContents.openDevTools();
}

// IPC handlers
ipcMain.handle('open-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

function readDirRecursive(dirPath: string): Array<any> {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  return items.map(item => {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      return {
        type: 'directory',
        name: item.name,
        path: fullPath,
        children: readDirRecursive(fullPath)
      };
    } else {
      return {
        type: 'file',
        name: item.name,
        path: fullPath
      };
    }
  });
}

ipcMain.handle('read-dir', async (_event, dirPath: string): Promise<any[]> => {
  try {
    return readDirRecursive(dirPath);
  } catch (e) {
    return [];
  }
});

ipcMain.handle('read-file', async (_event, filePath: string) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return '';
  }
});

ipcMain.handle('save-file', async (_event, filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
});

ipcMain.handle('git-status', async (_event, repoPath: string) => {
  try {
    const git = simpleGit(repoPath);
    return await git.status();
  } catch (e) {
    return { error: (e as Error).message };
  }
});

ipcMain.handle('git-diff', async (_event, repoPath: string, file: string) => {
  try {
    const git = simpleGit(repoPath);
    return await git.diff(['HEAD', file]);
  } catch (e) {
    return { error: (e as Error).message };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 