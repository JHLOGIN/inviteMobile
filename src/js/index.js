$(function () {
    var dom = document.querySelector(".main");
    var handler = new handle(dom);
})
function handle(dom) {
    this.x = 0;
    this.y = 0;
    this.screenH = window.screen.availHeight;
    this.ymove = 0;
    var _this = this;
    var nowpage = null;
    var newpage = null;
    var downOrup = true;
    var moveing = false;
    var timeout = null;
    var mainPageList = $(".main-page");
    dom.addEventListener("touchstart", function (e) {
        _this.y = e.changedTouches[0].clientY;
        nowpage = $(".z-current");

    })
    dom.addEventListener("touchmove", function (e) {
        _this.ymove = e.changedTouches[0].clientY - _this.y;
        _this.y = e.changedTouches[0].clientY;
        move(_this.ymove);
    })
    dom.addEventListener("touchend", function (e) {
        if (downOrup && _this.nowY < 0) {
            timeout = setInterval(function () { move(1) }, 2);

        } else if (!downOrup && _this.nowY > 0) {

            timeout = setInterval(function () { move(-1) }, 2);
        }
    })

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