/**
 * Created by frank on 2016/9/6.
 */
(function () {
    'use strict';

    angular
        .module('ticket.controller', [])
        .controller('TicketCtrl', TicketCtrl);

    /* @ngInject */
    TicketCtrl.$inject=["$scope","$yikeUtils","$state","$ionicLoading"];
    function TicketCtrl($scope, $yikeUtils, $state,$ionicLoading) {
        $scope.pid = 29;
        $scope.data = {};
        //$scope.add = add;
        init();

        function init() {
            $ionicLoading.show();
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            getCategory();
        });

        function getCategory() {
            yikeShop.query('/category/children', {pid: $scope.pid})
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
            yikeShop.query('/category/get_goods', {id: id})
                .then(function (data) {
                    $scope.data[id] = data.data;
                    $scope.data[id].checkIndex = '0';
                    $ionicLoading.hide();
                    $scope.$digest();
                })
        }

        /*function add(item) {
            var payload = {
                goods_id: item.goods_id,
                quantity: 1
            };
            yikeShop.query('/cart/add', payload)
                .then(function (data) {
                    $yikeUtils.toast(data.data.success);
                })
        }*/
    }
})();