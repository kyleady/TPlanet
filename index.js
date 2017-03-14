'use strict';

//initialize variables
var fs = require('fs');
var Seed = Math.random();
var PreviewWidth = 200;
const {ipcRenderer} = require('electron')
//this value needs to be set by the user
//it is the directory of torbenm's planet generator on their local machine
var TPDir = "";

const generate = require("./generateMap.js");
require("./colorFiles.js");
const displayColors = require("./displayColors.js");
const customColors = require("./customColors.js");
