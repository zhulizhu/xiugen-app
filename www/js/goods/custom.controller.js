/**
 * Created by frank on 2016/9/6.
 */
(function () {
    'use strict';

    angular
        .module('custom.controller', [])
        .controller('CustomCtrl', CustomCtrl);

    /* @ngInject */
    CustomCtrl.$inject=["$scope","$yikeUtils","$state","$ionicLoading"];
    function CustomCtrl($scope, $yikeUtils, $state, $ionicLoading) {
        $scope.data = {};
        $scope.add = add;
        $scope.pid = 27;
        init();

        function init() {
           $ionicLoading.show();
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            getCategory();
        });

        function getCategory() {
            pollQuery('/category/children',TOKEN,{pid: $scope.pid},function(data){
                $scope.category = data.data;
                for (var i = 0; i < $scope.category.length; i++) {
                    var obj = $scope.category[i];
                    var id = obj.id;
                    getList(id);
                }
                $scope.$digest();
            },function(data){
                $yikeUtils.toast('网络异常');
            },function(){
                $yikeUtils.toast('请先登录');
                $state.go('login');
            })
        }

        function getList(id) {
            yikeShop.query('/category/get_goods', {id: id})
                .then(function (data) {
                    $scope.data[id] = data.data;
                    $scope.data[id].checkIndex = 0;
                    console.log($scope.data[id]);
                    $scope.$digest();
                    $ionicLoading.hide();
                }).catch(function(data){
                    console.log(data);
                    $ionicLoading.hide();
               })
        }

        function add(item) {
            var payload = {
                goods_id: item.goods_id,
                quantity: 1
            };
            yikeShop.query('/cart/add', payload)
                .then(function (data) {
                    $yikeUtils.toast(data.data.success);
                    $state.go('cart');
                })
        }
    }
})();