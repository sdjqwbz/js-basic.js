

//2016.3.3 基础封装库
//代码 by 李炎恢js教程

//2016.2.24
//新增 设置动画的函数 并将其封装为插件
//添加 获取所有节点，返回节点数组的函数
//2016.3.1
//添加 设置点击切换效果的函数、获取当前节点下一个元素节点/前一个节点、获取某一节点的属性、获取某一节点在节点组中的索引、添加获取节点组的长度
//2016.3.3 添加 设置透明度的函数

//简单定义
var $ = function(args) {
    return new Base(args);
}

//基础库
function Base(args) {
    this.elements = [];
    if(typeof args == 'string') {  //css选择器
        if(args.indexOf(' ') != -1) {  //css模拟
            var elements = args.split(' ');
            var childElements = [];  //存放临时节点对象的数组,防止被覆盖
            var node = [];          //用来存放父节点
            for(var i = 0; i < elements.length; i++) {
                if(node.length == 0) node.push(document); //没有父节点则为document
                switch(elements[i].charAt(0)) {
                    case '#' : 
                        childElements = [];  //清理临时节点
                        childElements.push(this.getId(elements[i].substring(1)));
                        node = childElements; //保存父节点
                        break;
                    case '.' :
                        childElements = [];
                        for(var j = 0; j < node.length; j++) {
                            var temps = this.getClass(elements[i].substring(1), node[j]);
                            for(var k = 0; k < temps.length; k++) {
                                childElements.push(temps[k]);
                            }
                        }
                        node = childElements;
                        break;
                    default : 
                        childElements = [];
                        for(var j = 0; j < node.length; j++) {
                            var temps = this.getTagName(elements[i], node[j]);
                            for(var k = 0; k < temps.length; k++) {
                                childElements.push(temps[k]);
                            }
                        }
                        node = childElements;
                }
            }
            this.elements = childElements;
        } else {    //find模拟
            switch(args.charAt(0)) {  
                case '#' : 
                    this.elements.push(this.getId(args.substring(1)));
                    break;
                case '.' :
                    this.elements = this.getClass(args.substring(1));
                    break;
                default :
                    this.elements = this.getTagName(args);
            }
        }
    } else if(typeof args == 'object') {
        if(args != undefined) {
            this.elements[0] = args;
        }
    } else if(typeof args == 'function') {
        this.ready(args);
    }
}

//addDomLoaded
Base.prototype.ready = function(fn) {
    addDomLoaded(fn);
};

Base.prototype.getId = function (id) {          //获取ID节点
    return document.getElementById(id);
};
Base.prototype.getTagName = function (tag, parentNode) {    //获取元素节点数组
    var node = null;
    var temps = [];
    if(parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var tags = node.getElementsByTagName(tag);
    for(var i = 0; i < tags.length; i++) {
            temps.push(tags[i]);
    }
    return temps;
};
Base.prototype.getClass = function(className, parentNode) { //获取Class节点数组
    var node = null;
    var temps = [];
    if(parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var all = node.getElementsByTagName('*');
    for(var i = 0; i < all.length; i++) {
        if(all[i].className == className) {
            temps.push(all[i]);
        }
    }
    return temps;
};

//设置CSS选择器子节点
Base.prototype.find = function(str) {
    var childElements = [];
    for(var i = 0; i < this.elements.length; i++) {
        switch(str.charAt(0)) {
            case '#' : 
                childElements.push(this.getId(str.substring(1)));
                break;
            case '.' :
                var temps = this.getClass(str.substring(1), this.elements[i]);
                for(var j = 0; j < temps.length; j++) {
                    childElements.push(temps[j]);
                }
                break;
            default :
                var temps = this.getTagName(str, this.elements[i]);
                for(var j = 0; j < temps.length; j++) {
                    childElements.push(temps[j]);
                }
        }
    }
    this.elements = childElements;
    return this;
};

Base.prototype.ge = function(num) {  //getEvent 获取某一个节点,返回该节点对象
    return this.elements[num];
}
Base.prototype.eq = function(num) {  //获取某一个节点,返回Base对象
    var element = this.elements[num];
    this.elements = [];
    this.elements[0] = element;
    return this;
};
Base.prototype.first = function() { //获取首个节点
    return this.elements[0];
};
Base.prototype.last = function() { //获取最后一个节点
    return this.elements[this.elements.length-1];
};
Base.prototype.all = function() {  //获取所有节点，返回节点数组
    var all = [];
    for(var i = 0; i < this.elements.length; i++) {
        all[i] = this.elements[i];
    }
    return all;
};
Base.prototype.length = function() { //获取节点组的长度
    return this.elements.length;
};
//获取当前节点的下一个元素节点
Base.prototype.next = function() {
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i] = this.elements[i].nextSibling;
        if(this.elements[i] == null) throw new Error('找不到下一个同级元素节点');
        if(this.elements[i].nodeType == 3) this.next();
    }
    return this;
};
//获取当前节点的上一个元素节点
Base.prototype.prev = function() {
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i] = this.elements[i].previousSibling;
        if(this.elements[i] == null) throw new Error('找不到上一个同级元素节点');
        if(this.elements[i].nodeType == 3) this.prev();
    }
    return this;
};
//获取某一节点的属性
Base.prototype.attr = function(attr) {
    return this.elements[0][attr];
};
//获取某一节点在节点组中的索引
Base.prototype.index = function() {
    var children = this.elements[0].parentNode.children;
    for(var i = 0; i < children.length; i++) {
        if(this.elements[0] == children[i]) return i;
    }
};

//设置某一节点的透明度
Base.prototype.opacity = function(num) {
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].opacity = num / 100;
        this.elements[i].filter = 'alpha(opacity=' + num + ')';
    }
    return this;
};

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
        addEvent(this.elements[i], 'mouseover', over);
        addEvent(this.elements[i], 'mouseout', out);
    }
    return this;
};

Base.prototype.mousedown = function(fn) {      //设置鼠标点击事件
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].onmousedown = fn;
    }
    return this;
};

//设置点击切换效果
Base.prototype.toggle = function() {
    for(var i = 0; i < this.elements.length; i++) {
        (function(element, args) {
            var count = 0;
            addEvent(element, 'click', function(){
                args[count++ % args.length].call(this);
            });
        })(this.elements, arguments);
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
    var top = (getInner().height - top) / 2;
    var left = (getInner().width - left) / 2;
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

Base.prototype.click = function(fn) {       //触发点击事件
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].onclick = fn;
    }
    return this;
};

Base.prototype.resize = function(fn) {   //触发浏览器窗口事件
    for(var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];
        addEvent(window, 'resize', function() {
            fn();
            if(element.offsetLeft > getInner().width - element.offsetWidth) {
                element.style.left = getInner().width - element.offsetWidth + 'px';
            }
            if(element.offsetTop > getInner().height - element.offsetHeight) {
                element.style.top = getInner().height - element.offsetHeight + 'px';
            }
        });
    }
    return this;
};

//插件入口
Base.prototype.extend = function(name, fn) {
    Base.prototype[name] = fn;
};
