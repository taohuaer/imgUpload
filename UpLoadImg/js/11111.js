 function upLoadImg(obj) {
     var $ele = $(obj.ele).find('#preview');
     var $imgInput = $ele.next('input[type=file]');
     $(document).on("change", ".picBox input[type=file]", function() {
         previewImage($(this)[0], $(this).parents(".picBox").find("#preview")[0]);
         $(this).parents(".picBox").find(".upload-tip").removeClass("hide");
         $(this).parents(".picBox").find(".upload-tip").find(".uploading").removeClass("hide")
         $(this).parents(".picBox").find(".upload-tip").find(".close").removeClass("hide")
         $(this).parents(".picBox").find(".upload-msg").addClass("hide")
         $("#FormImg").append($(this).clone())
             // 点击上传
         $('.uploading').click(function() {
                 var $self = $(this);
                 $("#FormImg").ajaxSubmit({
                     url: obj.url,
                     type: 'POST',
                     dataType: 'json',
                     success: function(data) {
                         if (data.status === "ok") {
                             $imgInput.insertAfter($ele);
                             $self.parents(".picBox").find(".upload-msg").removeClass("hide");
                             $self.parents(".picBox").find(".upload-msg").find("div").html("上传成功");

                         } else {
                             $imgInput.insertAfter($ele);
                             $self.parents(".picBox").find(".upload-msg").removeClass("hide");
                             $self.parents(".picBox").find(".upload-msg").find("div").html("上传失败");
                         }

                     },
                     error: function(err) {
                         $self.parents(".picBox").find(".upload-msg").removeClass("hide");
                         $self.parents(".picBox").find(".upload-msg").find("div").html("上传失败,请重新上传");
                     }
                 });

             })
             // 点击删除
         $(".close").click(function() {
             console.log($(".preview").find("img"))
             console.log("ss")
             var $imginput = $(this).parents(".picBox").find("input")
             var $picBox = $(this).parents(".picBox")
             $("#FormImg").find("input").remove()
             $("#preview").find("img").attr("src", "./images/imgUserZhanwei.png");

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

         })
     })

 }


 upLoadImg({
     ele: ".picBox",
     url: 'http://localhost:3456/uploadimg'
 })

 function previewImage(file, div) {
     var MAXWIDTH = 260;
     var MAXHEIGHT = 180;
     //var div = document.getElementById('preview');
     //  console.log(div)

     // 验证图片格式
     var fileTypes = [".png"];
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
             alert("格式不对，请重新上传")
                 // div.parents(".picBox").find(".upload-msg").removeClass("hide")
                 // div.parents(".picBox").find(".upload-msg").find("div").html("图片格式不对")
             file.value = "";
             return false;
         }
     }
     // 验证图片大小
     var fileSize = 0;
     var fileMaxSize = 1024;
     if (filePath) {
         fileSize.file.file[0].size;
         var size = fileSize / 1024;
         if (size > fileMaxSize) {
             alert("文件不能大于1M")
             file.value = "";
             return false;
         } else if (size <= 0) {
             alert("文件不能为0")
             file.value = "";
             return false;
         }
     } else {
         return false;
     }
     // 验证尺寸
     if (filePath) {
         var filePic = file.files[0];
         var render = new FileReader();
         render.onload = function(e) {
             //   加载图片获取图片真实宽度和高度
             var image = new Image();
             image.onload = function() {
                 var width = image.width;
                 var height = image.height;
                 if (width == 720 | height == 1280) {
                     alert("no")
                 } else {
                     alert("文件尺寸应为：720*1280！");
                     file.value = "";
                     return false;
                 }
             }
             image.src = data;
         }
         render.readAsDataURL(filePic)
     } else {
         return false;
     }

     if (file.files && file.files[0]) {
         div.innerHTML = '<img id=imghead>';
         var img = document.getElementById('imghead');
         img.onload = function() {
             var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
             img.width = rect.width;
             img.height = rect.height;
             img.style.marginTop = rect.top + 'px';
         }
         var reader = new FileReader();
         reader.onload = function(event) {
             var e = event || window.event
             img.src = e.target.result;
         }
         reader.readAsDataURL(file.files[0]);
     } else //兼容IE
     {
         var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
         file.select();
         var src = document.selection.createRange().text;
         div.innerHTML = '<img id=imghead>';
         var img = document.getElementById('imghead');
         img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
         var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
         status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
         div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>";
     }
 }

 function clacImgZoomParam(maxWidth, maxHeight, width, height) {
     var param = {
         top: 0,
         left: 0,
         width: width,
         height: height
     };
     if (width > maxWidth || height > maxHeight) {
         rateWidth = width / maxWidth;
         rateHeight = height / maxHeight;

         if (rateWidth > rateHeight) {
             param.width = maxWidth;
             param.height = Math.round(height / rateWidth);
         } else {
             param.width = Math.round(width / rateHeight);
             param.height = maxHeight;
         }
     }
     param.left = Math.round((maxWidth - param.width) / 2);
     param.top = Math.round((maxHeight - param.height) / 2);
     return param;
 }