/**
 * 这是一个获取n个棋子是否相连
 * role: (1: 黑棋, 2: 白棋)
 *
 * @param {Number} n 相连棋子个数
 * 
 * @param {Array} list 整个棋盘的坐标
 *
 * @returns {Object} 返回状态, win: 是否赢了, winRole: 赢的角色, winList: 相连棋子坐标
 */

function getWin(n, list){
  var winRole = 0, win = false, len = list.length;
  var black = [], white = [], winList = [];
  var size = Math.sqrt(len);
  for(var i = 0; i < len; i++){
    if(list[i] === 1) black.push(i);
    else if(list[i] === 2) white.push(i);
  }
  [black, white].forEach(function(list, i){
    if(list.length >= n) {
      if(compare(list)){
        win = true;
        winRole = i + 1;
      }
    }
  })

  return {
    win: win,
    winRole: winRole,
    winList: winList
  }

  function compare(list) {
    switch(true){
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
    var cell1 = Math.floor(m/size);
    var cell2 = Math.floor(v/size) - 1;
    if(type === 2) {
      v += 2;
      cell2 = Math.floor(v/size) - 1;
    }else if ( type === 3) {
      v += 1;
      cell2 = Math.floor(v/size);
      cell2 = v < len ? cell2 - 1 : cell2;
    }else if ( type === 4) {
      v = m + 1;
      cell2 = Math.floor(v/size);
    }
    var condition = cell1 === cell2;
    return {
      v:v,
      condition:condition
    }
  }
  function comp(list, type) {
    if(list.length===0) return false;
    var v = list[0], arr = [v], newList = [];
    function compare(m){
      var gv = getV(m, type);
      var v1 = gv.v;
      var condition = gv.condition;
      var result = false;
      if(condition){
        if (~list.indexOf(v1)){
          if(arr.push(v1)>=n) {
            return winList = arr,true;
          }
          result = compare(v1)
        }
      }
      return result;
    }
    if(compare(v)) return true;
    for(var j=0; j<list.length; j++){
      if(arr.indexOf(list[j]) < 0) newList.push(list[j]);
    }
    return comp(newList, type);
  }
}
