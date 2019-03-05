
export function uploadImg(obj1,id2,limitsize,callback,num) {

    var obj2=document.getElementById(id2);
    obj2.click();
    if(!limitsize){
        limitsize=200;
    }
    if (typeof FileReader === 'undefined') {
        alert("浏览器版本过低，请先更新您的浏览器~");
        obj2.setAttribute('disabled', 'disabled');
    } else {
        //模拟单例模式，不能删除
        if(!obj1.eventArr || obj1.eventArr.length<=0){
            obj1.eventArr = [];
            obj1.eventArr.push('change');
            obj2.addEventListener('change', function () {
                var file = this.files[0] || this.file;
                if (!/image\/\w+/.test(file.type)) {
                    alert("请上传一张图片~");
                    return false;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function() {
                    var result=this.result;
                    var img = new Image();
                    if (result.length <= limitsize*1024) {
                        obj1.src=result;
                        obj1.setAttribute('haveBase64',1)
                        if(callback&&num){
                            callback(result,num)
                        }
                        return;
                    }
                    img.src = result;
                    img.onload = function() {
                        var compressedDataUrl = compress(img, file.type);
                        obj1.src=compressedDataUrl;
                        obj1.setAttribute('haveBase64',1)
                        if(callback&&num){
                            callback(compressedDataUrl,num)
                        }
                        img = null;
                    };
                };
                // layer.open({
                //     type: 2
                //     ,content: '上传中请耐心等待.....',
                //     shadeClose:false,
                // });
            }, false);
        }
    }
    // setTimeout(function(){
    //     layer.closeAll();
    // },60000);
}
//压缩的过程
export function compress(img, fileType) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');

    var width = img.width;
    var height = img.height;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);

    // 压缩
    var base64data = canvas.toDataURL(fileType, 0.75);
    canvas = ctx = null;

    return base64data;
}

export function getObjectURL(file) {  
    var url = null;  
    if (window.createObjcectURL != undefined) {  
        url = window.createOjcectURL(file);  
    } else if (window.URL != undefined) {  
        url = window.URL.createObjectURL(file);  
    } else if (window.webkitURL != undefined) {  
        url = window.webkitURL.createObjectURL(file);  
    }  
    return url;  
   }

