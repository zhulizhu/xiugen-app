/**
 * Created by Garuda on 2017/1/9 0009.
 */
(function () {
    'use strict';
    angular
        .module('user.myhobby.controller', [])
        .controller('MyHobbyCtrl', MyHobbyCtrl);

    MyHobbyCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', '$ionicLoading'];
    /* @ngInject */
    function MyHobbyCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, $ionicLoading) {
        $scope.id = $state.params.id;
        $scope.getSuggest = getSuggest;
        var id;
        var goods = AV._.find($scope.cart.goods, function (item) {
                return item.goods_id == id;
            }) || {};
        console.log(goods);
        $scope.payload = {
            quantity: goods.quantity || 0,
            goods_id: id
        };
        $scope.add = add;

        init();
        function  init(){
            getAddress();
            getSuggest();
            //console.log($scope.id);
        }
        //获得用户推荐
        function getSuggest() {
            yikeShop.query('/hobby/hobby_recommended',{token:TOKEN})
                .then(function(data) {
                    console.log(data.data);
                });
        }
        //获得默认地址
        function getAddress() {
            yikeShop.query('/cart/get_address',{token:TOKEN})
                .then(function (data) {
                    console.log(data);
                    $scope.address = data.data;
                    $scope.$digest();
                })
                .catch(function(data){
                    console.log(data);
                })
        }

        function  getPrope(){
            yikeShop.query('',{token:TOKEN})
                .then(function(data){

                })
                .catch(function(data){

                });
        }

        //添加商品
        function add() {
            console.log($scope.payload);
            $scope.payload.quantity++;
            update();
        }

        function update() {
            var payload = $scope.payload;
            if (payload.quantity > 0) {
                yikeShop.query('/cart/add', payload)
                    .then(function (data) {
                        $yikeUtils.toast(data.data.success);
                    })
            }
        }
    }
})();