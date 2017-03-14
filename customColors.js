function getColorList(section){
  var table = document.getElementById(section + "table");
  var colorlist = [];
  for(var i = table.rows.length-1; i >= 0; i--){
    var label = table.rows[i].cells[0].innerHTML;
    var style = table.rows[i].cells[1].style['background-color'];
    var colorObj = new ColorObj(style, label);
    colorlist.push(colorObj);
  }
  return colorlist;
}

function modifyColorLists(colorObj, section){
  var colorlists = {
    land: getColorList('land'),
    water: getColorList('water')
  }

  var Inserted = false;
  for(var i = 0, l = colorlists[section].length; i < l; i++){
    if(colorObj.index == colorlists[section][i].index){
      colorlists[section][i] = colorObj;
      Inserted = true;
      break;
    } else if(colorObj.index < colorlists[section][i].index) {
      colorlists[section].splice(i, 0, colorObj);
      Inserted = true;
      break;
    }
  }
  if(!Inserted){
    colorlists[section].push(colorObj);
  }
  return colorlists;
}

function colorLists2Data(colorlists){
  var output = "";
  //black
  output += "0 0 0 0";
  //white
  output += "\r\n";
  output += "1 255 255 255";
  //background-color
  output += "\r\n";
  output += "2 255 255 255";
  //grid lines
  output += "\r\n";
  output += "3 0 0 0";
  //outline
  output += "\r\n";
  output += "4 0 0 0";
  //contour
  output += "\r\n";
  output += "5 255 0 0";
  //water colors
  for(var i = 0, l = colorlists['water'].length; i < l; i++){
    output += "\r\n";
    output += colorlists['water'][i].toData(6);
  }
  //land colors
  for(var i = 0, l = colorlists['land'].length; i < l; i++){
    output += "\r\n";
    output += colorlists['land'][i].toData(6 + 10001);
  }

  return output;
}

function saveColorLists(colorlists, colorfile){
  colorfile = colorfile || 'custom.col';
  var data = colorLists2Data(colorlists);

  fs.writeFile(TPDir + "\\" + colorfile, data, function (err) {
    if(err){
      alert("An error ocurred creating the file: "+ err.message)
    }
    document.getElementById('coloroptions').value = colorfile;
    displayColors.displayColorLists();
    generate.preview();
  });
}

function removeColor(index, section){
  var colorlists = {
    land: getColorList('land'),
    water: getColorList('water')
  }

  for(var i = 0, l = colorlists[section].length; i < l; i++){
    if(index == colorlists[section][i].index){
      colorlists[section].splice(i,1);
      break;
    }
  }

  return colorlists;
}

function removeClicked(ev){
  var row = ev.currentTarget.parentNode.parentNode;
  var matches = row.id.match(/^(land|water)row(\d+)$/);
  var section = matches[1];
  var index = Number(matches[2]);

  var colorlists = removeColor(index, section);
  saveColorLists(colorlists);
}

function openColorDialog(ev){
  var row = ev.currentTarget.parentNode;
  var label = row.cells[0].innerHTML;
  var style = row.cells[1].style['background-color'];
  var matches = row.id.match(/^(land|water)/);

  var colorObj = new ColorObj(style, label);
  colorObj.section = matches[1];

  ipcRenderer.send('load-color-dialog', colorObj);
}

ipcRenderer.on('submit-color-dialog', (ev, args) => {
  var colorObj = new ColorObj(args);
  console.log(args);
  console.log(colorObj);
  var colorlists = modifyColorLists(colorObj, args.section);
  saveColorLists(colorlists);
  ipcRenderer.send('hide-color-dialog');
})

exports.openColorDialog = openColorDialog;
exports.removeClicked = removeClicked;
