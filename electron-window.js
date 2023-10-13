const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const { server, PORT } = require('./server.js');

let mainWindow;

function createWindow() {
  const { screen } = require('electron');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width - 100,
    height: height - 100,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'public/assets', 'favicon.ico'),
    title: 'Singapore Lottery Ledger',
    autoHideMenuBar: true,
  });
  
  // mainWindow.webContents.openDevTools(); // uncomment for debugging errors with Inspector

  const startUrl = process.env.ELECTRON_START_URL || `http://localhost:${PORT}`;

  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Error listener for mainWindow
  mainWindow.webContents.on('crashed', () => {
    console.error('Main window crashed.');
    shutdownApp();
  });
}

function shutdownApp() {
  if (server) {
    server.close();
  }
  app.quit();
}

app.on('ready', () => {
  session.defaultSession.clearStorageData().then(() => {
    createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('quit', () => {
  console.log('Quitting application');
  if (server) {
    server.close();
  }
});

// Add error event listener to server
server.on('error', (err) => {
  console.error('Server error:', err);
  shutdownApp();
});

process.on('uncaughtException', (err) => {
  console.error('Unhandled exception in main process:', err);
  shutdownApp();
});