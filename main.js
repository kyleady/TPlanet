const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let colorDialog = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow()

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'windows/index/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  createColorDialog()
  connectColorDialog()
}

function connectColorDialog(){
  ipcMain.on('show-color-dialog', (e, arg) => {
    colorDialog.show();
  })
  ipcMain.on('hide-color-dialog', (e, arg) => {
    colorDialog.hide();
  })
  ipcMain.on('load-color-dialog', (e,arg) => {
    if(!colorDialog){
      createColorDialog();
      colorDialog.once('ready-to-show', () => {
        colorDialog.webContents.send('load-color-dialog', arg);
      })
    } else {
      colorDialog.webContents.send('load-color-dialog', arg);
    }
  })
  ipcMain.on('submit-color-dialog', (e, arg) => {
    mainWindow.webContents.send('submit-color-dialog', arg);
  })
}

function createColorDialog(){
  colorDialog = new BrowserWindow({parent: mainWindow, modal: true, show: false, height: 375})
  colorDialog.loadURL(url.format({
    pathname: path.join(__dirname, 'windows/colorDialog/colorDialog.html'),
    protocol: 'file:',
    slashes: true
  }))
  colorDialog.setMenu(null);
  colorDialog.once('close',() => {colorDialog = null})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
