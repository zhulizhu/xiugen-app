/**
 * Created by Garuda on 2017/1/4 0004.
 */
(function () {
    'use strict';
    angular
        .module('user.mypackage.controller', [])
        .controller('MyPackageCtrl', MyPackageCtrl);

    /* @ngInject */
    MyPackageCtrl.$inject=["$scope","$yikeUtils","$state","$ionicLoading"];
    function MyPackageCtrl($scope, $yikeUtils, $state, $ionicLoading) {
        init();
        function  init(){
            $ionicLoading.show();
        }

        $scope.$on('$ionicView.afterEnter',function(){
            getMeal();
        });

        //获取套餐定制
        function getMeal(){
            yikeShop.query('/order/Package',{token:TOKEN})
                .then(function(data){
                    console.log(data);
                    $scope.detail=data.data[0];
                    $scope.packageList = data.data;
                    $ionicLoading.hide();
                    //console.log($scope.packageList);
                })
                .catch(function(data){
                    $yikeUtils.toast(data.msg);
                    $ionicLoading.hide()
                });
        }
    }
})();