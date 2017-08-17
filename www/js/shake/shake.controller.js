/**
 * Created by NicoleQi on 2016/11/7.
 */
(function () {
    'use strict';
    angular
        .module('shake.controller', [])
        .controller('ShakeCtrl', ShakeCtrl);
    /* @ngInject */
    ShakeCtrl.$inject=["$scope","$ionicModal","$yikeUtils","$state"];
    function ShakeCtrl($scope,$ionicModal,$yikeUtils,$state){
       // $scope.ShakeDevice=ShakeDevice;
        $scope.stateGo=stateGo;
        var flag=true;
        var count='';
        var token="";
        var time;
        var index=0;
        var SHAKE_THRESHOLD = 4000;
        var last_update = 0;
        var x, y, z, last_x = 0, last_y = 0, last_z = 0;
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion',deviceMotionHandler, false);
        }
        init();
        function init() {
          template();
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            token=localStorage.getItem('TOKEN');
            if(token&&token.length>5){
                getMyInfo();
                return false;
            }else{
                $yikeUtils.toast('请先登录');
                $state.go('login');
            }
        });

        function template() {
            $ionicModal.fromTemplateUrl('templates/modal/red_bag.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            $scope.$on('modal.hidden', function () {
            });
            $scope.$on('modal.removed', function () {
            });
        }


        //随机获取红包
        function redBagFit(){
            clearTimeout(time);
            yikeShop.query('/Packet/get_packet', {token: TOKEN}).then(function (data) {
                $scope.pagek = data.data;
                if ($scope.pagek.id) {
                    $yikeUtils.toast('中奖了!');
                    savePacket(TOKEN, $scope.pagek.id);
                    var openImg = document.querySelector('.bag_bg').getElementsByTagName('img')[0];
                    openImg.className = openImg.className.replace('red_bagH','');
                } else {
                    $yikeUtils.toast('很遗憾，没摇到');
                    var openImg = document.querySelector('.bag_bg').getElementsByTagName('img')[0];
                    openImg.className = openImg.className.replace('red_bagH','');
                }
                time= setTimeout(function(){
                    flag=true;
                },2000);
                count-=1;
                $scope.count = count;
                index=0;
                $scope.$digest();
            }).catch(function (data) {
                flag=true;
                index=0;
                $yikeUtils.toast(data.msg);
            });
        }


        //获取次数
        function getMyInfo() {
            yikeShop.query('/user/get_my_info')
                .then(function (data) {
                   count = data.data.sum;
                   $scope.count=count;
                   $scope.$digest();
                }).catch(function(){
                   $state.go('login');
                })
        }

        //功能参数
        $scope.openModal=function  ShakeYao(){
            console.log(flag);
            if(flag==true) {
                flag=false;
                var openImg = document.querySelector('.bag_bg').getElementsByTagName('img')[0];
                openImg.className = 'red_bagH';
                if (count <= 0) {
                    $scope.count=0;
                    $scope.modal.show();
                    index=0;
                }else{
                    redBagFit();
                }
            }
        }

        function  savePacket(token,packet){
            yikeShop.query('/packet/save_packet',{token:token,packetId:packet})
            .then(function(data){
            }).catch(function(){
            })
        }
                //摇一摇
        function deviceMotionHandler(eventData) {
            if(flag==true) {
                var acceleration = eventData.accelerationIncludingGravity;
                var curTime = new Date().getTime();
                if ((curTime - last_update) > 10) {
                    var diffTime = curTime - last_update;
                    last_update = curTime;
                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;
                    var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
                    if (speed > SHAKE_THRESHOLD) {
                        if (index == 0) {
                            index = 1;
                            $scope.openModal();
                        }
                    }
                    last_x = x;
                    last_y = y;
                    last_z = z;
                }
            }else{
                return false;
            }
        }

        function stateGo(){
            try{
                window.removeEventListener('devicemotion',deviceMotionHandler, false);
                $state.go('tab.home');
            }catch (err){
                $state.go('tab.home');
            }
        }
    }
})();