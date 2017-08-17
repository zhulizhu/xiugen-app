/**
 * Created by Grauda on 2016/12/10 0010.
 */
(function(){
    'use strict';
    angular
        .module('icons.food.safe.controller',[])
        .controller('FoodSafeCtrl',FoodSafeCtrl);
    FoodSafeCtrl.$inject=['$scope', '$yikeUtils','$sce'];
    function FoodSafeCtrl($scope,$yikeUtils,$sce){
        // 视频路径处理
        try{
          $scope.videoUrl = function(url){  
          return $sce .trustAsResourceUrl(url);  
        } 
        }catch(err){
          $yikeUtils.toast("视频加载失败");
        } 
        init();
        function  init(){
            getList();
        }
        //视频分类列表
        function getList(){
            yikeShop.query('/article/get_list').then(function(data){
                console.log(data);
                $scope.list =data.data.list;
                // console.log($scope.list);
                $scope.$digest();
            })
        }
    }
})();