

//2016.2.13 基础封装库
//代码 by 李炎恢js教程

//2016.2.12 遮罩锁屏 添加了设置css、添加移除class、添加解除锁屏、跨浏览器获取视窗大小的函数,添加了 判断class是否存在、跨浏览器添加移除link规则 的函数

//2016.2.13 添加了 拖拽功能，获取Event对象、阻止默认行为的函数, 改写了触发浏览器窗口事件


//简单定义
var $ = function(_this) {
    return new Base(_this);
}

//基础库
function Base(_this) {
    this.elements = [];
    if(_this != undefined) {
        this.elements[0] = _this;
    }
}

Base.prototype.getId = function (id) {          //获取ID节点
    this.elements.push(document.getElementById(id));
    return this;
};
Base.prototype.getTagName = function (tag) {    //获取元素节点数组
    var tags = document.getElementsByTagName(tag);
    for(var i = 0; i < tag.length; i++) {
        this.elements.push(tags[i]);
    }
    return this;
};

Base.prototype.getClass = function(className, idName) { //获取Class节点数组
    var node = null;
    if(arguments.length == 2) {
        node = document.getElementById(idName);
    } else {
        node = document;
    }
    var all = node.getElementsByTagName('*');
    for(var i = 0; i < all.length; i++) {
        if(all[i].className == className) {
            this.elements.push(all[i]);
        }
    }
    return this;
};

Base.prototype.getElement = function(num) {  //获取某一个节点
    var element = this.elements[num];
    this.elements = [];
    this.elements[0] = element;
    return this;
}

Base.prototype.css = function(attr, value) {  //设置CSS
    for(var i = 0; i < this.elements.length; i++) {
        if(arguments.length == 1) {
            return getStyle(this.elements[i], attr);
        }
        this.elements[i].style[attr] = value;
    }
    return this;
};

Base.prototype.addClass = function(className) {  //添加Class
    for(var i = 0; i < this.elements.length; i++) {
        if(!hasClass(this.elements[i], className)) {
            this.elements[i].className += ' ' + className;
        }
    }
    return this;
}

Base.prototype.removeClass = function(className) {  //移除Class
    for(var i =0; i < this.elements.length; i++) {
        if(hasClass(this.elements[i], className)) {
            this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
        }
    }
    return this;
}

//添加link或style的规则
Base.prototype.addRule = function(num,selectorText,cssText,position) {
    var sheet = document.styleSheets[num];
    insertRule(sheet, selectorText, cssText, position);
    return this;
};

Base.prototype.removeRule = function(num,index) {  //移除link或style的规则
    var sheet = document.styleSheets[num];
    deleteRule(sheet, index);
    return this;
};

Base.prototype.html = function(str) {       //设置innerHTML
    for(var i = 0; i < this.elements.length; i++) {
        if(arguments.length == 0) {
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML = str;
    }
    return this;
};

Base.prototype.hover = function(over, out) {  //设置鼠标移入移出事件
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].onmouseover = over;
        this.elements[i].onmouseout = out;
    }
    return this;
};

//设置鼠标点击事件
Base.prototype.mousedown = function(fn) {
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].onmousedown = fn;
    }
    return this;
};

Base.prototype.show = function() {          //设置显示
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block'; 
        //这里和下面的style无法读取但能设置
    }
    return this;
};

Base.prototype.hide = function() {          //设置隐藏
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
    return this;
};

//这种方法设置时有bug，有时不能准确获取浏览器的宽高
Base.prototype.center = function(left, top) {  //设置物体居中
    var top = (document.documentElement.clientHeight - top) / 2;
    var left = (document.documentElement.clientWidth - left) / 2;
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.top = top + 'px';
        this.elements[i].style.left = left + 'px';
    }
    return this;
};

Base.prototype.lock = function() {  //锁屏功能
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.width = getInner().width + 'px';
        this.elements[i].style.height = getInner().height + 'px';
        this.elements[i].style.display = 'block';
        document.documentElement.style.overflow = 'hidden';
    }
    return this;
};

Base.prototype.unlock = function() {  //解除锁屏
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
        document.documentElement.style.overflow = 'auto';
    }
    return this;
};

Base.prototype.drag = function() {   //拖拽功能
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].onmousedown = function(e) {
            preDef(e);
            var e = getEvent(e);
            var _this = this;
            var divX = e.clientX - _this.offsetLeft,
                divY = e.clientY - _this.offsetTop;
            if(typeof _this.setCapture != 'undefined') {
                _this.setCapture();
            }
            //点击某个物体用的是oDiv，move和up是全局区域，应该用document
            document.onmousemove = function() {
                var e = getEvent(e);
                var left = e.clientX - divX,
                    top = e.clientY - divY;
                if(left < 0) {
                    left = 0;
                } else if(left > getInner().width - _this.offsetWidth) {
                    left = getInner().width - _this.offsetWidth;
                }
                if(top < 0) {
                    top = 0;
                } else if(top > getInner().height - _this.offsetHeight) {
                    top = getInner().height - _this.offsetHeight;
                }
                _this.style.left = left + 'px';
                _this.style.top = top + 'px';
            };
            document.onmouseup = function() {
                this.onmousemove = null;
                this.onmouseup = null;
                if(typeof _this.releaseCapture != 'undefined') {
                    _this.releaseCapture();
                }
            };
        };
    }
    return this;
};

Base.prototype.click = function(fn) {       //触发点击事件
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].onclick = fn;
    }
    return this;
};

Base.prototype.resize = function(fn) {   //触发浏览器窗口事件
    for(var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];
        window.onresize = function() {
            fn();
            if(element.offsetLeft > getInner().width - element.offsetWidth) {
                element.style.left = getInner().width - element.offsetWidth + 'px';
            }
            if(element.offsetTop > getInner().height - element.offsetHeight) {
                element.style.top = getInner().height - element.offsetHeight + 'px';
            }
        };
    }
    return this;
};

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


