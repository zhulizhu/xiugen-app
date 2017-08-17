/**
 * Created by Garuda on 2016/12/10 0010.
 */
(function(){
    'user strict';
    angular
        .module('icons.detection.controller',[])
        .controller('decCtrl',decCtrl);
    decCtrl.$inject=['$scope', '$yikeUtils', '$state','$ionicLoading','$timeout'];
    function decCtrl($scope,$yikeUtils,$state,$ionicLoading,$timeout){
        init();
        function  init(){
        }
        $scope.$on('$ionicView.beforeEnter',function(){
            $ionicLoading.show();
            getClassfiy();
        });
        function getClassfiy(){
            yikeShop.query('/ArticleList/get_message',{id:2,typeId:5}).then(function(data){
               $timeout(function(){$scope.dec=data.data;
                console.log($scope.dec[0]);
                $ionicLoading.hide();
            },1000)})
        }
    }
})();