'use strict';

//initialize variables
var fs = require('fs');
var Seed = Math.random();
var PreviewWidth = 200;
const {ipcRenderer} = require('electron')
//this value needs to be set by the user
//it is the directory of torbenm's planet generator on their local machine
var TPDir = "";

const ColorObj = require("./prototypes/colorObj.js");
const ColorCode = require("./prototypes/colorCode.js");

const generate = require("./generateMap.js");
require("./loadColorOptions.js");
const displayColors = require("./displayColorLists.js");
const customColors = require("./colorEditting.js");
