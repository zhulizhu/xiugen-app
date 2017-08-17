/**
 * Created by Garuda on 2017/2/17.
 */
(function () {
    'use strict';

    angular
        .module('ticket.pay.controller', [])
        .controller('TicketPayCtrl', TicketPayCtrl);
    /* @ngInject */
    TicketPayCtrl.$inject=["$scope","$yikeUtils","$state","$rootScope","$timeout","$ionicModal"];
    function TicketPayCtrl($scope, $yikeUtils, $state, $rootScope, $timeout, $ionicModal) {
        $scope.submitOrder=submitOrder;
        $scope.select=select;
        //$scope.getTime=[{id:1,info:'周一至周五'},{id:2,info:'周六至周日'},{id:3,info:'全天配送'}];
        $scope.timeSelect='';
        //门票商品id和类型id
        var goodsId = $state.params.id;
        var ticket_type_id = $state.params.pid;
        var target = {
            '0': 'money_pay',
            '1': 'weixin_pay',
            '2': 'alipay_app_pay'
        };
        var addressId='';
        $scope.zhifu=0;
        $scope.userInfo = [];
        var flag=true;
        init();
        function init() {
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            getMyInfo();
            getDetail()
        });

        //获取用户信息
        function getMyInfo() {
            yikeShop.query('/user/get_my_info')
                .then(function (data) {
                    $scope.user = data.data.money;
                    $scope.userInfo=data.data;
                    $scope.$digest();
                }).catch(function(data){
                $state.go('login');
            })
        }



        //获取商品详情
        function getDetail(){
            yikeShop.query('/cart/package',{goods_id:goodsId})
                .then(function (data) {
                    $scope.detail=data.data.goods;
                    $scope.$digest();
                }).catch(function(data){
                console.log('test');
            })
        }

        //选择支付方式
        function  select(i){
            $scope.zhifu=i;
        }

        //结账
        function submitOrder(){
           /* if($scope.zhifu=='1'){
                $yikeUtils.toast('该支付方式暂不支持');
                return false;
            }*/
            if ($scope.zhifu == 0) {
                if ($scope.detail.price > $scope.user) {
                    $yikeUtils.toast('账户余额不足!');
                    flag = true;
                    return false;
                } else {
                    Settlement();
                }
            }else{
                Settlement();
            }
           // $yikeUtils.toast('功能正在建设当中');
        }
        //判断余额支付是否成功
        function checkBuyStatus(){
           yikeShop.query('/PaySuccess/money',{
               is_ticket:1,
               uid:$scope.userInfo.uid,
               ticket_pid:ticket_type_id,
               ticket_id:goodsId,
               phone:$scope.userInfo.telephone
           }).then(function(data){

           }).catch(function(){
           })
        };
        //支付参数
        function Settlement(){
            yikeShop.query( '/payment/' + target[$scope.zhifu], {
                phone:$scope.userInfo.telephone,
                ticket_pid:ticket_type_id,
                is_package:0,
                is_ticket:1,
                goods_id:goodsId,
                order_money:$scope.detail.price,
                since_mentioning:0
            }).then(function (data) {
                    if (data.code == 1) {
                        if (data.data.type == '0') {
                            checkBuyStatus();
                            $yikeUtils.toast('支付成功');
                            $timeout(function(){
                                $state.go('my-ticket');
                            },500);
                            return false;
                        } else if (data.data.type == '1') {
                            try {
                                cordova.plugins.AliPay.pay(data.data.form, function success(e) {
                                    checkBuyStatus();
                                    $state.go('my-ticket');
                                }, function error(e) {
                                    $timeout(function(){
                                        $state.go('ticket-pay');
                                    })
                                });
                            } catch (ex) {
                                $yikeUtils.toast('支付未完成');
                                $timeout(function(){
                                    $state.go('ticket-pay');
                                })
                            }
                        } else if (data.data.type == '2') {
                            try {
                                var o  = data.data,n = {};
                                for(var key in o){
                                    if(key == 'type'){
                                        continue;
                                    }else{
                                        n[key] = o[key];
                                    }
                                };
                                Wechat.sendPaymentRequest(n, function (reason) {
                                    checkBuyStatus();
                                    $yikeUtils.toast('支付完成');
                                    $state.go('my-ticket');
                                }, function (reason) {
                                    $yikeUtils.toast('支付失败'+reason);
                                    $state.go('ticket-pay');
                                });
                            } catch (ex) {
                                $yikeUtils.toast('支付未完成');
                                $state.go('ticket-pay');
                            }
                        }
                    }
                })
                .catch(function(data){
                    $yikeUtils.toast('支付取消');
                })
        }
    }
})();