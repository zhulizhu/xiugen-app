/**
 * Created by Grauda on 2016/12/10 0010.
 */
(function(){
    'user strict';
    angular
        .module('icons.brand.controller',[])
        .controller('brandCtrl',brandCtrl);
    brandCtrl.$inject=['$scope', '$yikeUtils', '$state','$ionicLoading','$timeout'];
    function brandCtrl($scope,$yikeUtils,$state,$ionicLoading,$timeout){
        init();
        function  init(){
        }
         $scope.$on('$ionicView.beforeEnter',function(){
            $ionicLoading.show();
            getClassfiy();
        });
        function getClassfiy(){
            yikeShop.query('/ArticleList/get_message',{id:2,typeId:2}).then(function(data){
                $timeout(function(){$scope.brand=data.data;
                console.log($scope.brand[0]);
                $ionicLoading.hide();
            },1000)})
        }
    }
})();