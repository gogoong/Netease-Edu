  // 将HTML转换为节点
function html2node(str){
  var container = document.createElement('div');
  container.innerHTML = str;
  return container.children[0];
}

// 赋值属性
// extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
function extend(o1, o2){
  for(var i in o2) if(typeof o1[i] === 'undefined'){
    o1[i] = o2[i]
  } 
  return o1
}
/**
 * [Ajax get请求封装]
 * @param  {Str}   url      [请求地址]
 * @param  {Obj}   options  [请求参数]
 * @param  {Function} callback [执行回调函数]
 */
function get(url,options,callback){
  function serialize(options){
    if(!options) return '';
    var pairs = [];
    for(var name in options){
      if(!options.hasOwnProperty(name)) continue;
      if(typeof options[name] === 'function') continue;
      var value = options[name].toString();
      name = encodeURIComponent(name);
      value = encodeURIComponent(value);
      pairs.push(name + '=' + value);
    }
    return pairs.join('&');
      }
  var xhr = new XMLHttpRequest;
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      if((xhr.status >= 200 && xhr.status<300) || (xhr.status == 304 )){
        callback(JSON.parse(xhr.responseText));
      }
    }
  }
  xhr.open('get',url + '?' + serialize(options),true);
  xhr.send(null);
}

// courselist
// ----

var template = 
"<a class='img'>\
  <img width = '223px' height = '124px'>\
  <div class='detail'>\
   <div class='top f-cb'>\
      <img class='dimg' width = '223px' height = '124px'>\
      <div class='content'>\
        <div class='dttl'></div>\
        <div class='dlcount icn'></div>\
        <div class='dprv'></div>\
        <div class='dcategory'></div>\
      </div>\
    </div>\
    <div class='descr'></div>\
  </div>\
</a>\
<div class='ttl'></div>\
<div class='prv'></div>\
<div class='lcount icn'></div>\
<div class='price'></div> ";

function Courselist(options){
  options = options || {};
  this.container = this._layout.cloneNode(true);
  this.coursecount = this.container.getElementsByClassName("u-course");
  this.getc = function(){
    get(this.url,this.data,function(obj){
      this.obj = obj
    })
  }
  extend(this,options)
}

extend(Courselist.prototype,{
  _layout: html2node(template),


})