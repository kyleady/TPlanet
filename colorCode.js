function ColorCode(data){
  this.black      = new ColorObj("0 0 0 0");
  this.white      = new ColorObj("1 255 255 255");
  this.background = new ColorObj("2 255 255 255");
  this.grid       = new ColorObj("3 0 0 0");
  this.outline    = new ColorObj("4 0 0 0");
  this.contour    = new ColorObj("5 255 0 0");
  this.water = [];
  this.land = [];

  if(data){
    this.fromData(data);
  }
}

ColorCode.prototype.fromData = function(data){
  var colors = data.match(/\D*(\d+)\D*(\d+)\D*(\d+)\D*(\d+)/g);
  console.log(colors);
  var maxIndex = ColorObj.scaleMaxIndex(colors[colors.length-1].match(/\d+/));
  this.black       = new ColorObj(colors[0]);
  this.white       = new ColorObj(colors[1]);
  this.background  = new ColorObj(colors[2]);
  this.grid        = new ColorObj(colors[3]);
  this.outline     = new ColorObj(colors[4]);
  this.contour     = new ColorObj(colors[5]);
  for(var i = 6, l = colors.length; i < l; i++){
    var colorObj = new ColorObj(colors[i], maxIndex);
    if(colorObj.index <= 10000){
      this.water.push(colorObj);
    } else {
      colorObj.index = colorObj.index - 10001;
      this.land.push(colorObj);
    }
  }
  this.smoothLists();
}

ColorCode.prototype.toData = function(){
  var output = "";
  output += this.black.toData();
  output += "\r\n";
  output += this.white.toData();
  output += "\r\n";
  output += this.background.toData();
  output += "\r\n";
  output += this.grid.toData();
  output += "\r\n";
  output += this.outline.toData();
  output += "\r\n";
  output += this.contour.toData();
  for(var i = 0, l = this.water.length; i < l; i++){
    output += "\r\n";
    output += this.water[i].toData(6);
  }
  for(var i = 0, l = this.land.length; i < l; i++){
    output += "\r\n";
    output += this.land[i].toData(6+10001);
  }
  return output;
}

ColorCode.prototype.smoothLists = function(){
  if(this.water.length > 0){
    this.water[0].index = 0;
    this.water[this.water.length-1].index = 10000;
  }
  if(this.land.length > 0){
    this.land[0].index = 0;
    this.land[this.land.length-1].index = 10000;
  }
}

ColorCode.prototype.addColor = function(colorObj, section){
  var Inserted = false;
  for(var i = 0, l = this[section].length; i < l; i++){
    if(colorObj.index == this[section][i].index){
      this[section][i] = colorObj;
      Inserted = true;
      break;
    } else if(colorObj.index < this[section][i].index) {
      this[section].splice(i, 0, colorObj);
      Inserted = true;
      break;
    }
  }
  if(!Inserted){
    this[section].push(colorObj);
  }
}

ColorCode.prototype.removeColor = function(index, section){
  console.log("delete from " + section)
  console.log(this)
  for(var i = 0, l = this[section].length; i < l; i++){
    if(index == this[section][i].index){
      this[section].splice(i,1);
      break;
    }
  }
}

module.exports = ColorCode;
