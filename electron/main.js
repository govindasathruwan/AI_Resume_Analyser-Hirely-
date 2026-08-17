const { app, BrowserWindow, shell, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let serverInstance = null;

// Determine environment
const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';

async function startBackendServer() {
  const userDataPath = app.getPath('userData');
  const uploadDir = path.join(userDataPath, 'uploads');
  const dbPath = path.join(userDataPath, 'ai_resume_analyser.sqlite');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  process.env.DB_DIALECT = process.env.DB_DIALECT || 'sqlite';
  process.env.SQLITE_STORAGE_PATH = dbPath;
  process.env.UPLOAD_DIR = uploadDir;
  process.env.PORT = process.env.PORT || '5050';

  const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
  process.env.FRONTEND_DIST = frontendDistPath;

  try {
    const backend = require('../backend/src/index.js');
    const { server, port } = await backend.startServer({
      port: parseInt(process.env.PORT, 10),
      isElectron: true,
    });
    serverInstance = server;
    console.log(`Backend Express server started on port ${port}`);
    return port;
  } catch (error) {
    console.error('Failed to start backend server:', error);
    throw error;
  }
}

function createMainWindow(serverPort) {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'Hirely - AI Resume & ATS Analyser',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    show: false,
    titleBarStyle: 'default',
  });

  const appUrl = isDev && process.env.DEV_SERVER_URL
    ? process.env.DEV_SERVER_URL
    : `http://localhost:${serverPort}`;

  console.log(`Loading Desktop App UI from: ${appUrl}`);

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      window.ELECTRON_API_URL = "http://localhost:${serverPort}/api";
    `).catch(() => {});
  });

  mainWindow.loadURL(appUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in default browser while allowing internal app navigation
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
      return { action: 'allow' };
    }
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createApplicationMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: 'About AI Resume Analyser' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit AI Resume Analyser' }
      ]
    }] : []),
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(async () => {
  createApplicationMenu();
  try {
    const port = await startBackendServer();
    createMainWindow(port);
  } catch (err) {
    console.error('Initialization error:', err);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && serverInstance) {
      const port = serverInstance.address().port;
      createMainWindow(port);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (serverInstance) {
    serverInstance.close();
  }
});
