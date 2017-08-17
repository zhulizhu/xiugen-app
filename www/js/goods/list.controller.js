/**
 * Created by frank on 2016/9/6.
 */
(function () {
        'use strict';

        angular
            .module('goods.list.controller', [])
            .controller('GoodsListCtrl', GoodsListCtrl);

        /* @ngInject */
       GoodsListCtrl.$inject=["$scope","$yikeUtils","$state","$ionicLoading"];
        function GoodsListCtrl($scope, $yikeUtils, $state,$ionicLoading) {
            var id = 1;
            //var sid= $state.params.id;
            var sites_id=localStorage.getItem('xiuGen_sites');
            var page=1;
            $scope.current = {
                id: id
            };
            //$scope.getList = getList;
            $scope.getSitesList=getSitesList;
            $scope.refresh=refresh;
            init();
            function init() {
                $ionicLoading.show();
                getCategory();
                var mySwiper = new Swiper('.swiper-container2', {
                    slidesPerView: 3,
                    paginationClickable: true,
                    spaceBetween: 30,
                    freeMode: true,
                    observer: true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true//修改swiper的父元素时，自动初始化swiper
                });
            }

            $scope.$on('$ionicView.beforeEnter',function(){
                refresh();
            });

            function refresh(){
                getCategory();
            }

            function getCategory() {
                yikeShop.query('/category/children', {pid:1})
                    .then(function (data) {
                        $scope.category = data.data;
                        for (var i = 0; i < $scope.category.length; i++) {
                            var obj = $scope.category[i];
                            var id = obj.id;
                            getList(id);
                            //console.log(id);
                            //getSitesList(id)
                        }
                       // $scope.$digest();
                    })
            }
            function getList(id) {
                //console.log(id);
                $scope.current.id = id;
                yikeShop.query('/category/get_goods', {id: id})
                    .then(function (data) {
                        $scope.data = data.data;
                        console.log(data);
                        $scope.$digest();
                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicLoading.hide();
                    }).catch(function(data){
                        //console.log(data);
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                       $yikeUtils.toast(data.msg);
                    });
            }

            //获取站点的商品
            function getSitesList(id){
                $scope.current.id = id;
                yikeShop.query('/sites/goods', {page:page,category_id: id,add_id:sites_id})
                    .then(function (data) {
                        $scope.data = data.data;
                        console.log(data);
                        $scope.$digest();
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                    }).catch(function(data){
                    //console.log(data);
                    $ionicLoading.hide();
                    $yikeUtils.toast('该站点暂时没有别的商品');
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }

            /*function getCategory() {
                yikeShop.query('/category/index', {id:sid})
                    .then(function (data) {
                        $scope.category = data.data;
                        //console.log($scope.category);
                        $scope.$digest();
                    })
            }*/
        }
    })();