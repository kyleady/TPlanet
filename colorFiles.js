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

function loadColorOptions(){
  var combobox = document.getElementById("coloroptions");
  removeColorOptions(combobox);
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

loadColorOptions();
