(function(){
  angular.module('refund-reason',[])
  .controller('SubmitRefundReason',SubmitRefundReason)

  SubmitRefundReason.$inject=["$scope","$state","$yikeUtils","$ionicActionSheet","$ionicPopup","$compile","$cordovaImagePicker"];
  function SubmitRefundReason($scope,$state,$yikeUtils,$ionicActionSheet,$ionicPopup,$compile,$cordovaImagePicker){
    var id= $state.params.id;
    var gid=$state.params.status;
    var image = '';
    var fileImg=[];
    var count=0;
    var flag=true;
    $scope.cont={
      text:''
    }
    $scope.sub=sub;
    init();
    function  init(){
        getShop();
    }

    //获取商品
     function  getShop(){
         yikeShop.query('/order/ajax_order_list', {status:2, page:0})
             .then(function (data) {
               $scope.orders = data.data.list;
              for(var k in $scope.orders){
                 if(id==$scope.orders[k].order_id){
                   var orders=$scope.orders[k];
                   for(var x in orders.goods){
                     if(gid==orders.goods[x].goods_id){
                       $scope.Shop=orders.goods[x];
                       return;
                     }
                   }
                 }
               }
               $scope.$digest();
             }).catch(function(data){
                //console.log(data);
             })
     }

    //删除提示
    $scope.select=function(e){
      var confirmPopup = $ionicPopup.confirm({
        title: '温馨提示',
        template: '确定删除图片？',
        cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
        cancelType:'button-default', // String (默认: 'button-default')。取消按钮的类型。
        okText: '确认', // String (默认: 'OK')。OK按钮的文字。
        okType: 'button-energized',
      });
      confirmPopup.then(function (res) {
        if (res) {
          var parent=e.target.parentNode;
          $(parent).remove();
          count--;
        } else {
          return;
        }
      });
    }

    //选择相片
    $scope.selectImg = function() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: '相册'
        }, {
          text: '拍照'
        }
        ],
        titleText: '选择图片',
        cancelText: '取消',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          if(index==0){
            if(!navigator.camera){
              $('#file').click();
              var imgLength;
              document.getElementById('file').onchange=function(event){
                imgLength=event.target.files.length;
                count+=imgLength;
                if(count>3){
                  $yikeUtils.toast('不能多余三张');
                  return false;
                }
                for(var i=0;i<imgLength;++i) {
                  var index=i;var reader = new FileReader();var result,content;
                  reader.readAsDataURL(event.target.files[index]);
                  reader.onload = function (evt) {
                    image = evt.target.result;
                    result='<li><img src="'+image+'" alt="" class="myFileImg"><a href="javascript:;" ng-click="select($event)">x</a></li>';
                    content=$compile(result)($scope);
                    $('#myUlPic').append(content);
                  }
                }
              };
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
          }

        }});};


    //插件本地上传
    var selectPhoto=function(){
      if(count>=3){
        $yikeUtils.toast('不能多余三张');
        return false;
      }else {
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
          var image, result, content;
          image = "data:image/png;base64," + imageData;
          result = '<li><img src="' + image + '" alt="" class="myFileImg"><a href="javascript:;" ng-click="select($event)">x</a></li>';
          content = $compile(result)($scope);
          $('#myUlPic').append(content);
          count++;
        }, function (err) {
          $yikeUtils.toast('取消');

        });
      }
    }

       //拍照上传
       function  takePhoto(){
         if(count>=3){
           $yikeUtils.toast('不能多余三张');
           return false;
         }else {
           navigator.camera.getPicture(onPSuccess, onFail, {
             quality: 50,
             destinationType: Camera.DestinationType.DATA_URL,
             encodingType: Camera.EncodingType.PNG,
             allowEdit: true,
             targetWidth: 200,
             targetHeight: 200,
           });
           function onPSuccess(imageURI) {
             var image, result, content;
             image = "data:image/png;base64," + imageURI;
             result = '<li><img src="' + image + '" alt="" class="myFileImg"><a href="javascript:;" ng-click="select($event)">x</a></li>';
             content = $compile(result)($scope);
             $('#myUlPic').append(content);
             count++;
           }

           function onFail(message) {
             $yikeUtils.toast('初始化模块失败' + message);
           }
         }
       }

       //遍历相片
       function eachImg(){
         fileImg=[];
         var index = $('.myFileImg').length;
         for (var i = 0; i < index; ++i) {
           fileImg.push($('.myFileImg')[i].src);
         }
       }

      //提交表单
      function sub(){
         eachImg();
        if($scope.cont.text==""){
          $yikeUtils.toast('请输入理由');
          return false;
        }
        if(flag==true){
          flag=false;
          yikeShop.query('/order/apply_refund',{token:TOKEN,oid:id,goods_id:gid,rights_reason:$scope.cont.text,images:fileImg})
              .then(function(data){
                 $yikeUtils.toast(data.msg);
                 $state.go('refunds-list');
                 console.log(data);
              })
              .catch(function(data){
                  $yikeUtils.toast(data.msg);
                  flag=true;
              });
        }
      }
  }
})();