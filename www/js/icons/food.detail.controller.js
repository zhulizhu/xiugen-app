/**
 * Created by Grauda on 2016/12/10 0010.
 */
(function () {
    'use strict';
    angular
        .module('icons.food.detail.controller', [])
        .controller('FoodDetailCtrl', FoodDetailCtrl);
    FoodDetailCtrl.$inject = ['$scope', '$yikeUtils', '$state','$sce'];
    function FoodDetailCtrl($scope, $yikeUtils, $state,$sce) {
        var title = $state.params.title;
        // 视频路径处理
         try{
          $scope.videoUrl = function(url){  
          return $sce .trustAsResourceUrl(url);  
        } 
        }catch(err){
          $yikeUtils.toast("视频加载失败");
        } 
        init();
        function init() {
            getDetail();
        }
        //视频列表
        function getDetail() {
            yikeShop.query('/article/get_details',{title:title}).then(function (data) {
                console.log(data);
                $scope.items = data.data;
                $scope.title = data.data[0].title;
                $scope.$digest();
            })
        }
    }
})();