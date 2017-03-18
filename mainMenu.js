const {Menu, dialog} = require('electron')
const preferencesD = require('./preferencesWindow.js')
const exec = require('child_process').exec;

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save Map',
        accelerator: 'CmdOrCtrl+S',
        click () {
          var filename = dialog.showSaveDialog(fileDialog, {
            title: "Save Map",
            filters: [
              {name: 'Images', extensions: ['bmp']}
            ]
          });
          if(filename){
            mainWindow.webContents.send("save-map", filename);
          }
        }
      },
      {
        label: 'Save Color File',
        accelerator: 'CmdOrCtrl+Shift+S',
        click () {
          var filename = dialog.showSaveDialog(fileDialog, {
            title: "Save Color File",
            filters: [
              {name: 'Color Files', extensions: ['col']}
            ]
          });
          if(filename){
            mainWindow.webContents.send("save-color-file", filename);
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+P',
        click () {
          mainWindow.webContents.send('load-preferences-dialog');
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'forcereload'
      },
      {
        role: 'toggledevtools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/kyleady/TPlanet/blob/master/README.md') }
      },
      {
        label: 'Search Issues',
        click () { require('electron').shell.openExternal('https://github.com/kyleady/TPlanet/issues') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
