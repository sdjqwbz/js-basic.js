
//2016.2.23 基础函数库
//代码 by 李炎恢js教程

//2016.2.23
//添加 删除左右空格函数、滚动条初始化
//添加浏览器检测的闭包函数、DOM加载函数

function getInner() {    //跨浏览器获取视窗大小
    if(typeof window.innerWidth != 'undefined') {
        return {
            width : window.innerWidth,
            height : window.innerHeight
        }
    } else {
        return {
            width : document.documentElement.clientWidth,
            height : document.documentElement.clientHeight
        }
    }
}

function getStyle(element, attr) {  //跨浏览器获取Style
    if(typeof window.getComputedStyle != 'undefined') { //W3C
        return window.getComputedStyle(element, null)[attr];
    } else if(typeof element.currentStyle != 'undefined') { //IE
        return element.currentStyle[attr];
    }
}

//判断class是否存在
function hasClass(element, className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

//跨浏览器添加link规则
function insertRule(sheet, selectorText, cssText, position) {
    if(typeof sheet.insertRule != 'undefined') { //W3C
        sheet.insertRule(selectorText+'{'+cssText+'}', position);
    } else if(typeof sheet.addRule != 'undefined') { //IE
        sheet.addRule(selectorText, cssText, position);
    }
}

//跨浏览器移除link规则
function deleteRule(sheet, index) {
    if(typeof sheet.insertRule != 'undefined') { //W3C
        sheet.deleteRule(index);
    } else if(typeof sheet.removeRule != 'undefined') { //IE
        sheet.removeRule(index);
    }
}

//获取Event对象
function getEvent(e) {
    return e || window.event;
}

//阻止默认行为
function preDef(event) {
    var e = getEvent(event);
    if(typeof e.preventDefault != 'undefined') { //W3C
        e.preventDefault();
    } else { //IE
        e.returnValue = false;
    }
}

//跨浏览器添加事件绑定
function addEvent(obj, type, fn) {
    if(typeof obj.addEventListener != 'undefined') {
        obj.addEventListener(type, fn, false);
    } else {
        //创建一个存放事件的哈希表
        if(!obj.events) obj.events = {};
        if(!obj.events[type]) { //第一次时执行
            //创建一个存放事件处理函数的数组
            obj.events[type] = [];
            //把第一次的事件处理函数先存储到第一个位置上
            if(obj['on' + type]) obj.events[type][0] = fn;
        } else {
            //同一个注册函数屏蔽，不添加到计数器
            if(addEvent.equal(obj.events[type], fn)) return false;
        }
        //从第二次开始用事件计数器来存储
        obj.events[type][addEvent.ID++] = fn;
        //执行事件处理函数
        obj['on' + type] = addEvent.exec;
    }
}
//为每个事件分配一个计数器
addEvent.ID = 1;
//执行事件处理函数
addEvent.exec = function(event) { //执行事件时本身会传进event
    var e = event || addEvent.fixEvent(window.event); //不用e无法调用type
    var es = this.events[e.type];
    for(var i in es) {
        es[i].call(this, e);
    }
};
//同一个注册函数进行屏蔽
addEvent.equal = function(es, fn) {
    for(var i in es) {
        if(es[i] == fn) return true;
    }
    return false;
};
//把IE常用的Event对象配对到W3C中
addEvent.fixEvent = function(event) {
    event.preventDefault = function() {
        this.returnValue = false;  //IE阻止默认行为
    };
    event.stopPropagation = function() {
        this.cancelBubble = true;  //IE取消冒泡
    };
    event.target = event.srcElement;
    return event;
};

//浏览器检测
(function(){
    window.sys = {};  //保存浏览器信息，外部可访问
    var ua = navigator.userAgent.toLowerCase();
    var s;      //浏览器名称+版本
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] : 
    (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] : 
    (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] : 
    (s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] : 
    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
    if(/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();

//DOM加载
function addDomLoaded(fn) {  
    var isReady = false;
    var timer = null;
    function doReady() {
        if(timer) clearInterval(timer);
        if(isReady) return;
        isReady = true;
        fn();
    } 
    if((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
        //向下兼容低版本
        timer = setInterval(function(){
            if(document && document.getElementById && document.getElementsByTagName && document.body) doReady();
        }, 1);
    } else if(document.addEventListener) {  //W3C
        addEvent(document, 'DOMContentLoaded', function() {
            fn();
            removeEvent(document, 'DOMContentLoaded', arguments.callee);
        });
    } else if(sys.ie && sys.ie < 9) {
        var timer = null;
        timer = setInterval(function(){
            try {
                document.documentElement.doScroll('left');
                doReady();
            } catch(e) {}
        }, 1);
    }
}

//跨浏览器移除事件绑定
function removeEvent(obj, type, fn) {
    if(typeof obj.removeEventListener != 'undefined') {
        obj.removeEventListener(type, fn, false);
    } else {
        if(obj.events) {
            for(var i in obj.events[type]) {
                if(obj.events[type][i] == fn) {
                    delete obj.events[type][i];
                }
            }
        }
    }
}

//删除左右空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

//滚动条初始化
function scrollTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}




