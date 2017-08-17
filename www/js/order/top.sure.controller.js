/**
 * Created by Administrator on 2016/12/13 0013.
 */
(function () {
    'use strict';
    angular.module('order.top.sure.controller', [])
        .controller('TopSureCtrl', TopSureCtrl);
    TopSureCtrl.$inject = ['$scope', '$ionicModal', '$yikeUtils', '$state'];
    function TopSureCtrl($scope, $ionicModal, $yikeUtils, $state) {
        var money = $state.params.money,
            type = $state.params.type,
            flag = true;
        $scope.uid = '';
        $scope.submit = submit;
        $scope.data = {
            money: money,
            type: type
        };
        init();
        function init() {
            get_my_info();
        };
         function get_my_info() {
             yikeShop.query('/user/get_my_info').then(function(data){
                 $scope.uid = data.data.uid;
             }).catch(function(){

             });
         };
        function alipay(data) {
            yikeShop.query('/recharge/alipay_sign', {id: data.data})
                .then(function (data1) {
                    try {
                        cordova.plugins.AliPay.pay(data1.data.form, function success(e) {
                            yikeShop.query('/PaySuccess/change_money',{
                                money:$scope.data.money,
                                uid:$scope.uid,
                                type:'10'
                            }).then(function(data){
                                $state.go('tab-account');
                            }).catch(function(){
                                $state.go('top-up');
                            });
                        }, function error(e) {

                        });
                    } catch (ex) {
                        $yikeUtils.toast(ex);
                    }
                })
        };
        function weixinPay(data) {
            yikeShop.query('/Recharge/wechat',{money:$scope.data.money}).then(function (data) {
                try{
                    Wechat.sendPaymentRequest(data.data, function () {
                        yikeShop.query('/PaySuccess/change_money',{
                            money:$scope.data.money,
                            uid:$scope.uid,
                            type:'11'
                        }).then(function(data){
                            $yikeUtils.toast(data.msg);
                            $state.go('tab-account');
                        }).catch(function(data){
                            $yikeUtils.toast(data.msg);
                            $state.go('top-up');
                        });
                    },function (reason) {
                        $yikeUtils.toast('支付失败' + reason);
                    });
                }catch(ex){
                    $yikeUtils.toast(ex);
                }
            }).catch(function(data){
                $yikeUtils.toast(data.msg);
            });
        }
        function submit() {
           if(!flag){
               return false;
           }else{
               flag = false;
               submitOrder();
           };
           function submitOrder(){
               yikeShop.query('/recharge/submit', $scope.data)
                   .then(function (data) {
                       flag = true;
                       //支付宝
                       if (type == '10') {
                           alipay(data);
                       };
                       //微信支付
                       if(type == '11'){
                           weixinPay(data);
                       };
                   }).catch(function(data){
                       $yikeUtils.toast(data.msg);
                    })
           };
        }
    }
})();