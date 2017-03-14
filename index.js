'use strict';

//initialize variables
var fs = require('fs');
var Seed = Math.random();
var PreviewWidth = 200;
const {ipcRenderer} = require('electron')
//this value needs to be set by the user
//it is the directory of torbenm's planet generator on their local machine
var TPDir = "C:\\Users\\Kyle Ady\\Downloads\\tcc-0.9.24-win32-bin\\tcc\\planet";

const ColorObj = require("./colorObj.js");
const generate = require("./generateMap.js");
require("./colorFiles.js");
const displayColors = require("./displayColors.js");
const customColors = require("./customColors.js");
