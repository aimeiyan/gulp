$(function () {
    // 点击“查看更多”出现浏览历史记录模态框

    $(".jh-compare-recent-people .jh-view-more a").click(function () {
        $(".jh-view-history-modal").show();
        $(".jh-modal-overlay").show();
        $(".jh-view-history-modal .jh-view-history-time-second-ul").hide();
        $(".jh-view-history-modal .jh-view-history-time-first-ul li").removeClass("active");
    });

    // 点击“关闭”和“x”隐藏浏览历史记录模态框
    $(".jh-view-history-modal .jh-modal-close,.jh-view-history-modal .jh-modal-btn-cancel").click(function () {
        $(".jh-view-history-modal").hide();
        $(".jh-modal-overlay").hide();
    });

    // 按日期浏览历史记录条目展开记录信息
    function unfoldHistoryListByDate() {
        $(".jh-view-history-modal .jh-view-history-time-first-ul > li .jh-ul-title").click(function () {

            var $this = $(this);
            var itemNum = $this.parent().siblings().length + 1;
            var itemIdx = $this.parent().index();

            var dataId = $(this).attr("data-id");
            var $nextUlWrp = $(this).next(".jh-view-history-time-second-ul");
            var isShow = false;

            if ($(this).next().is(":visible")) {
                isShow = true;
            }

            if (isShow) {
                $(this).next().hide();
                $(this).closest("li").removeClass("active");
            } else {
                $this.parent().addClass("active");
                if ($nextUlWrp.find("li").length) {
                    $nextUlWrp.show();
                    return;
                }

                if (itemIdx === itemNum - 1) { //请求第三周的数据（第三周包括之前所有的数据，要滚动加载）
                    var pageNum = 1;

                    function thirdWeek(pageNum) {

                        $.ajax({
                            "url": "../data/viewHistory/dateContent.json",
                            "type": "post",
                            "data": {
                                "id": dataId,
                                "pageNum": pageNum,
                                "pageSize": 10
                            },
                            success: function (data) {

                                pageNum += 1;
                                var weekThirdHtml = "";
                                for (var k = 0; k < data.length; k++) {
                                    weekThirdHtml += '<li>'
                                        + '<span class="jh-view-portrait"><img src="' + data[k].img + '" alt="">'
                                        + '<a href="javacript:void(0);" class="jh-name">' + data[k].name + '</a></span>'
                                        + '<span>' + data[k].organ + '</span>'
                                        + '<span>' + data[k].job + '</span>'
                                        + '<span>' + data[k].time + '</span>'
                                        + '</li>';
                                }

                                $nextUlWrp.append(weekThirdHtml);
                                $nextUlWrp.show();

                                $('.jh-view-history-time-first-ul').off('scrollreachbottom');
                                $('.jh-view-history-time-first-ul').on('scrollreachbottom', function (ev) {
                                    if ($(".jh-view-history-modal .jh-view-history-time-first-ul .optiscroll-content>li:last").addClass("active")) {
                                        thirdWeek(pageNum);
                                    }
                                });

                            }
                        })
                    }

                    thirdWeek(pageNum);



                } else {
                    $.ajax({
                        "url": "../data/viewHistory/dateContent.json",
                        "type": "post",
                        "data": {
                            "id": dataId
                        },
                        "success": function (data) {
                            var dateHistoryList = '';

                            // 当数据为空时
                            if (!data.length) {
                                $nextUlWrp.empty().append("<li style='font-weight: normal;text-align: center;color: #999;line-height: 2.5'>暂无数据</li>");
                                $nextUlWrp.show();
                                return
                            }

                            for (var k = 0; k < data.length; k++) {
                                dateHistoryList += '<li>'
                                    + '<span class="jh-view-portrait"><img src="' + data[k].img + '" alt="">'
                                    + '<a href="javacript:void(0);" class="jh-name">' + data[k].name + '</a></span>'
                                    + '<span>' + data[k].organ + '</span>'
                                    + '<span>' + data[k].job + '</span>'
                                    + '<span>' + data[k].time + '</span>'
                                    + '</li>';
                            }


                            $nextUlWrp.empty().append(dateHistoryList);
                            $nextUlWrp.show();

                        }
                    })

                }
            }
        })
    }

    //选择查看浏览历史记录方式：日期、次数
    $(".jh-select-view-type").off("click");
    $(".jh-select-view-type").click(function (e) {
        $(this).parent().find(".jh-select-list").toggle();
    });

    $(".jh-angle-down-wrp").click(function () {
        $(this).closest(".jh-select-view-wrp").find(".jh-select-view-type").trigger("click");
    });


    $(".jh-view-history-modal .jh-select-list li").off("click");
    $(".jh-view-history-modal .jh-select-list li").click(function () {
        var dataTab = $(this).attr("data-tab");
        var selectText = $(this).text();
        var $inputVal = $(this).closest(".jh-select-view-wrp").find(".jh-select-view-type");
        $(this).closest(".jh-select-list").hide();
        if (selectText === $inputVal.text()) return;
        $inputVal.text(selectText);

        if (dataTab === "date") {
            $(".jh-view-history-tab").hide();
            $("#jh-view-history-tab-date").show();
            $(".jh-view-history-modal .jh-pages-container").css("display", "none");

            if (!$(".jh-view-history-time-first-ul>li").length) {
                viewHistoryByDate();
            }
        } else {
            $(".jh-view-history-time-first-ul .jh-view-history-time-second-ul").hide();
            $(".jh-view-history-tab").hide();
            $("#jh-view-history-tab-number").show();
            $(".jh-view-history-modal .jh-pages-container").css("display", "block");
            if (!$(".jh-view-history-number-second-ul li").length) {
                viewHistoryByNumber(0);
            }
        }
    });

    $(".jh-view-history-modal .jh-select-list li").eq(0).trigger("click");

    $("*").on('click', function (e) {
        // 点击其他部位，收起下拉框
        if (!$(e.target).closest('.jh-select-view-wrp').length) {
            $(".jh-view-history-modal .jh-select-list").hide();
        }

    });
    //end 自定义下拉框

    var scrollBarByDate;
    var optiscrollInstanceByDate;


    //按日期查看浏览历史记录
    function viewHistoryByDate() {
        $.ajax({
            "url": "../data/viewHistory/date.json",
            "type": "POST",
            "data": {
            },
            "success": function (data) {

                var dateHistory = '';
                for (var i = 0; i < data.length; i++) {
                    dateHistory += '<li>'
                        + '<h3 class="jh-ul-title" data-id="' + data[i].id + '"><i class="jh-angle-icon jh-right"></i><i class="jh-time-icon"></i>' + data[i].date + '</h3>'
                        + '<ul class="jh-view-history-time-second-ul">';
                    dateHistory += '</ul></li>';
                }

                $(".jh-view-history-modal .jh-view-history-time-first-ul").empty().append(dateHistory);
                unfoldHistoryListByDate();
                // 添加第三方滚动条效果
                scrollBarByDate = document.querySelector('.jh-view-history-time-first-ul');
                optiscrollInstanceByDate = new Optiscroll(scrollBarByDate);


            }
        })
    }

    var scrollBarByNumber;
    var optiscrollInstanceByNumber;

    //按次数查看浏览历史记录
    function viewHistoryByNumber(pageNum) {
        var pageSize = 10;
        pageNum = pageNum;
        $.ajax({
            "url": "../data/viewHistory/number.json",
            "type": "POST",
            "data": {
                "page": pageNum,
                "pageSize": pageSize
            },
            "success": function (data) {
                if (data.length === 0) return;


                var numberHistory = '';
                for (var i = 0; i < data.length; i++) {
                    numberHistory += '<li>'
                        + '<span class="jh-view-portrait">'
                        + '<img src="' + data[i].img + '" alt="">'
                        + '<a href="javascript:void(0);" class="jh-name">' + data[i].name + '</a></span>'
                        + '<span>' + data[i].organ + '</span>'
                        + '<span>' + data[i].job + '</span>'
                        + '<span>' + data[i].number + '次</span>'
                        + '</li>';
                }

                if (pageNum === 0) {
                    $(".jh-view-history-modal .jh-view-history-number-second-ul").append(numberHistory);
                    // 添加第三方滚动条效果
                    scrollBarByNumber = document.querySelector('.jh-view-history-modal .jh-view-history-number-second-ul');
                    optiscrollInstanceByNumber = new Optiscroll(scrollBarByNumber);
                } else {
                    $(".jh-view-history-modal .jh-view-history-number-second-ul .optiscroll-content").append(numberHistory);
                }


//                document.querySelector('.jh-view-history-modal .jh-view-history-number-second-ul').addEventListener('scrollreachbottom', function (ev) {
//                    viewHistoryByNumber(pageNum);
//                });

                //滚动加载
                pageNum = pageNum + 1;
                $('.jh-view-history-number-second-ul').off('scrollreachbottom');
                $('.jh-view-history-number-second-ul').on('scrollreachbottom', function (ev) {
                    viewHistoryByNumber(pageNum);
                });

            }
        })
    }

    //点击页面事件
    $(".jh-view-history-pages li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var pageNum = parseInt($(this).find("a").text());
        var pageSize = 10;
        viewHistoryByNumber(pageNum);
    });



});
