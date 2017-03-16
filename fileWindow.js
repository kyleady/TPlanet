const {ipcMain} = require('electron')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const {dialog} = require('electron')

function createFileDialog(){
  fileDialog = new BrowserWindow({parent: mainWindow, modal: true, show: false});
}

ipcMain.on('show-file-dialog', function(ev, args){
  var filePaths = dialog.showOpenDialog(fileDialog, {
    title: "Torbenm's Planet Generator Directory",
    properties: ['openDirectory']
  });
  if(filePaths && filePaths.length >= 1){
    mainWindow.webContents.send('return-tpdir', filePaths[0]);
  }
});

exports.create = createFileDialog;
