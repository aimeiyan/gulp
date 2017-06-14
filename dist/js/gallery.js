$(function () {
    //获取图库数据
    $.ajax({
        "url": "../data/staffView/json/tuku/tukuData.json",
        "data": {},
        "type": "post",
        "success": function (data) {

            var headerHtml = '';

            for (var i = 0; i < data.length; i++) {
                headerHtml += '<li group-id="' + data[i].id + '">' + data[i].text + '（' + data[i].picCount + '）</li>';
            }

            $(".jh-gallery-header ul").append(headerHtml);

            mainContent(data);

        }
    });


    //点击标题切换成相应图片组
    function mainContent(data) {
        var $headerLi = $('.jh-gallery-header li');

        $headerLi.click(function () {

            var $this = $(this);
            var groupId = $this.attr("group-id");
            var contentHtml = '';

            //标题切换样式
            $headerLi.removeClass('active');
            $(this).addClass('active');

            console.log(data, "---data--")

            for (var i = 0; i < data.length; i++) {
                if (data[i].id === groupId) {
                    if (data[i].picArr.length) {
                        for (var k = 0; k < data[i].picArr.length; k++) {

                            //添加默认的封面样式
                            if (data[i].picArr[k].isCover) {
                                contentHtml += '<div class="jh-gallery-box jh-isCover">';
                            } else {
                                contentHtml += '<div class="jh-gallery-box">';
                            }

                            contentHtml += '<div class="jh-gallery-box-subwrp">'
                                + '<i class="jh-gallery-cover-icon"></i>'
                                + '<i class="jh-gallery-edit-remove-icon"></i>'
                                + '<div>'
                                + '<img src="' + data[i].picArr[k].src + '" alt="" data-id="' + data[i].picArr[k].id + '">'
                                + '</div>'
                                + '<div class="jh-gallery-title-text">'
                                + '<div><input type="text" readonly="readonly" value="' + data[i].picArr[k].picName + '"><i class="jh-gallery-edit-icon"></i></div>'
                                + '</div>'
                                + '</div>'
                                + '</div>';
                        }

                        $(".jh-gallery-gallerys").empty().append(contentHtml);

                    } else {
                        $(".jh-gallery-gallerys").empty().append("<img class='jh-upload-null-pic' src='../images/jh-pic-upload-null.jpg'>");
                    }

                }
            }


            //删除图片
            delPic();
            //点击设置封面操作
            coverPic();
            //编辑图片标题操作
            editPicTitle();
            //提交图片修改后的标题
            submitTitle();

        });
        $headerLi.eq(0).trigger("click");
    }


    //删除图片操作
    function delPic() {
        $(".jh-gallery-edit-remove-icon").click(function () {
            var $parentWrp = $(this).closest(".jh-gallery-box");
            var imgId = $parentWrp.find("img").attr("data-id");

            if ($parentWrp.hasClass("jh-isCover")) {
                alert("请先设置一张图片为封面。");
            } else {
                $.ajax({
                    "url": "../data/staffView/json/tuku/delPic.json",
                    "data": {
                        imgId: imgId
                    },
                    "type": "post",
                    "success": function (data) {
                        if (data.success === "1") {
                            $parentWrp.remove();
                        } else if (data.success === "0") {
                            alert("删除不成功，请重新操作。");
                        }
                    }
                });
            }

        })
    }

    //点击设置封面操作
    function coverPic() {
        $(".jh-gallery-cover-icon").click(function () {
            var $parentWrp = $(this).closest(".jh-gallery-box");
            var imgId = $parentWrp.find("img").attr("data-id");
            $.ajax({
                "url": "../data/staffView/json/tuku/coverPic.json",
                "data": {
                    imgId: imgId
                },
                "type": "post",
                "success": function (data) {
                    if (data.success === "1") {
                        $parentWrp.addClass("jh-isCover");
                        $parentWrp.siblings().removeClass("jh-isCover");
                    } else if (data.success === "0") {
                        alert("删除不成功，请重新操作。");
                    }
                }
            });
        })
    }

    //点击编辑修改图片标题操作
    function editPicTitle() {
        $(".jh-gallery-edit-icon").click(function () {
//            var $parentWrp = $(this).closest(".jh-gallery-box");
//            var imgSrc = $parentWrp.find("img").attr("src");
            $(this).prev("input").attr("readonly", false).addClass("jh-editing").trigger("select");

        })
    }


    //提交图片修改后的标题
    function submitTitle() {
        //修复IE9readOnly的bug
        $(".jh-gallery-title-text input").click(function () {
            var readonly = $(this).attr("readonly");
            if (readonly === "readonly") {
                return false;
            }
        });

        $(".jh-gallery-title-text input").change(function () {
            var $parentWrp = $(this).closest(".jh-gallery-box");
            var imgId = $parentWrp.find("img").attr("data-id");
            var imgTitle = $(this).val();

            $(this).attr("readonly", true).removeClass("jh-editing");

            $.ajax({
                "url": "../data/staffView/json/tuku/editTitle.json",
                "data": {
                    imgId: imgId,
                    imgTitle: imgTitle
                },
                "type": "post",
                "success": function (data) {
                    if (data.success === "1") {
                        alert("修改成功");
                    } else if (data.success === "0") {
                        alert("修改不成功，请重新操作。");
                    }
                }
            });
        });

        $(".jh-gallery-title-text input").keydown(function (e) {
            var $this = $(this);
            if (e.keyCode === 13) {
                $this.trigger("blur");
            }
        })
    }


    //js本地图片预览，兼容ie[6-9]、火狐、Chrome17+、Opera11+、Maxthon3
    function PreviewImage(fileObj, imgPreviewId, divPreviewId, imgPreviewDiv, callBack) {

        var allowExtention = ".jpg,.jpeg,.bmp,.gif,.png"; //允许上传文件的后缀名document.getElementById("hfAllowPicSuffix").value;
        var extention = fileObj.value.substring(fileObj.value.lastIndexOf(".") + 1).toLowerCase();
        var browserVersion = window.navigator.userAgent.toUpperCase();
        if (allowExtention.indexOf(extention) > -1) {

            $(".jh-gallery-gallerys").append(imgPreviewDiv);

            if (fileObj.files) {//HTML5实现预览，兼容chrome、火狐7+等
                if (window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        document.getElementById(imgPreviewId).setAttribute("src", e.target.result);
                    };
                    reader.readAsDataURL(fileObj.files[0]);
                } else if (browserVersion.indexOf("SAFARI") > -1) {
                    alert("不支持Safari6.0以下浏览器的图片预览!");
                }
            } else if (browserVersion.indexOf("MSIE") > -1) {
                if (browserVersion.indexOf("MSIE 6") > -1) {//ie6
                    document.getElementById(imgPreviewId).setAttribute("src", fileObj.value);
                } else {//ie[7-9]
                    fileObj.select();
                    if (browserVersion.indexOf("MSIE 9") > -1)
                        fileObj.blur(); //不加上document.selection.createRange().text在ie9会拒绝访问
                    var newPreview = document.getElementById(divPreviewId + "New");
                    if (newPreview == null) {
                        newPreview = document.createElement("div");
                        newPreview.setAttribute("id", divPreviewId + "New");
                        newPreview.style.width = document.getElementById(imgPreviewId).width + "px";
                        newPreview.style.height = document.getElementById(imgPreviewId).height + "px";
                        newPreview.style.border = "solid 1px #d2e2e2";

                    }
                    newPreview.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='" + document.selection.createRange().text + "')";
                    var tempDivPreview = document.getElementById(divPreviewId);
                    tempDivPreview.parentNode.insertBefore(newPreview, tempDivPreview);
                    tempDivPreview.style.display = "none";
                }
            } else if (browserVersion.indexOf("FIREFOX") > -1) {//firefox
                var firefoxVersion = parseFloat(browserVersion.toLowerCase().match(/firefox\/([\d.]+)/)[1]);
                if (firefoxVersion < 7) {//firefox7以下版本
                    document.getElementById(imgPreviewId).setAttribute("src", fileObj.files[0].getAsDataURL());
                } else {//firefox7.0+
                    document.getElementById(imgPreviewId).setAttribute("src", window.URL.createObjectURL(fileObj.files[0]));
                }
            } else {
                document.getElementById(imgPreviewId).setAttribute("src", fileObj.value);
            }

            callBack();

        } else {
            alert("仅支持" + allowExtention + "为后缀名的文件!");
            //fileObj.value = ""; //清空选中文件
            //if (browserVersion.indexOf("MSIE") > -1) {
            //    fileObj.select();
            //    document.selection.clear();
            //}
            //fileObj.outerHTML = fileObj.outerHTML;
        }
        return fileObj.value;    //返回路径
    }


    var uploadProcessTimer;

    //定义上传进度函数
    function getFileUploadProcess(objId) {
        $.ajax({
            type: "GET",
            url: "../data/staffView/json/tuku/progress.json",
            data: {},
            cache: false,
            success: function (data) {
                if (data.progress === "100%") {
                    $(objId).css({
                        "width": data.progress
                    });
                    $(objId).closest(".jh-gallery-box-loading").removeClass("jh-gallery-box-loading");
                    setTimeout(function () {
                        $(objId).parent().hide();
                    }, 500);
                    clearInterval(uploadProcessTimer);
                    //删除图片
                    delPic();
                    //点击设置封面操作
                    coverPic();
                    //编辑图片标题操作
                    editPicTitle();
                    //提交图片修改后的标题
                    submitTitle();
                } else {
                    $(objId).css({
                        "width": data.progress
                    })
                }
            }
        });
    }

    //点击进行图片上传
    function uploadImg() {

        $("#jh-gallery-upload-file").change(function () {
            var $this = $(this);
//            var imgName = this.files[0].name;
            var imgNameTemp = $this.val().split("\\");
            var imgName = imgNameTemp[imgNameTemp.length - 1];
            var imgLength = $(".jh-gallery-gallerys .jh-gallery-box").length;
            var divId = imgLength;
            var groupId = $(".jh-gallery-header li.active").attr("group-id");
            var imgPreviewDiv = '<div class="jh-gallery-box">'
                + '<div class="jh-gallery-box-subwrp jh-gallery-box-loading">'
                + '<i class="jh-gallery-cover-icon"></i>'
                + '<i class="jh-gallery-edit-remove-icon"></i>'
                + '<div id="divPreview-' + divId + '">'
                + '<img src="" alt="" id="imgHeadPhoto-' + divId + '">'
                + '</div>'
                + '<div class="jh-gallery-title-text">'
                + '<div><input type="text" readonly="readonly" title="' + imgName + '" value="' + imgName + '"><i class="jh-gallery-edit-icon"></i></div>'
                + '<div class="jh-gallery-progress-bar">'
                + '<div class="jh-gallery-progress" id="progress-' + divId + '"></div>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';


            //上传图片预览成功后调用函数
            var callBack = function () {
                var options = {
                    url: '../data/staffView/json/tuku/jibenxinxi',
                    data: {
                        imgName: imgName,
                        groupId: groupId
                    },
                    beforeSubmit: showRequest,  //提交前处理
                    success: showResponse,  //处理完成
                    resetForm: true
                };

                //上传图片之前执行的操作
                function showRequest(responseText, statusText) {
                    uploadProcessTimer = setInterval(function () {
                        getFileUploadProcess('#progress-' + divId);
                    }, 100);//每隔100毫秒执行callback
                }

                //上传图片成功之后，服务器返回的数据
                function showResponse(responseText, statusText) {
                    console.log(responseText, statusText);
                }

                $this.parent().ajaxSubmit(options);
            };

            //调用上传图片预览函数
            PreviewImage(this, 'imgHeadPhoto-' + divId, 'divPreview-' + divId, imgPreviewDiv, callBack);
        })
    }

    uploadImg();
//    悬浮出现设置封面、删除、编辑等按钮
    $(document).off("mouseenter");
    $(document).off("mouseleave");
    $(document).on("mouseenter",".jh-gallery-box-subwrp",function(){
        if(!$(this).hasClass("jh-gallery-box-loading")){
            $(this).find(".jh-gallery-cover-icon").show();
            $(this).find(".jh-gallery-edit-remove-icon").show();
            $(this).find(".jh-gallery-edit-icon").show();
        }

    }).on("mouseleave",".jh-gallery-box-subwrp",function(){
        if(!$(this).parent().hasClass("jh-isCover")){
           $(this).find(".jh-gallery-cover-icon").hide();
        }

        $(this).find(".jh-gallery-edit-remove-icon").hide();
        $(this).find(".jh-gallery-edit-icon").hide();
    })
});
