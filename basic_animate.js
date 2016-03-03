
//插件--动画
//2016.2.26 添加透明度变化

/*
说明
外部调用格式如：$('#box').animate({attr:'y',alter:500});
*action1:可添加fn函数，在动画结束后执行，即队列动画。 格式如：animate({fn:function(){}})
*action2:当attr不是可选项的其中一个且不为undefined，则使用传进来的值
*action3:mul格式如：mul : {w:300,h:300}

@param  attr   可选 属性或方向或透明度(x,y,w,h,o)  默认为left
@param  start  可选 起始点  默认是当前css起始值
@param  step   可选 步长  默认为20
@param  t      可选 时间  默认每20毫秒执行一次
@param  speed  可选 缓冲速度  默认是6
@param  type   可选 类型(0,1)  默认是1,缓冲
@param  alter/target
               必选 增量/目标量 至少一个,同时设置则忽略增量只选目标量
@param  mul    可选 同时变化的量 有多个需要同时变化的量时使用
*/

$().extend('animate', function(obj){
    var num = 0; //保存的是parseInt后的style
    var temp = 0; //保存的是parseFloat后的style
    for(var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i]; //每次循环保存element

        var attr = obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' : obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' : obj['attr'] == 'o' ? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left'; //x轴方向和y轴方向，物体的width和height值，默认是left
        var start = obj['start'] != undefined ? obj['start'] : attr == 'opacity' ? parseFloat(getStyle(element, attr)) * 100 : parseInt(getStyle(element, attr)); //默认是css起始值
        var step = obj['step'] != undefined ? obj['step'] : 20; //默认步长为20
        var t = obj['t'] != undefined ? obj['t'] : 20; //默认20毫秒执行一次

        var speed = obj['speed'] != undefined ? obj['speed'] : 6; //默认缓冲速度是6
        var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer'; //0表示匀速 1表示缓冲 默认缓冲

        var alter = obj['alter'];
        var target = obj['target'];
        var mul = obj['mul'];

        if(alter != undefined && target == undefined) {
            target = alter + start;
        } else if(alter == undefined && target == undefined && mul == undefined) {
            throw new Error('alter增量或target目标量必须至少传一个！');
        }

        if(start > target) step = -step;
        if(attr == 'opacity') { //透明度
            element.style.opacity = start / 100;
            element.style.filter = 'alpha(opacity = ' + start + ')';
        } else {    //运动动画
            //element.style[attr] = start + 'px'; //每次运行重置起始点
        }

        if(mul == undefined) {
            mul = {};
            mul[attr] = target;
        }

        clearInterval(element.timer); //每次执行时先清timer,window下的是全局变量
        element.timer = setInterval(function(){
            //创建一个布尔值，可以了解多个动画是否同时执行完毕
            var flag = true;

            for(var i in mul) {
                attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' : i == 'o' ? 'opacity' : i != undefined ? i : 'left';
                target = mul[i];

                num = parseInt(getStyle(element, attr));
                temp = parseFloat(getStyle(element, attr)) * 100;
                
                if(type == 'buffer') {   //缓冲
                    step = attr == 'opacity' ? (target - temp) / speed : (target - num) / speed;
                    if(step > 0) {
                        step = Math.ceil(step);
                    } else {
                        step = Math.floor(step);
                    }
                }

                if(attr == 'opacity') {     //渐变
                    if(step == 0) {
                        setOpacity();
                    } else if(step > 0 && temp >= (target - step)) {
                        setOpacity();
                    } else if(step < 0 && temp <= (target - step)) {
                        setOpacity();
                    } else {
                        element.style.opacity = (temp + step) / 100;
                        element.style.filter = 'alpha(opacity=' + (temp + step) + ')';
                    }
                    if(parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) flag = false;
                } else {    //运动
                    //下面判断target-step是因为num先保存的，不是加了step后的最新位置
                    if(step == 0) {
                        setTarget();
                    } else if(step > 0 && num >= (target - step)) {
                        setTarget();
                    } else if(step < 0 && num <= (target - step)) {
                        setTarget();
                    } else {
                        element.style[attr] = num + step + 'px';
                    }
                }
                if(parseInt(target) != parseInt(getStyle(element, attr))) flag = false;
            }
            //document.getElementById('background-p').innerHTML += step + '<br>';

            if(flag) {
                clearInterval(element.timer);
                if(obj.fn) obj.fn();
            }

            function setTarget() {
                element.style[attr] = target + 'px';
            }
            function setOpacity() {
                element.style.opacity = parseInt(target) / 100;
                element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';
            }

        },t);
    }
    return this;
});

