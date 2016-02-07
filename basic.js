

//2016.2.7

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
            if(typeof window.getComputedStyle != 'undefined') { //W3C
                return window.getComputedStyle(this.elements[i], null)[attr];
            } else if(typeof this.elements[i].currentStyle != 'undefined') { //IE
                return this.elements[i].currentStyle[attr];
            }
        }
        this.elements[i].style[attr] = value;
    }
    return this;
};

Base.prototype.addClass = function(className) {  //添加Class
    for(var i = 0; i < this.elements.length; i++) {
        if(!this.elements[i].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
            this.elements[i].className += ' ' + className;
        }
    }
    return this;
}

Base.prototype.removeClass = function(className) {  //移除Class
    for(var i =0; i < this.elements.length; i++) {
        if(this.elements[i].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
            this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
        }
    }
    return this;
}

//添加link或style的规则
Base.prototype.addRule = function(num,selectorText,cssText,position) {
    var sheet = document.styleSheets[num];
    if(typeof sheet.insertRule != 'undefined') { //W3C
        sheet.insertRule(selectorText+'{'+cssText+'}', position);
    } else if(typeof sheet.addRule != 'undefined') { //IE
        sheet.addRule(selectorText, cssText, position);
    }
    return this;
};

Base.prototype.removeRule = function(num,index) {  //移除link或style的规则
    var sheet = document.styleSheets[num];
    if(typeof sheet.insertRule != 'undefined') { //W3C
        sheet.deleteRule(index);
    } else if(typeof sheet.removeRule != 'undefined') { //IE
        sheet.removeRule(index);
    }
    return this;
};

Base.prototype.html = function(str) {  //设置innerHTML
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

Base.prototype.show = function() {          //设置显示
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block';
    }
    return this;
};

Base.prototype.hide = function() {          //设置隐藏
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
    return this;
};

Base.prototype.click = function(fn) {       //触发点击事件
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].onclick = fn;
    }
    return this;
};



