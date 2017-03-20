const path = require('path');
const {ipcRenderer} = require('electron');
const exec = require('child_process').exec;

ipcRenderer.on('save-map', function(ev, filename){
  var copyFrom = path.join(TPDir, "GUIplanet.bmp");
  exec( "copy \"" + copyFrom + "\" \"" + filename + "\"", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    alert("Map Saved")
  });
});

ipcRenderer.on('save-color-file', function(ev, filename){
  var copyFrom = path.join(TPDir, "custom.col");
  exec( "copy \"" + copyFrom + "\" \"" + filename + "\"", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    colorOptions.load();
    alert("Color File Saved")
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
