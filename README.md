# gomoku

演示：[codepen](https://codepen.io/jzz7280/full/EExOEQ)

##使用示意

1. 引入js文件，例如

``` html
<script src="gomoku.js"></script>
```
2. 绑定dom(比如class为app)以及调用
``` html
<div class="app"></div>
```
``` javascript
var gomoku = new Gomoku({callback: function(role, win, list, status){
    console.log(role, win, list, status);
  }});
document.querySelector('.app').appendChild(gomoku.cvs);
```

##配置

以下默认配置
``` options
new Gomoku(
  n: 5,//连子棋数
  size: 8,//棋盘格子数量(8x8)
  width: 500,//棋盘(canvas)的大小
  padding: 10,//棋盘边缘空白部分大小
  spacing: 10,//两棋子间的距离
  callback: function(){}//回调函数,返回4个参数(1:角色,2:是否赢了,3:连子,4:是否所有下完了)
```
##属性
new Gomoku()返回的实例属性和方法
```
cvs:canvas元素
role:下一个下棋的角色(1:黑子,2:白子)
win:是否赢了(true表示赢了)
winList:所有连子的坐标
chesss:所有棋子的状态(0:表示没有棋子)
queue:所有下过棋子的步骤
index:表示当前步骤
reset():重新开始
prev():上一步
next():下一步
```
##说明

有问题，欢迎提出
