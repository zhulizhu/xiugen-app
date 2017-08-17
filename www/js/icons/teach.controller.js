/**
 * Created by Garuda on 2016/12/10 0010.
 */
(function(){
    'user strict';
    angular
        .module('icons.teach.controller',[])
        .controller('teachCtrl',teachCtrl);
    teachCtrl.$inject=['$scope', '$yikeUtils', '$state','$ionicLoading','$timeout'];
    function teachCtrl($scope,$yikeUtils,$state,$ionicLoading,$timeout){
        init();
        function  init(){
        }
        $scope.$on('$ionicView.beforeEnter',function(){
            $ionicLoading.show();
            getClassfiy();
        });
        function getClassfiy(){
            yikeShop.query('/ArticleList/get_message',{id:2,typeId:4}).then(function(data){
                $timeout(function(){$scope.teach=data.data;
                console.log($scope.teach[0]);
                $ionicLoading.hide();
            },1000)})
        }
    }
})();