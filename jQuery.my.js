(function () {

    // jquery 的核心方法
    var jQuery = function (selector) {
        // 如果传入进来的是一个函数,则做成入口函数
        if (typeof selector === 'function') {
            document.addEventListener('DOMContentLoaded', selector)
        } else {

            //这里调用init 构造函数,创建一个新对象,并返回
            return new init(selector);
        }

    }

    //这里是构造函数   用于new 出来一个新的jq对象,然后把查找到的dom作为 jq对象的属性保存;
    function init(selector) {
        var doms;
        if (typeof selector === "string") {
            // 根据传进来的选择器,进行获取页面的dom对象集合
            doms = document.querySelectorAll(selector);
        }
        else if (
            selector instanceof HTMLCollection ||
            selector instanceof NodeList) {//传的是伪数组
            doms = selector;
        }
        else if (selector instanceof HTMLElement) {// 如果传入的是dom对象就返回jq对象 用于children
            doms = [selector];
        }
        else if (selector instanceof Array) {// 如果传入的是数组就将数组里的对象添加到jq对象中
            doms = selector;
        }

        //遍历doms,把doms集合每一个对象 添加进 init构造函数对象,init对象 === jq对象
        for (var i = 0; i < doms.length; i++) {
            //给 jq 对象挂载属性
            this[i] = doms[i];
        }
        // 添加doms集合 length 属性
        this.length = doms.length;

    }

    var addPX = function (key, value) {
        var arr = ['opacity', 'zIndex', 'fontWeight']
        if (arr.includes(key)) {
            return value;
        }
        return value + 'px';
    }
    //转换驼峰命名 函数 
    var toCamelCase = function (str) {

        // 1.将字符串提取为数组   按照 '-'进行分割；
        var item = str.split('-');

        var newstr = "";
        var first = "";
        for (var i = 1; i < item.length; i++) {
            //  先slice()提取 首字母  再toUpperCase()进行转大写
            first = item[i].slice(0, 1).toUpperCase();
            //拼接首字母和剩余字母   这里因为没有提取item[0] 外面要加item[0]
            newstr += first + item[i].slice(1);
        }
        return item[0] + newstr;
    }
    init.prototype.toCamelCase = function (str) {

        // 1.将字符串提取为数组   按照 '-'进行分割；
        var item = str.split('-');

        var newstr = "";
        var first = "";
        for (var i = 1; i < item.length; i++) {
            //  先slice()提取 首字母  再toUpperCase()进行转大写
            first = item[i].slice(0, 1).toUpperCase();
            //拼接首字母和剩余字母   这里因为没有提取item[0] 外面要加item[0]
            newstr += first + item[i].slice(1);
        }
        return item[0] + newstr;
    }
    init.prototype.addPX = function (key, value) {
        var arr = ['opacity', 'zIndex', 'fontWeight']
        if (arr.includes(key)) {
            return value;
        }
        return value + 'px';
    };
    //  遍历方法
    init.prototype.each = function (fn) {
        // 这里的this 永远是init jq对象; 也就是有包含doms元素的集合;  
        for (var i = 0; i < this.length; i++) {
            //这里遍历调用传进来的fn  并且传参 i索引,和item每一项
            fn(i, this[i]);
        }
        // 链式编程
        return this
    }


    init.prototype.addClass = function (className) {
        this.each(function (index, item) {
            item.classList.add(className);
        })
        //  把当前调用方法的对象,再返回出去; 实现链式编程
        return this;
    }

    init.prototype.removeClass = function (className) {
        return this.each(function (index, item) {
            item.classList.remove(className);
        })
    }
    init.prototype.hide = function () {
        return this.each(function (index, element) {
            element.display = 'none';
        })
    }
    init.prototype.show = function () {
        return this.each(function (index, element) {
            element.display = 'block';
        })

    }
    init.prototype.toggle = function () {

        return this.each(function (index, element) {
            var isbl = window.getComputedStyle(element).display;
            if (isbl === 'none') {
                element.style.display = 'block';
                console.log('显示');

                element.style.display = 'none'
                console.log('隐藏');
            }

        })
    }
    init.prototype.val = function (value) {
        if (value === undefined) {
            var value = '';
            this.each((i, e) => value = e.value)
            return value;
        } else {
            this.each((i, e) => e.value = value)
        }
    }
    init.prototype.html = function (str) {
        if (str === undefined) {
            var html = '';
            this.each((i, e) => html = e.innerHTML)
            return html;
        } else {
            this.each((index, item) => item.innerHTML = str)
        }
    }
    init.prototype.text = function (str) {
        if (str === undefined) {
            var text = '';
            this.each(function (i, e) {
                text = e.innerText;
            })
            return text;
        } else {
            this.each((index, item) => item.innerText = str)
        }

    }
    init.prototype.css = function (key, value) {
        if (typeof value === 'number') {
            this.each(function (index, item) {
                item.style[key] = addPX(key, value);
            })
            return this;
        } else if (typeof value === 'string') {

            this.each((index, item) => {
                item.style[key] = value;
            })
        } else if (typeof key === 'object') {

            this.each((index, item) => {
                for (var proper in key) {
                    var withPX = addPX(proper, key[proper]);
                    item.style[proper] = withPX;
                }
            })
            return this;
        } else if (typeof value === 'undefined') {

            var property;
            this.each((index, item) => {

                property = window.getComputedStyle(item)[key]

            })
            return property;
        }

    }
    init.prototype.eq = function (index) {
        return new init(this[index])
    }

    init.prototype.children = function (ele) {
        if (ele === undefined) {
            var childArr;
            this.each((index, item) => childArr = item.children)
            return new init(childArr)
        }
        else if (typeof ele === 'string') {
            var dom;
            this.each((index, item) => {
                dom = item.querySelector(ele);
            });
            return new init(dom);

        }
    }
    init.prototype.parent = function () {
        return new init(this[0].parentNode)
    }
    init.prototype.siblings = function () {
        // 根据this[0] 获取父亲下面的所有孩子
        var allChild = Array.from(this[0].parentNode.children);
        var brother = [];
        allChild.forEach((item, index) => {
            if (item === this[0]) return;     // 为了不让添加this[0]              
            brother.push(item)
        })
        return new init(brother);//传入整个数组
    }
    init.prototype.on = function (type, selector, fn) {
        if (fn === undefined) {
            fn = selector;
            return this.each((index, item) => item.addEventListener(type, fn));
        } else {
            this.each(function (index, item) {
                item.addEventListener(type, function (event) {
                    var child = item.querySelectorAll(selector);
                    var isChild = Array.from(child).includes(event.target);
                    if (isChild) {
                        // 我们自己手动调用传进来的那个函数,此时因为没有通过对象去调用
                        //默认是 window 替我们调用,手动把 this 改成 触发的事件源
                        fn.call(event.target);
                    }
                })
            })
        }
    }
    //将我们的核心jQuery函数,设为window的方法存着,也就是变成全局方法.
    window.jQuery = window.$ = jQuery;
})()