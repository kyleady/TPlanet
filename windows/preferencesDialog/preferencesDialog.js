'use strict';

const {ipcRenderer} = require('electron');

function applyPreferences(){
  var tpdir = document.getElementById("tpdir");
  var previewwidth = document.getElementById("previewwidth");

  var preferences = {};
  preferences.TPDir = tpdir.value;
  preferences.PreviewWidth = Number(previewwidth.value) || 200;

  ipcRenderer.send('submit-preferences-dialog', preferences);
}

ipcRenderer.on('load-preferences-dialog', function(ev, preferences){
  var tpdir = document.getElementById("tpdir");
  var previewwidth = document.getElementById("previewwidth");

  tpdir.value = preferences["TPDir"];
  previewwidth.value = preferences["PreviewWidth"].toString();

  ipcRenderer.send('show-preferences-dialog');
});

var applyButton = document.getElementById("applybutton");
applyButton.addEventListener("click", applyPreferences);
