/**
 * Created by frank on 2016/9/6.
 */
(function () {
        'use strict';

        angular
            .module('user.login.controller', [])
            .controller('UserLoginCtrl', UserLoginCtrl);

        UserLoginCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', '$ionicLoading', '$rootScope'];
        /* @ngInject */
        function UserLoginCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, $ionicLoading) {
            $scope.user = {
                username: '',
                password: '',
            };
            $scope.login = login;
            var myReg=/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            //var pwdReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
            init();
            function init() {
            }
            function login() {
                if(!myReg.test($scope.user.username)){
                    $yikeUtils.toast('请输入正确手机号');
                    return false;
                }else if($scope.user.password==''||$scope.user.password.length<6){
                   // toast('密码长度6位到16位，至少包含数字字母');
                    $yikeUtils.toast('密码长度至少6位');
                    return false;
                }
                //console.log($scope.user.username,$scope.user.password);
                yikeShop.query('/login/loginn',{phone:$scope.user.username,password:$scope.user.password})
                    .then(function (data) {
                        //console.log(data);
                        $yikeUtils.toast(data.msg);
                        localStorage.setItem('TOKEN', data.data);
                        TOKEN = data.data;
                        $state.go('tab.home');
                    }).catch(function(data){
                       $yikeUtils.toast(data.msg);
                    });
            }
        }
    })();