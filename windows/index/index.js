'use strict';

//initialize variables
var TPDir = "";
var Seed = Math.random();
var PreviewWidth = 200;

var fs = require('fs');
const {ipcRenderer} = require('electron')


const ColorObj = require("./prototypes/colorObj.js");
const ColorCode = require("./prototypes/colorCode.js");

const generate = require("./generateMap.js");
const colorOptions = require("./loadColorOptions.js");
const colorLists = require("./displayColorLists.js");
const customColors = require("./colorEditting.js");
const Preferences = require('./readWritePreferences.js');
