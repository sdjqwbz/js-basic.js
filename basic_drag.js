
//插件--拖拽功能

$().extend('drag', function(){
    var tags = arguments;
    for(var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], 'mousedown', function(e){
            //如果内容为空，再阻止默认行为
            if(trim(this.innerHTML).length == 0) e.preventDefault();
            var _this = this;
            var divX = e.clientX - _this.offsetLeft,
                divY = e.clientY - _this.offsetTop;
            
            //自定义选择区域
            var flag = false;
            for(var i = 0; i < tags.length; i++) {
                if(e.target == tags[i]) {
                    flag = true;  //只要有一个是true，就跳出
                    break;
                }
            }

            if(flag) {
                //点击某个物体用的是oDiv，move和up是全局区域，应该用document
                //用现代事件绑定时，为了能移除，将addEvent里的匿名函数写为move、up函数
                addEvent(document, 'mousemove', move);
                addEvent(document, 'mouseup', up);
            } else {
                removeEvent(document, 'mousemove', move);
                removeEvent(document, 'mouseup', up);
            }

            function move(e) {
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

                if(typeof _this.setCapture != 'undefined') {
                    _this.setCapture();
                }
            }
            function up() {
                removeEvent(document, 'mousemove', move);
                removeEvent(document, 'mouseup', up);
                if(typeof _this.releaseCapture != 'undefined') {
                    _this.releaseCapture();
                }
            }
        });
    }
    return this;
});
