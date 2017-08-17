/**
 * Created by Garuda on 2016/12/10 0010.
 */
(function(){
    'use strict';
    angular
        .module('icons.product.controller',[])
        .controller('proCtrl',proCtrl);
    proCtrl.$inject=['$scope', '$yikeUtils', '$state','$ionicLoading','$timeout'];
    function proCtrl($scope,$yikeUtils,$state,$ionicLoading,$timeout){
        init();
        function  init(){
        }
        $scope.$on('$ionicView.beforeEnter',function(){
            $ionicLoading.show();
            getClassfiy();
        });
        function getClassfiy(){
            yikeShop.query('/ArticleList/get_message',{id:2,typeId:6}).then(function(data){
                $timeout(function(){$scope.pro=data.data;
                console.log($scope.pro[0]);
                $ionicLoading.hide();
            },1000)})
        }
    }
})();