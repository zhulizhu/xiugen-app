/**
 * Created by Grauda on 2016/12/10 0010.
 */
(function(){
    'use strict';
    angular
        .module('icons.intro.controller',[])
        .controller('introCtrl',introCtrl);
        introCtrl.$inject=["$scope","$yikeUtils","$state","$sce","$ionicLoading","$timeout"];
        function introCtrl($scope,$yikeUtils,$state,$sce,$ionicLoading,$timeout){
         init();
         function  init(){
         }
         $scope.$on('$ionicView.beforeEnter',function(){
            $ionicLoading.show();
            getClassfiy();
        });
        function getClassfiy(){
            yikeShop.query('/ArticleList/get_message',{id:2,typeId:1}).then(function(data){
                $timeout(function(){console.log(data);
                $scope.intro=data.data;
                var str=$scope.intro[0].content;
                $scope.intro[0].content= $scope.intro[0].content.replace(/\“互联网\+现代农业\”/g,'<i>“互联网+现代农业” </i>');
                $ionicLoading.hide();
               // $scope.$sce=$sce;
               // console.log($scope.intro);
            },1000)})
        }
    }
})();