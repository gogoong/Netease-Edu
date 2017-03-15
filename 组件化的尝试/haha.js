// 事件注册函数,兼容IE8
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
        callback(JSON.parse(xhr.responseText));
        // list = JSON.parse(xhr.responseText);
      }
    }
  }
  xhr.open('get',url + '?' + serialize(options),true);
  xhr.send(null);
}

// course课程模块
// ----
   
var templateC = 
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
  </li>";

function Course(options){

  options = options || {};
  // 主容器
  this.container = document.querySelector(".m-courselist");
  // 当前页课程数
  this.coursecount = this.container.getElementsByClassName("u-course");
  // 页码器
  this.page = document.querySelector(".m-page"),
  // 页数
  this.pagecount = document.getElementsByClassName("pageindex");

  extend(this,options);

  this._initEvent();

}



extend(Course.prototype,{

  _layout: html2node(templateC),
  // 增加课程
  addcourse:function(i){

    this.container.appendChild(this._layout.cloneNode(true));
    this.setcourse(i);

  },
  // 设置课程样式
  setcourse:function(i){

     this.container.children[i].children[0].firstElementChild.src = this.list[i].middlePhotoUrl;
     this.container.children[i].children[0].lastElementChild.firstElementChild.children[0].src = this.list[i].middlePhotoUrl;
     this.container.children[i].children[0].lastElementChild.firstElementChild.lastElementChild.children[0].textContent = this.list[i].name;
     this.container.children[i].children[0].lastElementChild.firstElementChild.lastElementChild.children[1].textContent = this.list[i].learnerCount + "人在学"
     this.container.children[i].children[0].lastElementChild.firstElementChild.lastElementChild.children[2].textContent = "发布者:" + this.list[i].provider;
     this.container.children[i].children[0].lastElementChild.firstElementChild.lastElementChild.children[3].textContent = "分类:" + (this.list[i].categoryName?this.list[i].categoryName:"无");
     this.container.children[i].children[0].lastElementChild.lastElementChild.textContent = this.list[i].description;
     this.container.children[i].children[1].textContent = this.list[i].name
     this.container.children[i].children[2].innerHTML = this.list[i].provider;
     this.container.children[i].children[3].innerHTML = this.list[i].learnerCount;
     this.container.children[i].children[4].innerHTML = this.list[i].price == 0? "免费" : '￥'+ this.list[i].price;
  },
  // 页码器
  pager:function(event){
    if(event.target.tagName == "LI"){
      var index = Number(event.target.dataset.index),
          pageNo = data.pageNo;

      // -1为上一页,0为下一页
      switch(index){
        case -1:
          if(pageNo>1){
            data.pageNo = data.pageNo - 1;
            get(url,data,function(obj){
              extend(obj,data)
              list = new Course(obj)
            })
          }
        
        break;
        case 0:
          if(pageNo<list.totalPage){
            data.pageNo += 1;
            get(url,data,function(obj){
              extend(obj,data);
              list = new Course(obj);
            })
          }
        
        break;
        default:
          if(index>0 && index != pageNo){
            data.pageNo = index;
            get(url,data,function(obj){
              extend(obj,data);
              list = new Course(obj);
            })
          }
      }
    }
  },

  // 初始化事件,根据现有的课程数和获取到的课程数来增删/设置课程
  _initEvent:function(){

    if(this.coursecount.length == 0){
      for(var i = 0,length=this.list.length;i<length;i++){
        this.addcourse(i);
      }
    }else if(this.coursecount.length == this.list.length){
      for(var i = 0,length=this.list.length;i<length;i++){
        this.setcourse(i)
      }
    }else if(this.coursecount.length>this.list.length){
      for(var i = 0,length=this.list.length;i<length;i++){
        this.setcourse(i)
      }
      for(var i=this.list.length,length=this.coursecount.length;i<length;i++){
        this.container.removeChild(this.container.lastElementChild)
      }
    }else{
      for(var i = 0;i<this.coursecount.length;i++){
        this.setcourse(i)
      }
      for(var i=this.coursecount.length;i<this.list.length;i++){
        this.addcourse(i);
      }
    }
    // 设置页码数
    if(this.pagecount.length == 0){
      for(var i=0 ,length = this.totalPage;i<length;i++){
        var pageindex = document.createElement("li");
        (i+1) == this.pageNo ? pageindex.className = "pageindex z-sel" : pageindex.className = "pageindex";
        pageindex.setAttribute("data-index",i+1);
        pageindex.innerHTML = i+1 ;
        this.page.insertBefore(pageindex,this.page.lastElementChild);
        /**  对页码器进行事件代理
             这里有个疑问,原想法
             this.pager.bind(this);addEvent(this.page,"click",this)
             当点击翻页或页码时,会执行2次pager,还请老师解答一下 **/
        addEvent(this.page,"click",this.pager);
        // 注册tab的点击事件
        var coursetab = document.getElementsByClassName("u-tab");
        addEvent(coursetab[0].firstElementChild,"click",function(){
          data.type = 10;
          data.pageNo = 1;
          coursetab[0].firstElementChild.className = "z-sel";
          coursetab[0].lastElementChild.className = "";
          get(url,data,function(obj){
            extend(obj,data)
            list = new Course(obj)
          });
        });
        addEvent(coursetab[0].lastElementChild,"click",function(){
          data.type = 20;
          data.pageNo = 1;
          coursetab[0].lastElementChild.className = "z-sel";
          coursetab[0].firstElementChild.className = "";
          get(url,data,function(obj){
            extend(obj,data)
            list = new Course(obj);
          });
        })
  
      }
    }
    // 设置页码状态
    for(i=0;i<this.totalPage;i++){
      (i+1) == this.pageNo ? this.pagecount[i].className = "pageindex z-sel" : this.pagecount[i].className = "pageindex";
    }
  }
})

// 热门课程模块
//
var templateHotC = "<li class=u-hot f-cb>\
                    <img width='50px' height='50px'>\
                    <div>\
                      <div class='cttl'></div>\
                      <div class='lcount icn'></div>\
                    </div>\
                  </li>";

function Hotcourse(options){
  options = options || {};
  // 将返回的数组放入list中,再放入Hotcourse
  this.list = [];

  extend(this.list,options);

  this.container = document.querySelector(".hot").children[0];

  this.supcontainer = this.container.parentNode;

  this._initEvent();

}

extend(Hotcourse.prototype,{

  _layout:html2node(templateHotC),
  // 设置课程样式
  setcourse:function(i){

    this.container.children[i].firstElementChild.src = this.list[i].smallPhotoUrl;

    this.container.children[i].lastElementChild.firstElementChild.textContent = this.list[i].name;

    this.container.children[i].lastElementChild.lastElementChild.textContent = this.list[i].learnerCount;
  },
  // 初始化事件
  _initEvent:function(){
    for(var i = 0,length=this.list.length;i<length;i++){
      list.addcourse.call(this,i)
    }
    // 克隆一个节点,用于后期滚动
    this.supcontainer.appendChild(this.container.cloneNode(true));
  }
})

