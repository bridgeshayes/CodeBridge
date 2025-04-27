import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  openFolder: () => ipcRenderer.invoke('open-folder'),
  readDir: (dirPath: string) => ipcRenderer.invoke('read-dir', dirPath),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  saveFile: (filePath: string, content: string) => ipcRenderer.invoke('save-file', filePath, content),
  gitStatus: (repoPath: string) => ipcRenderer.invoke('git-status', repoPath),
  gitDiff: (repoPath: string, file: string) => ipcRenderer.invoke('git-diff', repoPath, file),
}); 