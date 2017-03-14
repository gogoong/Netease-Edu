var addEvent = document.addEventListener ?
        function(ele,type,listener,useCapture){
          ele.addEventListener(type,listener,useCapture);
        }:
        function(ele,type,listener){
          ele.attachEvent('on'+type,listener);
        };
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
        // callback(JSON.parse(xhr.responseText));
        haha = JSON.parse(xhr.responseText);
      }
    }
  }
  xhr.open('get',url + '?' + serialize(options),false);
  xhr.send(null);
}

// courselist
// ----
   
var template = 
  "<li class='u-course'>\
    <a class='img'>\
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
  <div class='price'></div>\
  </li>"

// var courselist = document.querySelector(".m-courselist");
function Course(options){

  options = options || {};

  this.container = document.querySelector(".m-courselist");

  this.coursecount = this.container.getElementsByClassName("u-course");

  this.data = {pageNo:1,psize:20,type:10};

  this.page = document.querySelector(".m-page"),

  this.pagecount = document.getElementsByClassName("pageindex");

  extend(this,options)

  this._initEvent();

}

Course.prototype = { addEvent:function(ele,type,listener,useCapture){
  if(ele.addEventListener){
    ele.addEventListener(type,listener,useCapture);
  }else{
    ele.attachEvent('on'+type,listener);
  }
}}

extend(Course.prototype,{

  bindFunction : function(obj, func){
    return function(){
      func.apply(obj, arguments);
    }
  },

  _layout: html2node(template),

  addcourse:function(i){

    this.container.appendChild(this._layout.cloneNode(true));
    this.changecourse(i);

  },

  changecourse:function(i){

     this.container.children[i].children[0].firstElementChild.src = haha.list[i].middlePhotoUrl;
     this.container.children[i].children[0].lastElementChild.firstElementChild.children[0].src = haha.list[i].middlePhotoUrl;
     this.container.children[i].children[0].lastElementChild.firstElementChild.lastElementChild.children[0].textContent = haha.list[i].name;
     this.container.children[i].children[0].lastElementChild.firstElementChild.lastElementChild.children[1].textContent = haha.list[i].learnerCount + "人在学"
     this.container.children[i].children[0].lastElementChild.firstElementChild.lastElementChild.children[2].textContent = "发布者:" + haha.list[i].provider;
     this.container.children[i].children[0].lastElementChild.firstElementChild.lastElementChild.children[3].textContent = "分类:" + haha.list[i].categoryName;
     this.container.children[i].children[0].lastElementChild.lastElementChild.textContent = haha.list[i].description;
     this.container.children[i].children[1].textContent = haha.list[i].name
     this.container.children[i].children[2].innerHTML = haha.list[i].provider;
     this.container.children[i].children[3].innerHTML = haha.list[i].learnerCount;
     this.container.children[i].children[4].innerHTML = haha.list[i].price == 0? "免费" : '￥'+ haha.list[i].price;
  },

  pager:function(e){
    var index = e.target.dataset.index,
        pageNo = this.data.pageNo;
    if(index<0 && (pageNo > 1? this.data.pageNo -=1 : false)){

      this._initEvent();

    }
    
    else if(index == 0 && (pageNo <haha.totalPage?this.data.pageNo +=1 : false)){
      this._initEvent();
    }
    else if(index>0 && index != pageNo){
      this.data.pageNo = index;
      this._initEvent();
    }else{
      //
    }
    // console.log(this.data)
    
  },

  _initEvent:function(){
    get(this.url,this.data);
    if(this.coursecount.length == 0){
      for(var i = 0,length=haha.list.length;i<length;i++){
        this.addcourse(i);
      }
    }else if(this.coursecount.length == haha.list.length){
      for(var i = 0,length=haha.list.length;i<length;i++){
        this.changecourse(i)
      }
    }else if(this.coursecount.length>haha.list.length){
      for(var i = 0,length=haha.list.length;i<length;i++){
        this.changecourse(i)
      }
      for(var i=haha.list.length,length=this.coursecount.length;i<length;i++){
        this.container.removeChild(this.container.lastElementChild)
      }
    }else{
      for(var i = 0;i<this.coursecount.length;i++){
        this.changecourse(i)
      }
      for(var i=this.coursecount.length;i<haha.list.length;i++){
        this.addcourse(i);
      }
    }
    if(this.pagecount.length == 0){
      for(var i=0 ,length = haha.totalPage;i<length;i++){
        var pageindex = document.createElement("div");
        // pageindex.className = "pageindex";
        (i+1) == this.data.pageNo ? pageindex.className = "pageindex z-sel" : pageindex.className = "pageindex";
        pageindex.setAttribute("data-index",i+1);
        pageindex.innerHTML = i+1 ;
        this.page.insertBefore(pageindex,this.page.lastElementChild);
        // this.addEvent(pageindex,"click",this.bindFunction(this,this.pager(i)));
        // this.addEvent(pageindex,"click",this.pager)
        // this.addEvent(pageindex,"click",this.bindFunction(this,this.pager));
      }
      this.addEvent(this.page,"click",this.bindFunction(this,this.pager));
    }
    // this.addEvent(this.page,"click",this.bindFunction(this,this.pager));
    for(i=0;i<haha.totalPage;i++){
      (i+1) == this.data.pageNo ? this.pagecount[i].className = "pageindex z-sel" : this.pagecount[i].className = "pageindex";
    }
  },

})

