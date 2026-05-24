const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Nino PDV",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Em desenvolvimento, carrega a URL do Vite
  // Em produção, carrega o arquivo index.html da pasta dist
  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools(); // Aberto por padrão como solicitado
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Remove a barra de menus padrão (File, Edit, etc)
  Menu.setApplicationMenu(null);
}

app.whenReady().then(createWindow);

// Gerenciamento de janelas via IPC
ipcMain.on('set-window-size', (event, { width, height, resizable, maximizable, minimizable, centered }) => {
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  if (win) {
    win.setResizable(resizable);
    win.setMaximizable(maximizable);
    win.setSize(width, height);
    win.setMinimizable(minimizable !== undefined ? minimizable : true);
    if (centered) win.center();
  }
});

ipcMain.on('maximize-window', () => {
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  if (win) {
    win.setResizable(true);
    win.setMaximizable(true);
    win.maximize();
  }
});

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
