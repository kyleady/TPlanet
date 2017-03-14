function getColorList(section){
  var table = document.getElementById(section + "table");
  var colorlist = [];
  for(var i = table.rows.length-1; i >= 0; i--){
    var colorObj = {};
    var label = table.rows[i].cells[0].innerHTML;
    var color = table.rows[i].cells[1].style['background-color'];
    var matches = label.match(/^(\d+(?:\.\d+)?)%$/);
    console.log(table.rows[i].cells[0].innerHTML);
    console.log(section + "(" + i + "): " + matches[0]);
    colorObj.index = Math.floor(Number(matches[1])*100);
    matches = color.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    colorObj.red   = matches[1];
    colorObj.green = matches[2];
    colorObj.blue  = matches[3];

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
    console.log(colorObj.index + " == " + colorlists[section][i].index);
    if(colorObj.index == colorlists[section][i].index){
      colorlists[section][i].red = colorObj.red;
      colorlists[section][i].green = colorObj.green;
      colorlists[section][i].blue = colorObj.blue;
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
    console.log(i + "/" + colorlists['water'].length)
    output += "\r\n";
    output += (colorlists['water'][i].index + 6).toString();
    output += " " + colorlists['water'][i].red;
    output += " " + colorlists['water'][i].green;
    output += " " + colorlists['water'][i].blue;
  }
  //land colors
  for(var i = 0, l = colorlists['land'].length; i < l; i++){
    output += "\r\n";
    output += (colorlists['land'][i].index + 6 + 10001).toString();
    output += " " + colorlists['land'][i].red;
    output += " " + colorlists['land'][i].green;
    output += " " + colorlists['land'][i].blue;
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
    console.log(index + " == " + colorlists[section][i].index)
    if(index == colorlists[section][i].index){
      console.log("deleted")
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
  var labelCell = row.cells[0];
  var colorCell = row.cells[1];
  var output = {};

  var matches = colorCell.style['background-color'].match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  output.red = Number(matches[1]);
  output.green = Number(matches[2]);
  output.blue = Number(matches[3]);
  matches = row.id.match(/^(land|water)/);
  output.section = matches[1];
  matches = labelCell.innerHTML.match(/(\d+(?:\.\d+)?)%/);
  output.index    = matches[1];

  ipcRenderer.send('load-color-dialog', output);
}

ipcRenderer.on('submit-color-dialog', (ev, args) => {
  var colorObj = {};
  colorObj.red    = args.red;
  colorObj.green  = args.green;
  colorObj.blue   = args.blue;
  colorObj.index  = Number(args.index);

  var colorlists = modifyColorLists(colorObj, args.section);
  saveColorLists(colorlists);
  ipcRenderer.send('hide-color-dialog');
})

exports.openColorDialog = openColorDialog;
exports.removeClicked = removeClicked;
