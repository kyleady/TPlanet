function getColorCode(){
  var colorCode = new ColorCode();
  colorCode['water'] = getColorList('water');
  colorCode['land'] = getColorList('land');
  console.log("Color Code")
  console.log(colorCode);
  return colorCode;
}

function getColorList(section){
  var table = document.getElementById(section + "table");
  var colorlist = [];
  for(var i = table.rows.length-1; i >= 0; i--){
    var label = table.rows[i].cells[0].innerHTML;
    var style = table.rows[i].cells[1].style['background-color'];
    var colorObj = new ColorObj(style, label);
    colorlist.push(colorObj);
  }
  console.log(section);
  console.log(colorlist);
  return colorlist;
}

function saveColorLists(colorcode, colorfile){
  colorfile = colorfile || 'custom.col';
  fs.writeFile(TPDir + "\\" + colorfile, colorcode.toData(), function (err) {
    if(err){
      alert("An error ocurred creating the file: "+ err.message)
    }
    document.getElementById('coloroptions').value = colorfile;
    displayColors.displayColorLists();
    generate.preview();
  });
}

function removeClicked(ev){
  var row = ev.currentTarget.parentNode.parentNode;
  var matches = row.id.match(/^(land|water)row(\d+)$/);
  var section = matches[1];
  var index = Number(matches[2]);
  console.log("section: " + section)
  console.log("index: " + index)
  var colorCode = getColorCode();
  colorCode.removeColor(index, section);
  saveColorLists(colorCode);
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
  var colorCode = getColorCode();
  colorCode.addColor(colorObj, args.section);
  saveColorLists(colorCode);
  ipcRenderer.send('hide-color-dialog');
})

exports.openColorDialog = openColorDialog;
exports.removeClicked = removeClicked;
