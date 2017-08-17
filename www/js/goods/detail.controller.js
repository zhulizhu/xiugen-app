/**
 * Created by frank on 2016/9/6.
 */
(function () {
    'use strict';

    angular
        .module('goods.detail.controller', [])
        .controller('GoodsDetailCtrl', GoodsDetailCtrl);
    /* @ngInject */
    GoodsDetailCtrl.$inject=["$scope","$yikeUtils","$state","$ionicScrollDelegate","$ionicLoading"];
    function GoodsDetailCtrl($scope, $yikeUtils, $state, $ionicScrollDelegate,$ionicLoading) {
        var id = $state.params.id;
        var goods = AV._.find($scope.cart.goods, function (item) {
            return item.goods_id == id;
        }) || {};
        //console.log(goods);
        $scope.payload = {
            quantity: goods.quantity||0,
            goods_id: id
        };
        $scope.page = 0;
        $scope.evaluate = [];
        $scope.add = add;
        $scope.remove = remove;
        $scope.change = change;
        $scope.loadMore = loadMore;
        $scope.judge=true;
        var count = $scope.payload.quantity; //添加的数量
        var TOKEN="";
        init();

        function init() {
            $ionicLoading.show();
            var swiper1 = new Swiper('.detail-container', {
                autoplay:3000,
                loop:true,
                pagination:'.swiper-pagination',
                paginationClickable: true,
                freeMode: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true//修改swiper的父元素时，自动初始化swiper
            });
        };

        $scope.$on('$ionicView.beforeEnter',function(){
            TOKEN=localStorage.getItem('TOKEN');
            if(TOKEN&&TOKEN.length>5){
                getDetail(id);
                getEvaluate();
            }else{
                $yikeUtils.toast('请先登录');
                $state.go('login');
            }
        });

        function  change(){
            if(($scope.payload.quantity)%1==0){
                update();
            }else if(($scope.payload.quantity)%1!=0){
                $scope.payload.quantity=Math.ceil($scope.payload.quantity);
                update();
            }
        }
        function add(){
            if ($scope.data.goods.quantity == 0) {
                $scope.payload.quantity = 0;
                return false;
            }
            else if ($scope.payload.quantity >= $scope.data.sl) {
                $yikeUtils.toast('超出商品库存!');
                return false;
            }else{
                $scope.payload.quantity++;
                update();
            }
        }
        function remove() {
            if ($scope.payload.quantity > 0) {
                $scope.payload.quantity--;
                if ($scope.payload.quantity == 0) {
                    var payload = $scope.payload;
                    yikeShop.query('/cart/remove_by_goods_id', payload)
                        .then(function (data) {
                            //$yikeUtils.toast(data.data.success);
                        })
                } else {
                    update();
                }
            }else if(count>0){
                yikeShop.query('/cart/remove_by_goods_id', $scope.payload)
                    .then(function (data) {
                        $scope.$digest();
                        //getCart();
                    })
            }
        }
        function update() {
            var payload = $scope.payload;
            if ($scope.data.goods.quantity == 0) {
                $yikeUtils.toast('商品暂无库存!');
                $scope.payload.quantity = 0;
                return false;
            }
            else if ($scope.payload.quantity > $scope.data.sl) {
                $yikeUtils.toast('超出商品库存!');
                $scope.payload.quantity = count;
                return false;
            }
            else if (count == payload.quantity) {
                return false;
            }
            else if (payload.quantity > 0) {
                yikeShop.query('/cart/add', payload)
                    .then(function (data) {
                        $yikeUtils.toast(data.data.success);
                        count = payload.quantity;
                    })
            }
        }
        function getDetail(id) {
            yikeShop.query('/goods/detail', {id: id})
                .then(function (data) {
                    $scope.data = data.data;
                    $scope.data.sl=data.data.goods.quantity;
                    if($scope.data.sl==0&&count>=1){
                       remove();
                    }
                    $ionicLoading.hide();
                    $scope.$digest();
                }).catch(function(data){
                    $ionicLoading.hide();
                    console.log(data);
               })

        }
        //获取商品评价
        function getEvaluate() {
            yikeShop.query('/goods/evaluation', {token: TOKEN, goods_id: id, page: $scope.page})
                .then(function (data) {
                    //console.log(data);
                    if ($scope.page == 0) {
                        $scope.evaluate = data.data.list;
                        console.log($scope.evaluate);
                    } else {
                        $scope.evaluate = $scope.evaluate.concat(data.data.list);
                        console.log($scope.evaluate);
                    }
                    //$scope.evaluateTF = $scope.evaluate.length >= Number(data.data.num);
                    $scope.evaluateTF = $scope.evaluate.length >= Number(data.data.num);
                    $ionicScrollDelegate.resize();
                    $scope.$digest();
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                })
                .catch(function (data) {
                    $scope.judge=false;
                    $scope.evaluateMsg = data.msg;
                    $scope.$digest();
                })
        }
        //加载更多
        function loadMore() {
            $scope.page++;
            getEvaluate();
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
    }
})();