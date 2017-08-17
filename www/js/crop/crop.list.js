/**
 * Created by Garuda on 2017/2/8 0008.
 */
(function () {
    'use strict';

    angular
        .module('crop.list.controller', [])
        .controller('CropListCtrl', CropListCtrl);
    CropListCtrl.$inject=["$scope","$yikeUtils","$state","$ionicLoading"];
    function CropListCtrl($scope, $yikeUtils, $state,$ionicLoading) {
        var id = 1;
        var sid= $state.params.id;
        var sites_id=localStorage.getItem('xiuGen_sites');
        var page=1;
        $scope.current = {
            id: id
        };
        $scope.getList = getList;
        init();
        function init() {
            var mySwiper = new Swiper('.swiper-container2', {
                slidesPerView: 2,
                paginationClickable: true,
                spaceBetween: 30,
                freeMode: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true//修改swiper的父元素时，自动初始化swiper
            });
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            $ionicLoading.show();
            getCategory();
        });
        function getCategory() {
            yikeShop.query('/category/children', {pid:28})
                .then(function (data) {
                    $scope.category = data.data;
                    for (var i = 0; i < $scope.category.length; i++) {
                        var obj = $scope.category[i];
                        var id = obj.id;
                        getList(id);
                    }
                    $scope.$digest();
                })
        }
        function getList(id) {
            $ionicLoading.show();
            /*$scope.current.id = id;
            yikeShop.query('/category/get_goods', {id: id})
                .then(function (data) {
                    $scope.data = data.data;
                    $scope.$digest();
                }).catch(function(data){
                   $yikeUtils.toast(data.msg);
                });*/
            $scope.current.id = id;
            yikeShop.query('/sites/goods', {page:page,category_id: id,add_id:sites_id})
                .then(function (data) {
                    $scope.data = data.data;
                    console.log(data);
                    $ionicLoading.hide();
                    $scope.$digest();
                }).catch(function(data){
                $ionicLoading.hide();
                //console.log(data);
                $yikeUtils.toast(data.msg);
            });
        }

    }
})();