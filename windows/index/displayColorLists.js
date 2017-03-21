const path = require('path')

function displayColorLists(){
  var colorfile = document.getElementById("coloroptions").value;
  fs.readFile(path.join(TPDir,colorfile), 'utf8', function(err, data){
    if(err) console.log("err: " + err);
    var colorCode = new ColorCode(data);
    displayColorDetails(colorCode);
    displayColorList(colorCode.water,'water');
    displayColorList(colorCode.land,'land');
  });
  var colorfilekiller = document.getElementById("colorfilekiller");
  if(colorfile == "custom.col"){
    colorfilekiller.disabled = true;
  } else {
    colorfilekiller.disabled = false;
  }
}

function displayColorList(colorlist, section){
  var table = document.getElementById(section + "table");
  clearColorList(table);
  for(var i = 0, l = colorlist.length; i < l; i++){
    addColorRow(colorlist[i], table, section);
  }
}

function connectColorDetails(){
  var details = ["background", "grid", "outline", "contour"];
  for(var i = 0, l = details.length; i < l; i++){
    var preview = document.getElementById(details[i] + "preview");
    preview.addEventListener("click", customColors.openColorDialog);
  }
}

function displayColorDetails(colorCode){
  var details = ["background", "grid", "outline", "contour"];
  for(var i = 0, l = details.length; i < l; i++){
    var preview = document.getElementById(details[i] + "preview");
    preview.style['background-color'] = colorCode[details[i]].toStyle();
  }
}

function clearColorList(table){
  var rows = table.rows;
  for(var i = 0, l = rows.length; i < l; i++){
      table.deleteRow(0);
  }
}

function addColorRow(colorObj, table, section){
  var row = table.insertRow(0);
  row.id = section + "row" + colorObj.index;
  addIndexCell(row, colorObj);
  addColorCell(row, colorObj);
  addRemoveButton(row, colorObj, section);
}

function addIndexCell(row, colorObj){
  var indexCell = row.insertCell(0);
  indexCell.innerHTML = colorObj.toLabel();
  indexCell.addEventListener("click", customColors.openColorDialog);
}

function addColorCell(row, colorObj){
  var colorCell = row.insertCell(1);
  colorCell.className = "colorbox";
  colorCell.style["background-color"] = colorObj.toStyle();
  colorCell.addEventListener("click", customColors.openColorDialog);
}

function addRemoveButton(row, colorObj, section){
  var removeCell = row.insertCell(2);
  var removeButton = document.createElement("button");
  removeButton.innerHTML = "X";
  removeButton.type = "button";
  removeButton.className = "colorButton";
  if((colorObj.index == 10000 && section == 'land') ||
     (colorObj.index == 0 && section == 'water')){
    removeButton.disabled = true;
  }
  removeButton.addEventListener("click", customColors.removeClicked);
  removeCell.className = "colorkiller";
  removeCell.appendChild(removeButton);
}

document.getElementById("coloroptions").addEventListener("change", displayColorLists);

exports.show = displayColorLists;
exports.connectDetails = connectColorDetails;
