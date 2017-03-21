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

ipcMain.on('delete-color-file', function(ev, filename){
  dialog.showMessageBox(fileDialog, {
    type: "warning",
    buttons: ["yes", "no"],
    title: "Warning!",
    message: "Are you sure you want to delete " + filename + "?"
  }, function(response){
    if(response == 0){
      mainWindow.webContents.send('delete-color-file');
    }
  });
});

ipcMain.on('show-error-dialog', function(ev, args){
  console.log('test')
  dialog.showMessageBox(fileDialog, {
    type: "error",
    buttons: ["Ok"],
    title: "Error",
    message: args
  });
});

exports.create = createFileDialog;
