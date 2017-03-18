'use strict';

const {ipcRenderer} = require('electron');

function updateColorPreview(){
  var redslider = document.getElementById("redslider");
  var greenslider = document.getElementById("greenslider");
  var blueslider = document.getElementById("blueslider");
  var colorpreview = document.getElementById("colorpreview");
  colorpreview.style["background-color"] = "rgb(" + redslider.value + "," + greenslider.value + "," + blueslider.value + ")";
}

function submitColor(){
  var output = {};

  var redslider = document.getElementById("redslider");
  var greenslider = document.getElementById("greenslider");
  var blueslider = document.getElementById("blueslider");
  var sectioncombo = document.getElementById("sectioncombo");
  var index = document.getElementById("index");

  output.red     = redslider.value;
  output.green   = greenslider.value;
  output.blue    = blueslider.value;
  output.section = sectioncombo.value;
  output.index  = Math.floor(Number(index.value)*100);

  ipcRenderer.send('submit-color-dialog', output);
}

function setIndexVisibility(ev){
  var sectioncombo = document.getElementById("sectioncombo");
  var atline = document.getElementById("atline");

  if(sectioncombo.value == 'water' || sectioncombo.value == 'land'){
    atline.style['visibility'] = "visible";
  } else {
    atline.style['visibility'] = "hidden";
  }
}

ipcRenderer.on('load-color-dialog', function(ev, args){
  var redslider = document.getElementById("redslider");
  var greenslider = document.getElementById("greenslider");
  var blueslider = document.getElementById("blueslider");
  var colorpreview = document.getElementById("colorpreview");
  var sectioncombo = document.getElementById("sectioncombo");
  var index = document.getElementById("index");

  redslider.value                          = args.red;
  greenslider.value                        = args.green;
  blueslider.value                         = args.blue;
  colorreference.style["background-color"] = "rgb(" + redslider.value + "," + greenslider.value + "," + blueslider.value + ")";
  colorpreview.style["background-color"]   = "rgb(" + redslider.value + "," + greenslider.value + "," + blueslider.value + ")";
  sectioncombo.value                       = args.section;
  index.value                              = args.index / 100;

  setIndexVisibility();

  ipcRenderer.send('show-color-dialog');
});

document.getElementById("redslider").addEventListener("change", updateColorPreview);
document.getElementById("greenslider").addEventListener("change", updateColorPreview);
document.getElementById("blueslider").addEventListener("change", updateColorPreview);

document.getElementById("sectioncombo").addEventListener("change", setIndexVisibility);

document.getElementById("submitbutton").addEventListener("click", submitColor);
