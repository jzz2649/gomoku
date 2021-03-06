function Gomoku(options){
  this.options = {
    n: 5,
    size: 8,
    width: 500,
    padding: 10,
    spacing: 10,
    callback: function(){}
  }

  for (var k in options) {
    this.options[k] = options[k];
  }
  this.cvs = document.createElement('canvas');
  this.ctx = this.cvs.getContext('2d');
  this.cvs.width = this.options.width;
  this.cvs.height = this.options.width;
  this.cellSzie = (this.options.width - this.options.padding*2) / (this.options.size + 1);
  this.reset();
  this.cvs.onclick = this._click.bind(this);
}

Gomoku.prototype._draw = function(){
  this._clear();
  this.options.callback(this.role, this._getWin(), this.winList, this.chesss.length - 1 === this.index);
  this._setbg();
  this._circle();
  this._setRole(this.role);
}

Gomoku.prototype._setbg = function(){
  var me = this;
  var size = this.options.size + 1;
  var cellSzie = this.cellSzie;
  var padding = cellSzie / 2 + this.options.padding;
  var max = this.options.width - padding;
  function linear(start, end){
    me.ctx.beginPath();
    me.ctx.moveTo(start[0], start[1]);
    me.ctx.lineTo(end[0], end[1]);
    me.ctx.stroke();
  }
  for(var i = 0; i < size; i++){
    var xStart = [padding, cellSzie*i + padding ];
    var xEnd = [max, cellSzie*i + padding ];
    var yStart = [cellSzie*i + padding, padding ];
    var yEnd = [cellSzie*i + padding, max];
    linear(xStart, xEnd);
    linear(yStart, yEnd);
  }
}

Gomoku.prototype._circle = function() {
  var me = this;
  var size = this.options.size + 1;
  var cellSzie = this.cellSzie;
  var padding = this.options.padding;
  var spacing = (cellSzie - this.options.spacing) / 2;
  var winList = this.winList;
  var x, y;
  function xy(v) {
    return (v + 0.5)*cellSzie + padding;
  }
  function circle(x, y, role, win) {
    me.ctx.beginPath();
    me.ctx.arc(xy(x), xy(y), spacing, 0, Math.PI*2);
    me.ctx.stroke();
    me.ctx.fillStyle = win ? '#f00' : role === 1 ? '#000': '#fff';
    me.ctx.fill();
  }
  for(var i=0;i<this.chesss.length; i++) {
    if (this.chesss[i]){
      x = i%size;
      y = (i-x)/size;
      circle(x,y,this.chesss[i], winList.indexOf(i) > -1)
    }
  }
}

Gomoku.prototype._click = function(event){
  if(this.win) return;
  var size = this.options.size + 1;
  var cellSzie = this.cellSzie;
  var min = this.options.padding;
  var max = this.options.width - min - 1;
  var offsetX = event.offsetX;
  var offsetY = event.offsetY;
  if(max<offsetY||max<offsetX||min>offsetX||min>offsetY){
    return false;
  }
  var x = (offsetX-min)/cellSzie >>> 0;
  var y = (offsetY-min)/cellSzie >>> 0;
  var index = y*size + x;
  if (this.chesss[index] !== 0) {
    return false;
  }
  this.chesss[index] = this.role;
  if(this.queue.length - 1 > this.index) {
    this.queue = this.queue.slice(0, this.index + 1);
  }
  this.queue.push(index);
  this.index += 1;
  this._draw();
}

Gomoku.prototype._getWin = function(){
  var win = false, list = this.chesss, len = list.length;
  var black = [], white = [], winList = [];
  var size = this.options.size + 1;
  var n = this.options.n;
  for (var i = 0; i < len; i++) {
    if (list[i] === 1) black.push(i);
    else if (list[i] === 2) white.push(i);
  }
  [black, white].forEach(function(item) {
    if (item.length >= n) {
      if (compare(item)) {
        win = true;
      }
    }
  });

  this.winList = winList;
  return this.win = win;

  function compare(list) {
    switch (true) {
      case comp(list, 1):
      case comp(list, 2):
      case comp(list, 3):
      case comp(list, 4):
        return true;
      default:
        return false;
    }
  }
  // 1 skewLeft 2 skewRight 3 vertical 4 level
  function getV(m, type) {
    var v = m + size - 1;
    var cell1 = Math.floor(m / size);
    var cell2 = Math.floor(v / size) - 1;
    if (type === 2) {
      v += 2;
      cell2 = Math.floor(v / size) - 1;
    } else if (type === 3) {
      v += 1;
      cell2 = Math.floor(v / size);
      cell2 = v < len ? cell2 - 1 : cell2;
    } else if (type === 4) {
      v = m + 1;
      cell2 = Math.floor(v / size);
    }
    var condition = cell1 === cell2;
    return { v: v, condition: condition };
  }
  function comp(list, type) {
    if (list.length === 0) return false;
    var v = list[0],
      arr = [v],
      newList = [];
    function compare(m) {
      var gv = getV(m, type);
      var v1 = gv.v;
      var condition = gv.condition;
      var result = false;
      if (condition) {
        if (~list.indexOf(v1)) {
          if (arr.push(v1) >= n) {
            return (winList = arr), true;
          }
          result = compare(v1);
        }
      }
      return result;
    }
    if (compare(v)) return true;
    for (var j = 0; j < list.length; j++) {
      if (arr.indexOf(list[j]) < 0) newList.push(list[j]);
    }
    return comp(newList, type);
  }
}

Gomoku.prototype._setRole = function(role){
  this.role = role === 1 ? 2 : 1;
}

Gomoku.prototype._clear = function(){
  this.ctx.clearRect(0,0,this.options.width, this.options.width);
}

Gomoku.prototype.next = function(){
  var index = this.queue.length-1;
  if (this.index === index) return;
  this.index += 1;
  this.chesss[this.queue[this.index]] = this.index%2?2:1;
  this._draw();
}

Gomoku.prototype.prev = function(){
  if (this.index < 0) return;
  this.chesss[this.queue[this.index]] = 0;
  this.index -= 1;
  if(this.win) this.win = false;
  this._draw();
}

Gomoku.prototype.reset = function(){
  var size = this.options.size + 1;
  this.index = -1;
  this.role = 2;
  this.win = false;
  this.winList = [];
  this.queue = [];
  this.chesss = (function(){
    var arr = [],count = size*size;
    while(arr.push(0)<count);
    return arr;
  })();
  this._draw();
}
