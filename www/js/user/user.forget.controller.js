/**
 * Created by Garuda on 2016/12/30 0030.
 */
(function () {
    'use strict';

    angular
        .module('user.forget.controller', [])
        .controller('UserForgetCtrl', UserForgetCtrl);

    UserForgetCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', '$ionicLoading'];
    /* @ngInject */
    function UserForgetCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, $ionicLoading) {
        $scope.forget=forget;
        $scope.user = {
            phone: '',
            code: '',
            password: ''
        };
        $scope.sendMsg=sendMsg;
        var flag=true;
        var countdown;
        init();
        function  init(){

        }

        //发送短信验证码
        function sendMsg() {
            if(flag==true) {
                flag=false;
                var sendMsg = document.body.querySelector('.send-msg');
                countdown = 60;
                if (!ShopPublic.formData($scope.user.phone)) {
                    return false;
                }
                yikeShop.query('/login/verify', {phone: $scope.user.phone})
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $scope.user.code2 = data.data;
                        $scope.user.phoneTwo = $scope.user.phone;
                        settime(sendMsg);
                        flag=true;
                    })
                    .catch(function (data) {
                        $yikeUtils.toast(data.msg);
                        flag=true;
                    });
            }
        }
        //倒计时
        function settime(obj) {
            if (countdown == 0) {
                obj.removeAttribute("disabled");
                obj.innerHTML = "获取验证码";
                countdown = 60;
                return;
            } else {
                obj.setAttribute("disabled", true);
                obj.innerHTML = "重新发送(" + countdown + ")";
                countdown--;
            }
            setTimeout(function () {
                settime(obj)
            }, 1000)
        }
        function  forget(){
            if(!ShopPublic.formData($scope.user.phone,$scope.user.code,$scope.user.code2,2,$scope.user.password,$scope.user.phoneTwo)){
                return false;
            }
            yikeShop.query('/login/find_password',{phone:$scope.user.phone,password:$scope.user.password})
                .then(function (data) {
                    $yikeUtils.toast(data.msg);
                    $state.go('login');
                })
                .catch(function(data){
                    $yikeUtils.toast(data.msg);
                });
        }
    }
})();