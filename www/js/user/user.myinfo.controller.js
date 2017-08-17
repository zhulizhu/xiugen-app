/**
 * Created by Garuda on 2017/1/18 0018.
 */
(function() {
    'use strict';
    angular.module('user.myinfo.controller', [])
        .controller('Person',Person);
    Person.$inject=["$scope","$yikeUtils","$state","$ionicActionSheet","$cordovaCamera","$ionicPopup"];
    function Person($scope, $yikeUtils, $state,$ionicActionSheet,$cordovaCamera,$ionicPopup) {
        $scope.person={
            name:''
        }
        var image = '';
        $scope.submit=submit;
        function init() {
            //console.log(navigator);
        }
        init();
        $scope.$on('$ionicView.beforeEnter',function() {
            getMyInfo();
        });
        function getMyInfo() {
             yikeShop.query('/user/get_my_info')
                    .then(function (data) {
                        $scope.info = data.data;
                        $scope.$digest();
                    }).catch(function(data){
                        $yikeUtils.toast('请先登录');
                        $state.go('login');
                    })
        }

        function submit() {
            (function title(){
                // var id=id;
                var confirmPopup = $ionicPopup.confirm({
                    title: '你确定要退出登录?',
                    template: '',
                    cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                    cancelType:'button-default', // String (默认: 'button-default')。取消按钮的类型。
                    okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                    okType: 'button-energized',
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        TOKEN='';
                        localStorage.setItem('TOKEN', JSON.stringify(TOKEN));
                        $state.go('login');
                    } else {
                        return;
                    }
                });
            })();
        }

        $scope.selectImg = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [{text: '相册'}, {
                    text: '拍照'
                }
                ],
                titleText: '选择图片',
                cancelText: '取消',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    //console.log(index);
                    if(index==0){
                        if(!navigator.camera) {
                            $('#file').click();
                            var parent, imgLength;
                            document.getElementById('file').onchange = function (event) {
                                imgLength = event.target.files.length;
                                //console.log(imgLength);
                                for (var i = 0; i < imgLength; ++i) {
                                    var index = i;
                                    var reader = new FileReader();
                                    reader.readAsDataURL(event.target.files[index]);
                                    reader.onload = function (evt) {
                                        image = evt.target.result;
                                        //console.log(image);
                                        uploadImage(image);
                                    }
                                }
                            }
                        }else{
                            selectPhoto();
                        }
                        hideSheet();
                        return false;
                    }else if(index==1){
                        if(!navigator.camera){
                            $yikeUtils.toast('模块初始化失败');
                            hideSheet();
                            return false;
                        }
                        takePhoto();
                        hideSheet();
                    }
                }});};

        //插件本地上传
        var selectPhoto=function(){
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 200,
                targetHeight: 200,
                mediaType: 0,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var images ="data:image/png;base64,"+imageData;
                uploadImage(images);
            }, function (err) {
                $yikeUtils.toast('取消');

            });
        }

        //拍照上传
        var takePhoto = function () {
            var options = {
                //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
                quality: 50,                                            //相片质量0-100
                destinationType: Camera.DestinationType.DATA_URL,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                allowEdit: true,                                        //在选择之前允许修改截图
                encodingType: Camera.EncodingType.PNG,                   //保存的图片格式： JPEG = 0, PNG = 1
                targetWidth: 200,                                        //照片宽度
                targetHeight: 200,                                       //照片高度
                mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true                                   //保存进手机相册
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                // CommonJs.AlertPopup(imageData);
                //var image = document.getElementById('image');
                //image.src = "data:image/png;base64,"+imageData;
                var images ="data:image/png;base64,"+imageData;
                uploadImage(images);
            }, function (err) {
                $yikeUtils.toast('取消');

            });

        }

        function uploadImage(image){
            yikeShop.query('/user/change_pic',{token:TOKEN,image:image})
                .then(function(data){
                    $yikeUtils.toast('修改成功');
                    document.getElementById('image').src = image;
                })
                .catch(function(data){
                    $yikeUtils.toast('头像获取失败!');
                })
        }

        //删除提示
        $scope.titleTip=function(temp){
            // var id=id;
            var confirmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: temp,
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType:'button-energized', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: 'button-default',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    alert(temp);
                } else {
                    return;
                }
            });
        }

       /* //头像上传
        $scope.addAttachment = function() {
            $scope.hideSheet=$ionicActionSheet.show({
                buttons: [
                    { text: '相册' },
                    { text: '照相机' }
                ],
                cancelText: '取消',
                cssClass:'sheet-style',
                cancel: function() {
                    return true;
                },
                buttonClicked: function(index) {
                    if(index == 0){
                        pickImage();
                    }else {
                        photoUpload();
                    }
                }
            });
        };
        //上传头像
        function pickImage() {
            var options = {
                maximumImagesCount: 1,
                width: 200,
                height: 200,
                quality: 80
            };
            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    if(results.length > 0){
                        $scope.images = results[0];
                        uploadImg(results[0]);
                    }
                }, function (error) {
                    // error getting photos
                    // $yikeUtils.toast('上传失败')
                });
        }
        //拍照上传
        function photoUpload() {
            navigator.camera.getPicture(onPSuccess, onFail, { quality: 50,
                destinationType: Camera.DestinationType.FILE_URI, targetWidth:200,targetHeight:200});

            function onPSuccess(imageURI) {
                $scope.images=imageURI;
                uploadImg(imageURI);
            }

            function onFail(message) {
                // $yikeUtils.toast('Failed because: ' + message);
            }
        }
        //上传服务器
        function uploadImg(img) {
            var fileURL = img;
            //var url = encodeURI("http://shop.yike1908.com/app/index.php?i=2&c=entry&do=information&m=yike_errands&op=avatar");
            var url = encodeURI("http://shop.yike1908.com/mobile/user/change_pic?token="+TOKEN);
            var option = new FileUploadOptions();
            option.fileKey = "image";
            option.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            option.mimeType = "image/jpeg/png";
            var params = {};
            params.uid =id;
            option.params = params;
            var ft = new FileTransfer();
            ft.upload(fileURL, url, onSuccess, onError, option);
            function onSuccess(r) {
                console.log(r);
                $yikeUtils.toast('上传成功');
            }
            //图片上传失败回
            function onError(error) {
                $yikeUtils.toast("错误发生了，请重试 = " + error.code);
                // console.log("upload error source " + error.source);
                // console.log("upload error target " + error.target);
            }
        }*/
    }
})();