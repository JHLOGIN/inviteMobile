$(function() {
    var dom = document.querySelector(".main");
    var nav = document.querySelector(".nav");
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

        // window.location.reload();
        // $(document).ready(function() {
        //     if (location.href.indexOf("#") == -1) {
        //         location.href = location.href + "#";
        //         location.reload();
        //     }
        // })
    } else {
        handler = new handle(dom);
        nav.style.display = "none";
        // window.location.reload();
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

// 导航栏：点击选项选中当前项，添加样式，表示当前选中项
$(".navli li").click(function() {
    var index = $(this).index();
    $(this).addClass("active").siblings().removeClass("active");
    $(".navli").eq(index).show().siblings(".navli").hide();
});

// 注册隐藏和显示
// $("#addregister").click(function() {
//     $("#formregister").show();
// })
// $("#closeregister").click(function() {
//     $("#formregister").hide();
// })

// 把浏览器网页宽度赋给id为registerbgc的div
// $(function() {
//     var winWidth = document.body.clientWidth;
// })
// $("#registerbgc").css('width', 'winWidth')

// 点击注册出现form表单
function addregister() {
    document.getElementById('registerbgc').style.display = 'block';
    document.getElementById('register').style.display = 'block';
}
// 点击form表单中的取消按钮，form表单隐藏并重新刷新页面
$("#closeregister").click(function() {
    $("#register").hide();
    $("#registerbgc").hide();
    window.location.reload();
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
        isNoModity = true;
        moveing = false;
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
            newpage.get(0).style.transform = 'translateY(0px)';
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
            // console.log("翻页结束");
            // isNoModity = true;
            // moveing = false;
            newpage.get(0).style.transform = 'translateY(0px)';
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
        if (iscurstatues && Math.abs(e.pageY - _this.y) > 10) {
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
            newpage.get(0).style.transform = 'translateY(0px)';
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
            newpage.get(0).style.transform = 'translateY(0px)';
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

//函数：验证邮箱格式
function isEmail(strEmail) {
    //定义正则表达式的变量:邮箱正则
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    // console.log(strEmail);
    //文本框不为空，并且验证邮箱正则成功，给出正确提示
    if (strEmail != null && strEmail.search(reg) != -1) {
        return true;
    } else {
        alert('请输入有效的邮箱地址！')
        $('#eml').val('')
    }
}

function saveReport() {
    // jquery 表单提交
    // $("#form_con").ajaxSubmit(function(message) {
    $("#navregister").ajaxSubmit(function(message) {
        // 对于表单提交成功后处理，message为提交页面saveReport.htm的返回内容 
        // required: true,
        // email: true,
        console.log(message)
            // if (true) {
            //     // 成功了：表单重置为空

        // } else {
        //     // 失败了
        // }
    });
    return false; //必须返回false，否则表单会自己再做一次提交操作，并且页面跳转 
}

// $("#navregister").bind("click", function() {
//     $.ajax(function(msg) {
//         console.log(msg)
//     })
// })

// $(function() {
//     /** 验证文件是否导入成功  */
//     $("form").ajaxForm(function(data) {
//         if (data == "1") {
//             alert("提交成功！");
//         }
//     });
// });