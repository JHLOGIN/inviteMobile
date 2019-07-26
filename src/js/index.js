$(function() {
    var dom = document.querySelector(".main");
    // var dom = document.querySelector("#con");
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = false;
    var handler = null;
    var v = 0
    for (v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }
    }

    if (!flag) {
        var mouse = new mouseEvent(dom);
        $(".upbtn").click(function() {
            up();
        })
        $(".downbtn").click(function() {
            down();
        })

    } else {
        handler = new handle(dom);
    }

    function up() {
        var nowY = document.querySelector("#nr").clientHeight * -1;
        // var nowY = document.querySelector("#nr").innerHeight * -1;
        var nowpage = $(".z-current");
        var newpage = nowpage.prev(".main-page").length > 0 ? nowpage.prev(".main-page") : $(".main-page").last();
        var timeout = setInterval(function() {
            if (nowY <= -10) {
                nowY += 5 * 1;
                newpage.addClass("z-active");
                //  nextpage.css("z-index",2);
                //  nextpage.css("display","-webkit-box;")
                var dompage = newpage.get(0);
                dompage.style.transform = `translateY(${nowY + "px"})`;
            } else {
                newpage.get(0).style.transform = `translateY("0px"})`;
                nowpage.removeClass("z-current");
                newpage.addClass("z-current");
                newpage.removeClass("z-active");

                delete newpage.get(0).style.transform;
                //清除延迟
                if (timeout != null) {
                    clearTimeout(timeout);
                }

            }
        }, 2);
    }

    function down() {
        var nowY = document.querySelector("#nr").clientHeight;
        // var nowY = document.querySelector("#nr").innerHeight;
        var nowpage = $(".z-current");
        var newpage = nowpage.next(".main-page").length > 0 ? nowpage.next(".main-page") : $(".main-page").eq(0);
        var timeout = setInterval(function() {
            if (nowY >= 0) {
                nowY -= 5;
                newpage.addClass("z-active");
                //  nextpage.css("z-index",2);
                //  nextpage.css("display","-webkit-box;")
                var dompage = newpage.get(0);
                dompage.style.transform = `translateY(${nowY + "px"})`;
            } else {
                newpage.get(0).style.transform = `translateY("0px"})`;
                nowpage.removeClass("z-current");
                newpage.addClass("z-current");
                newpage.removeClass("z-active");

                delete newpage.get(0).style.transform;
                //清除延迟
                if (timeout != null) {
                    clearTimeout(timeout);
                }

            }
        }, 2);
    }
})

//定义手势翻页
function handle(dom) {
    this.x = 0;
    this.y = 0;
    this.screenH = document.body.clientHeight; //获取屏幕的真实高度
    // this.screenH = document.body.innerHeight; //获取屏幕的真实高度
    this.ymove = 0;
    var _this = this;
    var nowpage = null; //现在显示的页面
    var newpage = null; //下一个将要显示的页面
    var downOrup = true; //上翻|下翻
    var moveing = false; //移动中
    var timeout = null; //延迟
    var isNoModity = true;
    var mainPageList = $(".main-page");
    //监听手势按下事件
    dom.addEventListener("touchstart", function(e) {
        _this.y = e.changedTouches[0].clientY;
        nowpage = $(".z-current");
    })

    //监听手势移动事件
    dom.addEventListener("touchmove", function(e) {
        _this.ymove = e.changedTouches[0].clientY - _this.y;
        _this.y = e.changedTouches[0].clientY;
        move(_this.ymove);

    })

    //监听手势放开事件
    dom.addEventListener("touchend", function(e) {
        if (downOrup && _this.nowY < 0 && isNoModity) {
            isNoModity = false;
            timeout = setInterval(function() { move(1) }, 2);

        } else if (!downOrup && _this.nowY > 0 && isNoModity) {
            isNoModity = false;
            timeout = setInterval(function() { move(-1) }, 2);
        }
    })

    //翻页
    function move(y) {
        if (!moveing && isNoModity) {
            _this.nowY = y > 0 ? _this.screenH * -1 : _this.screenH;
            moveing = true;
            downOrup = y > 0 ? true : false;
            if (downOrup) {
                newpage = nowpage.prev(".main-page").length > 0 ? nowpage.prev(".main-page") : mainPageList.last();
            } else {
                newpage = nowpage.next(".main-page").length > 0 ? nowpage.next(".main-page") : mainPageList.eq(0);
            }

        } else {

            if (downOrup) {
                movedown(y);
            } else {
                moveUp(y);
            }
        }
    }
    //上翻
    function moveUp(y) {
        if (_this.nowY > 0) {
            _this.nowY += 5 * (y > 0 ? 1 : -1);
            newpage.addClass("z-active");
            //  nextpage.css("z-index",2);
            //  nextpage.css("display","-webkit-box;")
            var dompage = newpage.get(0);
            dompage.style.transform = `translateY(${_this.nowY + "px"})`;
        } else {
            isNoModity = true;
            moveing = false;
            newpage.get(0).style.transform = `translateY("0px"})`;
            nowpage.removeClass("z-current");
            newpage.addClass("z-current");
            newpage.removeClass("z-active");
            delete newpage.get(0).style.transform;

            if (timeout != null) {
                clearTimeout(timeout);
            }
        }
    }
    //下翻
    function movedown(y) {
        if (_this.nowY < 0) {
            _this.nowY += 5 * (y > 0 ? 1 : -1);

            newpage.addClass("z-active");
            //  nextpage.css("z-index",2);
            //  nextpage.css("display","-webkit-box;")
            var dompage = newpage.get(0);
            dompage.style.transform = `translateY(${_this.nowY + "px"})`;
        } else {
            isNoModity = true;
            moveing = false;
            newpage.get(0).style.transform = `translateY("0px"})`;
            nowpage.removeClass("z-current");
            newpage.addClass("z-current");
            newpage.removeClass("z-active");

            delete newpage.get(0).style.transform;
            //清除延迟
            if (timeout != null) {
                clearTimeout(timeout);
            }

        }
    }
}

function mouseEvent(dom) {
    this.x = 0;
    this.y = 0;
    this.screenH = document.querySelector("#nr").clientHeight; //获取屏幕的真实高度
    // this.screenH = document.querySelector("#nr").innerHeight; //获取屏幕的真实高度
    this.ymove = 0;
    var _this = this;
    var nowpage = null; //现在显示的页面
    var newpage = null; //下一个将要显示的页面
    var downOrup = true; //上翻|下翻
    var moveing = false; //移动中
    this.timeout = null; //延迟
    var isNoModity = true;
    var iscurstatues = false;
    var pageselector = ".main-page";
    var mainPageList = $(".main-page");
    var img = $("img");
    nowpage = $(".z-current");
    img.on("contextmenu", function() { return false; });
    img.on("dragstart", function() { return false; });
    $(document).bind("contextmenu copy selectstart", function() {
        return false;
    });
    $(dom).find(pageselector).mousedown(function(e) {
        _this.y = e.pageY;
        nowpage = $(".z-current");
        iscurstatues = true;

    })
    $(dom).find(pageselector).mousemove(function(e) {
        if (iscurstatues) {
            _this.ymove = e.pageY - _this.y;
            _this.y = e.pageY;
            _this.move(_this.ymove);

        }
        e.stopPropagation();
    });
    $(dom).find(pageselector).mouseup(function(e) {
        iscurstatues = false;
        if (downOrup && _this.nowY < 0 && isNoModity) {
            isNoModity = false;
            _this.timeout = setInterval(function() { _this.move(1) }, 2);

        } else if (!downOrup && _this.nowY > 0 && isNoModity) {
            isNoModity = false;
            _this.timeout = setInterval(function() { _this.move(-1) }, 2);
        }
        e.stopPropagation();
    })

    $(dom).find(pageselector).mouseout(function(e) {
        iscurstatues = false;
        if (downOrup && _this.nowY < 0 && isNoModity) {
            isNoModity = false;
            _this.timeout = setInterval(function() { _this.move(1) }, 2);

        } else if (!downOrup && _this.nowY > 0 && isNoModity) {
            isNoModity = false;
            _this.timeout = setInterval(function() { _this.move(-1) }, 2);
        }
        e.stopPropagation();
    })

    //翻页
    this.move = function(y) {
        if (!moveing && isNoModity) {
            _this.nowY = y > 0 ? _this.screenH * -1 : _this.screenH;
            moveing = true;
            downOrup = y > 0 ? true : false;
            if (downOrup) {
                newpage = nowpage.prev(".main-page").length > 0 ? nowpage.prev(".main-page") : mainPageList.last();
            } else {
                newpage = nowpage.next(".main-page").length > 0 ? nowpage.next(".main-page") : mainPageList.eq(0);
            }

        } else {
            if (downOrup) {
                movedown(y);
            } else {
                moveUp(y);
            }
        }
    }

    //上翻
    function moveUp(y) {
        if (_this.nowY > 0) {
            _this.nowY += 5 * (y > 0 ? 1 : -1);
            newpage.addClass("z-active");
            //  nextpage.css("z-index",2);
            //  nextpage.css("display","-webkit-box;")
            var dompage = newpage.get(0);
            dompage.style.transform = `translateY(${_this.nowY + "px"})`;
        } else {
            isNoModity = true;
            newpage.get(0).style.transform = `translateY("0px"})`;
            nowpage.removeClass("z-current");
            newpage.addClass("z-current");
            newpage.removeClass("z-active");
            delete newpage.get(0).style.transform;
            moveing = false;

            if (_this.timeout != null) {
                clearTimeout(_this.timeout);
            }
        }
    }
    //下翻
    function movedown(y) {
        if (_this.nowY < -10) {
            _this.nowY += 5 * (y > 0 ? 1 : -1);
            newpage.addClass("z-active");
            //  nextpage.css("z-index",2);
            //  nextpage.css("display","-webkit-box;")
            var dompage = newpage.get(0);
            dompage.style.transform = `translateY(${_this.nowY + "px"})`;
        } else {
            isNoModity = true;
            moveing = false;
            newpage.get(0).style.transform = `translateY("0px"})`;
            nowpage.removeClass("z-current");
            newpage.addClass("z-current");
            newpage.removeClass("z-active");

            delete newpage.get(0).style.transform;
            //清除延迟
            if (_this.timeout != null) {
                clearTimeout(_this.timeout);
            }

        }
    }
}