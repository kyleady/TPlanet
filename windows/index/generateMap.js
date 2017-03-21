const {ipcRenderer} = require('electron');
const path = require('path')

document.getElementById("showmap").onclick = function() {
  generateMap();
};

document.getElementById("randomizemap").onclick = function() {
  Seed = Math.random();
  generatePreview();
};

var inputs = document.getElementsByClassName("input");
for(var i = 0; i < inputs.length; i++){
  inputs[i].addEventListener("change", generatePreview);
}

function generatePreview(){
  generateMap(true);
}

function generateMap(isPreview){
  const exec = require('child_process').exec;
  disableInputs();
  exec( generateCMD(isPreview) ,{cwd: TPDir} , (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      ipcRenderer.send('show-error-dialog', `${error}`);
      enableInputs();
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if(isPreview){
      document.getElementById("map").src = path.join(TPDir,"GUIpreview.bmp?") + new Date().getTime();
    } else {
      document.getElementById("map").src = path.join(TPDir, "GUIplanet.bmp?") + new Date().getTime();
    }
    enableInputs();
  });
}

function generateCMD(isPreview){
  var planetCMD = "";

  if(!/^win/.test(process.platform)){
    planetCMD += "./";
  }
  planetCMD += "planet";

  planetCMD += " -s " + Seed;

  if(isPreview){
    //rescale the height to the preview width
    var height = Number(document.getElementById("height").value);
    var width = Number(document.getElementById("width").value);
    //be sure the height and width both exist and are positive
    if(height && width && height > 0 && width > 0){
      height = Math.round(PreviewWidth * height / width);
      planetCMD += " -h " + height.toString();
    }
    planetCMD += " -w " + PreviewWidth;
  } else {
    planetCMD += " -h " + document.getElementById("height").value;
    planetCMD += " -w " + document.getElementById("width").value;
  }

  planetCMD += " -m " + document.getElementById("magnification").value;
  if(isPreview){
    planetCMD += " -o GUIpreview.bmp";
  } else {
    planetCMD += " -o GUIplanet.bmp";
  }
  planetCMD += " -l " + document.getElementById("longitude").value;
  planetCMD += " -L " + document.getElementById("latitude").value;
  planetCMD += " -g " + document.getElementById("vgrid").value;
  planetCMD += " -G " + document.getElementById("hgrid").value;
  planetCMD += " -i " + document.getElementById("water").value;
  if(document.getElementById("colorbylatitude").checked){
    planetCMD += " -c";
  }
  if(document.getElementById("flattershores").checked){
    planetCMD += " -n";
  }
  if(document.getElementById("wrinklymap").checked){
    planetCMD += " -S";
  }

  planetCMD += " -C " + document.getElementById("coloroptions").value;
  planetCMD += document.getElementById("outline").value;
  planetCMD += document.getElementById("bumpmap").value;
  if(document.getElementById("daylightshading").checked){
    planetCMD += " -d";
  }
  planetCMD += " -a " + document.getElementById("lslongitude").value;
  planetCMD += " -A " + document.getElementById("lslatitude").value;
  planetCMD += " -V " + document.getElementById("dvariation").value;
  planetCMD += " -v " + document.getElementById("avariation").value;
  planetCMD += " -T " + document.getElementById("longituder").value;
  planetCMD += " " + document.getElementById("latituder").value;
  planetCMD += " -p " + document.getElementById("projection").value;

  return planetCMD;
}

function enableInputs(){
  disableInputs(false);
}

function disableInputs(disable){
  //by default, disable
  if(disable == undefined){
    disable = true;
  }
  document.getElementById("randomizemap").disabled = disable;
  document.getElementById("showmap").disabled = disable;
  var inputs = document.getElementsByClassName("input");
  for(var i = 0; i < inputs.length; i++){
    inputs[i].disabled = disable;
  }
}

exports.preview = generatePreview;
