function ColorObj(input, maxIndex){
  this.red   = 0;
  this.green = 0;
  this.blue  = 0;
  this.index = 0;
  this.dataRegex = /^\D*(\d+)\D+(\d+)\D+(\d+)\D+(\d+)\D*$/;
  this.styleRegex = /^\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/;
  this.labelRegex = /^\s*(\d+(?:\.\d+)?)%\s*$/;

  if(typeof input == 'object'){
    this.fromObj(input);
  }else if(this.dataRegex.test(input)){
    this.fromData(input, maxIndex);
  } else if(this.styleRegex.test(input)){
    this.fromStyle(input);
    if(this.labelRegex.test(maxIndex)){
      this.fromLabel(maxIndex);
    }
  }
}

ColorObj.prototype.fromData = function(data, maxIndex){
  var matches = data.match(this.dataRegex);
  if(!matches){
    return false;
  }
  this.scaleIndex(matches[1], maxIndex);
  this.red   = Number(matches[2]);
  this.green = Number(matches[3]);
  this.blue  = Number(matches[4]);
  return true;
}

ColorObj.prototype.fromStyle = function(style){
  var matches = style.match(this.styleRegex);
  if(!matches){
    return false;
  }
  this.red   = Number(matches[1]);
  this.green = Number(matches[2]);
  this.blue  = Number(matches[3]);
  return true;
}

ColorObj.prototype.fromLabel = function(label){
  var matches = label.match(this.labelRegex);
  if(!matches){
    return false;
  }
  this.index = Math.floor(Number(matches[1])*100);
  return true;
}

ColorObj.prototype.fromObj = function(obj){
  this.red   = Number(obj.red);
  this.green = Number(obj.green);
  this.blue  = Number(obj.blue);
  this.index = Number(obj.index);
}

ColorObj.prototype.toStyle = function(){
  var output = "rgb(";
  output += this.red.toString();
  output += ",";
  output += this.green.toString();
  output += ",";
  output += this.blue.toString();
  output += ")";

  return output;
}

ColorObj.prototype.toLabel = function(){
  var output = this.index/100;
  output = output.toString();
  output += "%";
  return output;
}

ColorObj.prototype.toData = function(indexAdjustment){
  indexAdjustment = indexAdjustment || 0;
  var output = "";
  output += (this.index + indexAdjustment).toString();
  output += " " + this.red.toString();
  output += " " + this.green.toString();
  output += " " + this.blue.toString();

  return output;
}

ColorObj.prototype.scaleIndex = function(index, maxIndex){
  index      = Number(index) - 6;
  maxIndex   = Number(maxIndex);
  this.index = Math.round(20001 * index / maxIndex);
}

ColorObj.scaleMaxIndex = function(maxIndex){
  return Number(maxIndex) - 6;
}

module.exports = ColorObj;
