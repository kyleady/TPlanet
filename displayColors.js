function displayColorLists(){
  var colorfile = document.getElementById("coloroptions").value;
  fs.readFile(TPDir + "\\" + colorfile, 'utf8', function(err, data){
    if(err) console.log("err: " + err);
    var colorLists = data2ColorLists(data);
    displayColorList(smoothColorList(colorLists['water']),'water');
    displayColorList(smoothColorList(colorLists['land']),'land');
  });
}

function smoothColorList(colorlist){
  if(colorlist.length > 0){
    colorlist[0].index = 0;
    colorlist[colorlist.length-1].index = 10000;
  }

  return colorlist;
}

function data2ColorLists(data){
  var colors = data.match(/\D*(\d+)\D*(\d+)\D*(\d+)\D*(\d+)/g);
  var maxIndex = Number(colors[colors.length-1].match(/\d+/)) - 6;
  var waterColors = [];
  var landColors = [];
  for(var i = 0, l = colors.length; i < l; i++){
    var color = colors[i].match(/\D*(\d+)\D*(\d+)\D*(\d+)\D*(\d+)/);
    var index = Number(color[1]);
    if(index > 5){
      index = index-6;
      index = Math.round(index * 20001 / maxIndex);
      var colorObj = {
        index: index,
        red:   color[2],
        green: color[3],
        blue:  color[4]
      };
      if(index <= 10000){
        waterColors.push(colorObj);
      } else {
        colorObj.index = colorObj.index - 10001;
        landColors.push(colorObj);
      }
    }
  }
  return {
    land: landColors,
    water: waterColors
  }
}

function displayColorList(colorlist, section){
  var table = document.getElementById(section + "table");
  clearColorList(table);
  for(var i = 0, l = colorlist.length; i < l; i++){
    addColorRow(colorlist[i], table, section);
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

  var indexCell = row.insertCell(0);
  indexCell.innerHTML = colorObj.index/100 + "%";
  indexCell.addEventListener("click", customColors.openColorDialog);

  var colorCell = row.insertCell(1);
  colorCell.className = "colorbox";
  colorCell.style["background-color"] = "rgb(" + colorObj.red + "," + colorObj.green + "," + colorObj.blue + ")";
  colorCell.addEventListener("click", customColors.openColorDialog);

  var removeCell = row.insertCell(2);
  var removeButton = document.createElement("button");
  removeButton.innerHTML = "X";
  removeButton.type = "button";
  removeButton.className = "colorButton";
  if(colorObj.index == 10000 || colorObj.index == 0){
    removeButton.disabled = true;
  }
  removeButton.addEventListener("click", customColors.removeClicked);
  removeCell.className = "colorkiller";
  removeCell.appendChild(removeButton);
}

document.getElementById("coloroptions").addEventListener("change", displayColorLists);
displayColorLists();

exports.displayColorLists = displayColorLists;
