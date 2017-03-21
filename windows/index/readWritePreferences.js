const path = require('path');
const {ipcRenderer} = require('electron');
//const generate = require('./generateMap.js')

function readPreferences(){
  var data = fs.readFileSync(path.join(__dirname, 'preferences.json'), 'utf8');
  var preferences = JSON.parse(data);
  console.log(preferences);
  if(preferences){
    if( preferences['TPDir'] == "" || preferences['TPDir']){
      TPDir = preferences['TPDir'];
    }
    if(preferences['PreviewWidth']){
      PreviewWidth = preferences['PreviewWidth'];
    }
  } else {
    alert("preferences.json is improperly formatted.")
  }
}

function writePreferences(){
  var preferences = {
    TPDir: TPDir,
    PreviewWidth: PreviewWidth
  }
  fs.writeFile(path.join(__dirname, 'preferences.json'), JSON.stringify(preferences), function (err) {
    if(err){
      alert("An error ocurred while saving to preferences.json: " + err.message)
    }
    generate.preview();
  });
}

function specifyTPDir(){
  ipcRenderer.send('show-file-dialog');
}

ipcRenderer.on('return-tpdir', function(ev, filePath){
  console.log('filePath')
  console.log(filePath)
  TPDir = filePath;
  writePreferences();
  generate.preview();
  colorOptions.load();
  colorLists.show();
  colorLists.connectDetails();
});

ipcRenderer.on('load-preferences-dialog', function(ev, args){
  var preferences = {
    TPDir: TPDir,
    PreviewWidth: PreviewWidth
  }
  ipcRenderer.send('load-preferences-dialog', preferences);
});

ipcRenderer.on('submit-preferences-dialog', function(ev, preferences){
  TPDir = preferences.TPDir;
  PreviewWidth = preferences.PreviewWidth;
  writePreferences();
  ipcRenderer.send('hide-preferences-dialog');
});

readPreferences();
if(TPDir == ""){
  specifyTPDir();
} else {
  generate.preview();
  colorOptions.load();
  colorLists.show();
  colorLists.connectDetails();
}

exports.read = readPreferences;
exports.write = writePreferences;
exports.specifyTPDir = specifyTPDir;
