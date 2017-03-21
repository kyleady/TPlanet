const path = require('path');
const {ipcRenderer} = require('electron');
const exec = require('child_process').exec;

ipcRenderer.on('save-map', function(ev, filename){
  var copyFrom = path.join(TPDir, "GUIplanet.bmp");
  fs.copy(copyFrom, filename, { replace: true }, function (err) {
    if (err) {
      console.error(err);
    }
    alert("Map Saved");
  });
});

ipcRenderer.on('save-color-file', function(ev, filename){
  var copyFrom = path.join(TPDir, "custom.col");
  fs.copy(copyFrom, filename, { replace: true }, function (err) {
    if (err) {
      console.error(err);
    }
    alert("Color File Saved");
  });
});

ipcRenderer.on('delete-color-file', function(ev){
  var colorfile = document.getElementById("coloroptions").value;
  var filepath = path.join(TPDir, colorfile);
  fs.unlinkSync(filepath);
  colorOptions.load();
  colorLists.show();
  generate.preview();
});

function deleteCurrentColorfile(ev){
  var colorfile = document.getElementById("coloroptions").value;
  ipcRenderer.send('delete-color-file', colorfile);
}

document.getElementById("colorfilekiller").addEventListener('click', deleteCurrentColorfile);
