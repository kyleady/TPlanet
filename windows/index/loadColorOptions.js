const path = require('path')

function loadColorOptions(){
  var combobox = document.getElementById("coloroptions");
  removeColorOptions(combobox);
  ensureCustomExists();
  addColorOption(combobox, "custom.col");
  fs.readdir(TPDir, function(err, dir){
    if(err) console.log("err: " + err);
    for(var i = 0, l = dir.length; i < l; i++) {
      var filePath = dir[i];
      if(/\.col$/.test(filePath) && filePath != "custom.col"){
        addColorOption(combobox, filePath);
      }
    }
  });
}

function ensureCustomExists(){
  if(!fs.existsSync(path.join(TPDir, "custom.col"))){
    var colorcode = new ColorCode();
    var bottomcolor = new ColorObj("0 0 0 255");
    var topcolor = new ColorObj("10000 0 0 150");
    colorcode.water = [bottomcolor, topcolor];
    bottomcolor = new ColorObj("0 255 255 255");
    topcolor = new ColorObj("10000 100 100 100");
    colorcode.land = [bottomcolor, topcolor];
    fs.writeFile(path.join(TPDir, "custom.col"), colorcode.toData(), function (err) {
      if(err){
        alert("An error ocurred creating the file: "+ err.message)
      }
    });
  }
}

function removeColorOptions(combobox){
  for (var i = 0, l = combobox.options.length; i < l; i++) {
    combobox.options[i] = null;
  }
}

function addColorOption(combobox, colorfile){
  var coloroption = document.createElement("option");
  coloroption.text = colorfile.replace(/\.col$/,"");
  coloroption.value = colorfile;
  combobox.add(coloroption);
}

exports.load = loadColorOptions;
