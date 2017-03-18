const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')

function createColorDialog(){
  colorDialog = new BrowserWindow({parent: mainWindow, modal: true, show: false, height: 400})
  colorDialog.loadURL(url.format({
    pathname: path.join(__dirname, 'windows/colorDialog/colorDialog.html'),
    protocol: 'file:',
    slashes: true
  }))
  colorDialog.setMenu(null);
  colorDialog.once('close',() => {colorDialog = null})
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

exports.create = createColorDialog;
exports.connect = connectColorDialog;
