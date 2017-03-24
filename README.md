# new-start
新的开始-

WDILT--今天学了什么?
------

`foreach`
arr.forEach(function callback(currentValue, index, array) {
    //your iterator
}[, thisArg]); IE9+支持,大作业不好用.<br>
>2017年3月10日<br>
>>`事件委托`,即在父节点上监听事件,子节点发生事件后,通过冒泡的方式到达父节点,触发相应函数.
>>`apply`接受数组参数,`call`接受任意参数,2者在调用时直接执行.fun.apply/call(thisArg[,])<br>
>>`bind`接受任意参数,需要额外一步调用 var a = fun.bind(thisArg[,]); a();<br>
>>调用之后函数fun内的this指向thisArg,也就是调用者.<br>

>2017年3月24日<br>
>>好久没写..这个项目都差不多写完了..
>>`xx.onclick=`在IE8中,传入的参数需要通过`window.event`取得,IE9+则无需.但是通过`attachEvent`注册的事件也可以直接用event取得(IE8).<br>
>>项目里我一直重复做`course = new Course`这个操作,虽然直接取course会得到最后一个new出来的,但是好像实际上会有很多Course存在?就像我最早把pager点击事件写在页面第一次加载时.那么当点击pager时,执行pmove函数,其中的this,指向第一次new出来的course.<br>
