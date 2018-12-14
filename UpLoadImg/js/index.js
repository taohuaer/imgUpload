(function($, undefined) {
    $.ImgUploadObject = function(options, element) {
        this.$el = $(element);
        this._init(options)
    };
    $.ImgUploadObject.defaults = {
        url: "http://localhost:3456/uploadimg",
        imgType: [".png"],
        autoUpload: false,
        preUpload: function(index) {
            // 上传前操作
        }


    };
    $.ImgUploadObject.prototype = {
        _init: function(options) {
            var obj = $.extend(true, {}, $.ImgUploadObject.defaults, options);
            var $ele = this.$el;
            var $url = obj.url;
            var $imgType = obj.imgType;
            var $autoUpload = obj.autoUpload;
            var $previewBox = $ele.find("#preview");
            var $imgInput = $ele.find('#inputImg');
            $(document).on("change", $imgInput, function() {
                    $ele.find(".upload-tip").addClass("hide")
                    $ele.find(".upload-msg").addClass("hide")
                        //图片本地预览
                    previewImage($imgInput, $previewBox, $imgType);

                    //  change后插入input
                    $("#FormImg").append($imgInput);

                    //     console.log($("#FormImg").find("input")[0].files)
                    console.log($imgInput[0].files)


                    // 上传前删除之前那得图片
                    obj.preUpload ? obj.preUpload($imgInput) : "";
                    // 是否自动上传图片
                    if ($autoUpload) {

                        ImgSubmit();

                        $ele.find(".upload-tip").find(".uploading").addClass("hide");
                    } else {
                        $ele.find(".upload-tip").find(".uploading").removeClass("hide");
                        $ele.find(".uploading").click(function() {
                            ImgSubmit();
                            //    console.log($("#FormImg").find("input")[0].files)
                        })
                    }
                    //    删除图片
                    $ele.find(".close").click(function() {
                        var $imginput = $(this).parents(".picBox").find("input");
                        var $picBox = $(this).parents(".picBox");
                        $("#FormImg").find("input").remove()
                            // $picBox.find("#preview").find("img").attr("src", "./images/imgUserZhanwei.png");
                        $picBox.find("#preview").html('<img src="./images/imgUserZhanwei.png">')
                        $picBox.find("#preview").find("img").attr("width", "260px");
                        $picBox.find("#preview").find("img").attr("height", "190px");
                        $picBox.find(".upload-tip").addClass("hide");
                        $picBox.find(".upload-tip").find(".uploading").addClass("hide")
                        $picBox.find(".upload-tip").find(".close").addClass("hide")
                            //  此处是解决上传图片点击删除后再上传同张图片会预览不了的问题
                        $('body').append('<form id="reset-form" name="reset-form" method="POST"  enctype="multipart/form-data"></form>');
                        $('#reset-form').append($imginput);
                        $('#reset-form')[0].reset();
                        $imginput.prependTo($picBox);
                        $picBox.find(".upload-msg").addClass("hide")
                        $('#reset-form').remove();
                        // 删除的话此处还是要做ie9特殊处理，upload上传有个弹窗也是有问题的！！！！！！




                    })
                })
                // 上传图片函数
            function ImgSubmit() {

                $("#FormImg").ajaxSubmit({
                    url: $url,
                    type: 'POST',
                    //   dataType: 'json',
                    success: function(data) {
                        console.log(data)
                        console.log(data.txt)
                        console.log(data.txt === "ok")

                        if (data.txt === "ok") {
                            $imgInput.insertAfter($previewBox);
                            $ele.find(".upload-msg").removeClass("hide");
                            $ele.find(".upload-msg").find("div").html("上传成功");

                        } else {
                            $imgInput.insertAfter($previewBox);
                            $ele.find(".upload-msg").removeClass("hide");
                            $ele.find(".upload-msg").find("div").html("上传失败");
                        }

                    },
                    error: function(err) {
                        console.log(err + "dhfgkjfhd")
                        $ele.find(".upload-msg").removeClass("hide");
                        $ele.find(".upload-msg").find("div").html("上传失败,请重新上传");
                    }
                });
            }

            function previewImage(fileEle, previewBox, imgType) {
                var file = fileEle[0];
                // 图片类型判断
                var fileTypes = imgType;
                var filePath = file.value;
                if (filePath) {
                    var isNext = false;
                    var fileEnd = filePath.substring(filePath.indexOf("."));
                    for (var i = 0; i < fileTypes.length; i++) {
                        if (fileTypes[i] == fileEnd) {
                            isNext = true;
                            break;
                        }
                    }
                    if (!isNext) {
                        previewBox.parents(".picBox").find(".upload-msg").removeClass("hide")
                        previewBox.parents(".picBox").find(".upload-msg").find("div").html("图片格式不对,请重新上传");
                        previewBox.parents(".picBox").find("upload-tip").addClass("hide")
                        file.value = "";
                        return false;
                    } else {
                        previewBox.parents(".picBox").find(".upload-tip").removeClass("hide");
                        previewBox.parents(".picBox").find(".upload-tip").find(".uploading").removeClass("hide");
                        previewBox.parents(".picBox").find(".upload-tip").find(".close").removeClass("hide");
                    }
                }
                if (file.files && file.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        var e = event || window.event
                        previewBox.html('<img id="imghead" name="imghead" width="100%" height="auto" border="0" src="' + e.target.result + '">')
                    }
                    reader.readAsDataURL(file.files[0]);
                } else {
                    //兼容IE6~9
                    previewBox.html('<div id="divhead" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + "'\"></div>");
                }


            }

        }

    };
    $.fn.imgUpload = function(options) {
        this.each(function() {
            var instance = $.data(this, "imgUpload");
            if (!instance) {
                $.data(this, "imgUpload", new $.ImgUploadObject(options, this))
            }
        });
        return this;
    }
})(jQuery);