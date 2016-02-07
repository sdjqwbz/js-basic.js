
/*
这里存放一些js函数封装。不定时更新

1、checkUserAgent()  //自己写的浏览器检测函数2016.1.14
2、addEvent(node, evt, fn)  //事件添加函数2016.1.16 第一个参数为节点或是想要触发事件的对象，第二个是事件名，第三个是想要执行的函数
3、createXHR()  //创建XHR对象的函数封装2016.1.16

*/

function checkUserAgent() {  //浏览器检测函数2016.1.14
    var agent = navigator.userAgent;
    var mV = {
        isGecko : agent.match(/Gecko/i),
        isWebkit : agent.match(/AppleWebkit/i),
        isTrident : agent.match(/Trident/i),
        isMSIE : agent.match(/MSIE (\d+)/i),
        isFirefox : agent.match(/Firefox/i),
        isChrome : agent.match(/Chrome/i)
    };
    if(mV.isGecko && mV.isFirefox) {
        alert('这是火狐浏览器');
    } else if(mV.isWebkit && mV.isChrome) {
        alert('这是谷歌浏览器');
    } else if(mV.isTrident) {
        try {
            alert('这是IE' + mV.isMSIE[1] + '浏览器');
        } catch (e) {
            throw new Error('该IE无法检测！');
        }
    } else {
        alert('这是safari浏览器');
    }
}

function addEvent(node, evt, fn) { //仿制，添加事件函数，2016.1.16
    var save = null; //保存上一个事件
    if(typeof node["on"+evt] == 'function') {
        save = node["on"+evt];
    }
    node["on"+evt] = function() {
        if(save) save(); 
        /*这里save()是什么原理？原理是，调用时，前一个addEvent()会被后一个addEvent()覆盖，所以把前一个的事件执行保存起来，在后一个里面执行*/
        fn();
    };
}

function createXHR() {  //摘抄 创建XHR对象的函数封装 2016.1.16
    if(typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else if(typeof ActiveXObject != 'undefined') {
        var version = [
                        "MSXML2.XMLHttp.6.0",
                        "MSXML2.XMLHttp.3.0",
                        "MSXML2.XMLHttp"
        ];
        for(var i =0; i < version.length; i++) {
            try {
                return new ActiveXObject(version[i]);
            } catch(e) {
                throw new Error('你的浏览器不支持XHR对象');
            }
        }
    }
}
