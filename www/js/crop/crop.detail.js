/**
 * Created by Garuda on 2017/2/8 0008.
 */
(function () {
    'use strict';

    angular
        .module('crop.detail.controller', [])
        .controller('CropDetailCtrl', CropDetailCtrl);
    /* @ngInject */
    CropDetailCtrl.$inject=["$scope","$yikeUtils","$state","$ionicScrollDelegate"];
    function CropDetailCtrl($scope, $yikeUtils, $state,$ionicScrollDelegate) {
        var id = $state.params.id;
        var goods = AV._.find($scope.cart.goods, function (item) {
                return item.goods_id == id;
            }) || {};
        console.log(goods);
        $scope.payload = {
            quantity: goods.quantity||0,
            goods_id: id
        };
        $scope.page=0;
        $scope.evaluate=[];
        $scope.add = add;
        $scope.remove = remove;
        $scope.change=change;
        $scope.loadMore=loadMore;
        var count=$scope.payload.quantity; //添加的数量
        init();

        function init() {
            getDetail(id);
            getEvaluate();
        }

        function  change(){
            if(($scope.payload.quantity)%1==0){
                update();
            }else if(($scope.payload.quantity)%1!=0){
                $scope.payload.quantity=Math.ceil($scope.payload.quantity);
                update();
            }
        }

        function add() {
            console.log($scope.payload);
            $scope.payload.quantity++;
            update();
        }

        function remove() {
            if ($scope.payload.quantity > 0) {
                $scope.payload.quantity--;
                if ($scope.payload.quantity == 0) {
                    var payload = $scope.payload;
                    yikeShop.query('/cart/remove_by_goods_id', payload)
                        .then(function (data) {
                            $yikeUtils.toast(data.data.success);
                        })
                } else {
                    update();
                }
            }
        }

        function update() {
            if($scope.data.goods.quantity==0){
                $yikeUtils.toast('商品暂无库存!');
                $scope.payload.quantity=0;
                return false;
            }
            var payload = $scope.payload;
            if(count==payload.quantity){
                return false;
            }
            else if (payload.quantity > 0) {
                yikeShop.query('/cart/add', payload)
                    .then(function (data) {
                        $yikeUtils.toast(data.data.success);
                        count=payload.quantity;
                    })
            }
        }

        function getDetail(id) {
            yikeShop.query('/goods/detail', {id: id})
                .then(function (data) {
                    $scope.data = data.data;
                    console.log($scope.data);
                    $scope.$digest();
                }).catch(function(data){
                console.log(data);
            })

        }

        //获取商品评价
        function getEvaluate(){
            yikeShop.query('/goods/evaluation',{token:TOKEN,goods_id:id,page:$scope.page})
                .then(function(data){
                    if($scope.page==0){
                        $scope.evaluate=data.data;
                    }else{
                        $scope.evaluate=$scope.evaluate.concat(data.data);
                    }
                    $ionicScrollDelegate.resize();
                    $scope.$digest();
                })
                .catch(function(data){
                    $scope.evaluateMsg=data.msg;
                })
        }

        //加载更多
        function loadMore(){
            $scope.page++;
            getEvaluate();
        }
    }
})();