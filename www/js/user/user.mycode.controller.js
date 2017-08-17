/**
 * Created by Garuda on 2017/1/4 0004.
 */
(function () {
    'use strict';

    angular
        .module('user.mycode.controller', [])
        .controller('MyCodeCtrl', MyCodeCtrl);
    /* @ngInject */
    MyCodeCtrl.$inject=["$scope","$yikeUtils","$state","$ionicModal"];
    function MyCodeCtrl($scope, $yikeUtils, $state,$ionicModal) {
        $scope.shareWeixin = shareWeixin;
        $scope.shareWeibo = shareWeibo;
        $scope.shareQQ = shareQQ;
        init();
        function  init(){
          getMyCode();
        }
        function  getMyCode(){
            yikeShop.query('/user/get_qr_code')
                .then(function(data){
                   $scope.mycode=data.data;
                    console.log($scope.mycode);
                    $scope.$digest();
                })
                .catch(function(data){
                    $yikeUtils.toast(data.data||'暂无分享');
                })
        } 
        //分享给朋友模态窗口
        $ionicModal.fromTemplateUrl('templates/modal/share.html', {
            scope: $scope,
            animation: 'slide-in-left'
        }).then(function(share) {
            $scope.sharemodal = share;
        });
        $scope.openShareModal = function() {
            $scope.sharemodal.show();
        };
        $scope.closeShareModal = function() {
            $scope.sharemodal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.sharemodal.remove();
        });
        //微博分享
         function shareWeibo(tmp){
             var shareSinaString = 'http://service.weibo.com/share/share.php?title=' + '秀根果蔬' + '&url='+"https://www.baidu.com" ;
             window.location.href = shareSinaString;
           /* try{
            YCWeibo.checkClientInstalled(function(){
                console.log('client is installed');
            },function(){
                $yikeUtils.toast('请安装微博客户端以后,再尝试此功能');
            });
            if(tmp==2){
                var args = {};
                args.title = "二维码分享";
                args.description = "秀根果蔬带给你不一样的体验,快来加入我们吧";
                args.imageUrl = $scope.mycode;
                YCWeibo.shareToWeibo(function () {
                    $yikeUtils.tosat('分享成功');
                 }, function (failReason) {
                    $yikeUtils.tosat('分享取消');
                 },args); 
            }

            }catch(error){
                $yikeUtils.toast('该功能暂未开放');
            }*/
         };
        //QQ分享
         function shareQQ(data){
            //检测是否有QQsdk的功能
            try{
            QQSDK.checkClientInstalled(function(){

            },function(){
               $yikeUtils.toast('请安装QQ客户端以后,再尝试此功能');
            })
            //分享二维码到QQ
            if(data==1){
                var args = {};
                args.scene = QQSDK.Scene.QQZone;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
                args.title = "二维码分享";
                args.description = "秀根果蔬带给你不一样的体验,快来加入我们吧";
                args.image = $scope.mycode;
                QQSDK.shareImage(function () {
                    $yikeUtils.tosat('分享成功')
                 }, function (failReason) {
                    $yikeUtils.tosat('分享取消')
                 },args); 
            }

            }catch(error){
                $yikeUtils.toast('该功能暂未开放');
            }
         }
        //微信分享
        function shareWeixin(type) {
            Wechat.isInstalled(function (installed) {
                if (!installed) {
                    $yikeUtils.toast('请安装微信以后,再尝试此功能');
                    return false;
                }
                //微信好友分享
                else if (type == '3') {
                    shareType(Wechat.Scene.SESSION);
                    return false;
                }
                //微信朋友圈分享
                else if (type == '4') {
                    shareType(Wechat.Scene.TIMELINE);
                }
            });
        }

        function shareType(type){
            Wechat.share({
                message: {
                    title: '二维码分享',
                    description: "秀根果蔬带给你不一样的体验,快来加入我们吧",
                    thumb: $scope.mycode,
                    mediaTagName: "秀根",
                    messageExt: "秀根果蔬",
                    media: {
                        type: Wechat.Type.IMAGE,
                        image: $scope.mycode
                    }
                },
                scene:type
            }, function (reason) {
                $yikeUtils.toast('分享成功');
            }, function (reason) {
                $yikeUtils.toast('分享取消');
            });
        }
    }
})();