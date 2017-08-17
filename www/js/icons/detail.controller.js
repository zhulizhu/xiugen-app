/**
 * Created by Grauda on 2016/12/10 0010.
 */
(function () {
    'use strict';
    angular
        .module('icons.detail.controller', [])
        .controller('DetailCtrl', DetailCtrl);
    DetailCtrl.$inject = ['$scope', '$yikeUtils', '$state','$sce'];
    function DetailCtrl($scope, $yikeUtils, $state,$sce) {
        var id = $state.params.id;
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
            getOne();
        }
        //视频详情
        function getOne() {
            yikeShop.query('/article/get_one',{id:id}).then(function (data) {
                console.log(data);
                $scope.itemx = data.data;
                $scope.$digest();
            })
        }
    }
})();