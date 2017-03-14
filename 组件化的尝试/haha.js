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

  // this.url = "https://study.163.com/webDev/couresByCategory.htm";

  // this.data = {pageNo:1,psize:20,type:10};

  this.page = document.querySelector(".m-page"),

  this.pagecount = document.getElementsByClassName("pageindex");

  extend(this,options);

  this._initEvent();
  // this.say();

}



extend(Course.prototype,{
  say:function(){
    console.log(this)
  },

  _layout: html2node(template),

  addcourse:function(i){

    this.container.appendChild(this._layout.cloneNode(true));
    this.changecourse(i);

  },

  changecourse:function(i){

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

  pager:function(event){
    if(event.target.tagName == "LI"){
    var index = event.target.dataset.index,
        pageNo = data.pageNo;
    if(index == -1){
      if(pageNo>1){
      data.pageNo = data.pageNo - 1;
      get(url,data,function(obj){
        extend(obj,data)
        list = new Course(obj)
      })

      // this._initEvent();
      }
    }
    
    else if(index == 0 ){
      if(pageNo <list.totalPage){
        data.pageNo = data.pageNo+1
      get(url,data,function(obj){
        extend(obj,data)
        list = new Course(obj)
      })
      // this._initEvent();
    }
  }
    else if(index>0 && index != pageNo){
      data.pageNo = Number(index);
      get(url,data,function(obj){
        extend(obj,data)
        list = new Course(obj)
      })
      // this._initEvent();
    }else{
      //
    }
    // console.log(this.data)
    }
  },

  _initEvent:function(){
    // get(this.url,this.data,function(obj){
    //   list = new Course;
    // })
    if(this.coursecount.length == 0){
      for(var i = 0,length=this.list.length;i<length;i++){
        this.addcourse(i);
      }
    }else if(this.coursecount.length == this.list.length){
      for(var i = 0,length=this.list.length;i<length;i++){
        this.changecourse(i)
      }
    }else if(this.coursecount.length>this.list.length){
      for(var i = 0,length=this.list.length;i<length;i++){
        this.changecourse(i)
      }
      for(var i=this.list.length,length=this.coursecount.length;i<length;i++){
        this.container.removeChild(this.container.lastElementChild)
      }
    }else{
      for(var i = 0;i<this.coursecount.length;i++){
        this.changecourse(i)
      }
      for(var i=this.coursecount.length;i<this.list.length;i++){
        this.addcourse(i);
      }
    }
    if(this.pagecount.length == 0){
      for(var i=0 ,length = this.totalPage;i<length;i++){
        var pageindex = document.createElement("li");
        // pageindex.className = "pageindex";
        (i+1) == data.pageNo ? pageindex.className = "pageindex z-sel" : pageindex.className = "pageindex";
        pageindex.setAttribute("data-index",i+1);
        pageindex.innerHTML = i+1 ;
        this.page.insertBefore(pageindex,this.page.lastElementChild);
        // this.addEvent(pageindex,"click",this.bindFunction(this,this.pager(i)));
        // this.addEvent(pageindex,"click",this.pager)
        // this.addEvent(pageindex,"click",this.bindFunction(this,this.pager));
      // }
      // this.addEvent(this.page,"click",this.bindFunction(this,this.pager));
        // this.pager.bind(this);
        addEvent(this.page,"click",this.pager);
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
    // this.addEvent(this.page,"click",this.bindFunction(this,this.pager));
    for(i=0;i<this.totalPage;i++){
      (i+1) == this.pageNo ? this.pagecount[i].className = "pageindex z-sel" : this.pagecount[i].className = "pageindex";
    }
    
}
  // later:function(){
  //   var data = {pageNo:this.pageNo,psize:this.psize,type:this.type};
  //   get(this.url,data,function(obj){
  //     list = new Course(obj);
  //   })
  //    if(this.coursecount.length == this.list.length){
  //     for(var i = 0,length=this.list.length;i<length;i++){
  //       this.changecourse(i)
  //     }
  //   }else if(this.coursecount.length>this.list.length){
  //     for(var i = 0,length=this.list.length;i<length;i++){
  //       this.changecourse(i)
  //     }
  //     for(var i=this.list.length,length=this.coursecount.length;i<length;i++){
  //       this.container.removeChild(this.container.lastElementChild)
  //     }
  //   }else{
  //     for(var i = 0;i<this.coursecount.length;i++){
  //       this.changecourse(i)
  //     }
  //     for(var i=this.coursecount.length;i<this.list.length;i++){
  //       this.addcourse(i);
  //     }
  //   }
  // },
})
