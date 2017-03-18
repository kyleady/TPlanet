const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')

function createPreferencesDialog(){
  preferencesDialog = new BrowserWindow({parent: mainWindow, modal: true, show: false, height: 250, width: 300})
  preferencesDialog.loadURL(url.format({
    pathname: path.join(__dirname, 'windows/preferencesDialog/preferencesDialog.html'),
    protocol: 'file:',
    slashes: true
  }))
  preferencesDialog.setMenu(null);
  preferencesDialog.once('close',() => {preferencesDialog = null})
}

function connectPreferencesDialog(){
  ipcMain.on('show-preferences-dialog', (e, arg) => {
    preferencesDialog.show();
  })
  ipcMain.on('hide-preferences-dialog', (e, arg) => {
    preferencesDialog.hide();
  })
  ipcMain.on('load-preferences-dialog', (e, preferences) => {
    if(!preferencesDialog){
      createPreferencesDialog();
      preferencesDialog.once('ready-to-show', () => {
        preferencesDialog.webContents.send('load-preferences-dialog', preferences);
      })
    } else {
      preferencesDialog.webContents.send('load-preferences-dialog', preferences);
    }
  })
  ipcMain.on('submit-preferences-dialog', (e, preferences) => {
    mainWindow.webContents.send('submit-preferences-dialog', preferences);
  })
}

exports.create = createPreferencesDialog;
exports.connect = connectPreferencesDialog;
