/**
 * Created by frank on 2016/9/5.
 */
(function () {
    'use strict';

    angular
        .module('user.register.controller', [])
        .controller('UserRegisterCtrl', UserRegisterCtrl);

    UserRegisterCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','$ionicLoading'];
    /* @ngInject */
    function UserRegisterCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,$ionicLoading){
        $scope.user={
            phone:'',
            phoneTwo:'',
            password:'',
            code2:'',
            code:''
        };
        $scope.register=register;
        $scope.sendMsg=sendMsg;
        $scope.focus=focus;
        $scope.blur=blur;
        var flag=true;
        init();
        var countdown;
        function init() {
        }
        //发送短信验证码
        function sendMsg() {
            if (!ShopPublic.formData($scope.user.phone)) {
                    return false;
             }
            else if(flag==true) {
                flag=false;
                var sendMsg = document.body.querySelector('.send-msg');
                 countdown = 60;
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
        //注册
        function register(){
             if(!ShopPublic.formData($scope.user.phone,$scope.user.code,$scope.user.code2,2,$scope.user.password,$scope.user.phoneTwo)){
                 return false;
             }
             yikeShop.query('/login/register',{phone:$scope.user.phone,password:$scope.user.password})
                 .then(function (data) {
                        console.log(data);
                        $yikeUtils.toast(data.msg);
                        if( data.code ==1 ){
                            $state.go('login');
                        }
                    })
                 .catch(function(data){
                     $yikeUtils.toast(data.msg);
                 });
        }
    }
})();