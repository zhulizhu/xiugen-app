/**
 * Created by john on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('account.controller', [])
        .controller('AccountCtrl', AccountCtrl);
    /* @ngInject */
    AccountCtrl.$inject=["$scope","$yikeUtils","$state","$ionicViewSwitcher"];
    function AccountCtrl($scope, $yikeUtils, $state, $ionicViewSwitcher) {
        $scope.loginOut=loginOut;
        $scope.stateGo=stateGo;
        $scope.stateGoId=stateGoId;
        init();
        function init() {
            getMyInfo();
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            getMyInfo();
            //$scope.doRefresh();
        });

        function getMyInfo() {
            yikeShop.query('/user/get_my_info')
                .then(function (data) {
                    $scope.data = data.data;
                    USER = data.data;
                    $scope.$digest();
                }).catch(function(data){
                })
        }

        //退转页面
        function  stateGo(ui){
            $state.go(ui);
            $ionicViewSwitcher.nextDirection('forward');
        }

        //参数退转
        function  stateGoId(ui,id){
            $state.go(ui,id);
            $ionicViewSwitcher.nextDirection('forward');
        }

        //退出登录
        function  loginOut(){
            $yikeUtils.toast('退出成功');
            TOKEN="";
            localStorage.setItem('TOKEN', JSON.stringify(TOKEN));
            $state.go('login');
        }
    }
})();