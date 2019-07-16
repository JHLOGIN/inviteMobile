$(function () {
    var dom = document.querySelector(".main");
    var handler = new handle(dom);
})

//定义手势翻页
function handle(dom) {
    this.x = 0;
    this.y = 0;
    this.screenH = window.screen.availHeight;//获取屏幕的真是高度
    this.ymove = 0;
    var _this = this;
    var nowpage = null; //现在显示的页面
    var newpage = null; //下一个将要显示的页面
    var downOrup = true; //上翻|下翻
    var moveing = false; //移动中
    var timeout = null;  //延迟
    var mainPageList = $(".main-page");
    //监听手势按下事件
    dom.addEventListener("touchstart", function (e) {
        _this.y = e.changedTouches[0].clientY;
        nowpage = $(".z-current");

    })
    //监听手势移动事件
    dom.addEventListener("touchmove", function (e) {
        _this.ymove = e.changedTouches[0].clientY - _this.y;
        _this.y = e.changedTouches[0].clientY;
        move(_this.ymove);
    })
    //监听手势放开事件
    dom.addEventListener("touchend", function (e) {
        if (downOrup && _this.nowY < 0) {
            timeout = setInterval(function () { move(1) }, 2);

        } else if (!downOrup && _this.nowY > 0) {

            timeout = setInterval(function () { move(-1) }, 2);
        }
    })
   //翻页
    function move(y) {
        if (!moveing) {
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
                console.log("up");
                moveUp(y);
            }
        }


    }
    //上翻
    function moveUp(y) {
        console.log(_this.nowY);
        if (_this.nowY > 0) {
            _this.nowY += 5 * (y > 0 ? 1 : -1);
            newpage.addClass("z-active");
            //  nextpage.css("z-index",2);
            //  nextpage.css("display","-webkit-box;")
            var dompage = newpage.get(0);
            dompage.style.transform = `translateY(${_this.nowY + "px"})`;
        } else {
            newpage.get(0).style.transform = `translateY("0px"})`;
            nowpage.removeClass("z-current");
            newpage.addClass("z-current");
            newpage.removeClass("z-active");
            delete newpage.get(0).style.transform;
            moveing = false;

            if (timeout != null) {
                clearTimeout(timeout);
            }
        }
    }
    //下翻
    function movedown(y) {
        if (_this.nowY < 0) {
            _this.nowY += 5 * (y > 0 ? 1 : -1);
            console.log(_this.nowY);
            newpage.addClass("z-active");
            //  nextpage.css("z-index",2);
            //  nextpage.css("display","-webkit-box;")
            var dompage = newpage.get(0);
            dompage.style.transform = `translateY(${_this.nowY + "px"})`;
        } else {
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