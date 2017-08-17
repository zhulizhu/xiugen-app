/**
 * Created by ROCK on 2017/2/17.
 * package.pay.controller
 */
(function () {
    'use strict';

    angular
        .module('package.pay.controller', [])
        .controller('PackagePayCtrl', PackagePayCtrl);
    /* @ngInject */
    PackagePayCtrl.$inject=["$scope","$yikeUtils","$state","$rootScope","$timeout","$ionicModal"];
    function PackagePayCtrl($scope, $yikeUtils, $state, $rootScope, $timeout, $ionicModal) {
        $scope.submitOrder=submitOrder;
        $scope.select=select;
        $scope.selected=selected;
        $scope.month = [];
        $scope.getTime= getTime;
        $scope.time =[];
        $scope.timeSelect='';
        $scope.days = '';
        var goodsId=$state.params.id;
        var target = {
            '0': 'money_pay',
            '1': 'weixin_pay',
            '2': 'alipay_app_pay'
        };
        var addressId='';
        $scope.zhifu=0;
        var flag=true;
        var aflag=false;
        var site_id='';
        init();
        function init() {
            template();
        }

        function  template() {
            //模态窗口
            $ionicModal.fromTemplateUrl('templates/modal/package-delivery.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            var  day = new Date(2014,4,0);
            //获取天数：
            var daycount = day.getDate();
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            getMyInfo();
            getCartAddress();
            getTime();
        });
        //获取配送时间
        function getTime(){
            yikeShop.query('/category/get_package_time').then(function(data){
                $scope.time = data.data;
                console.log($scope.time);
                $scope.$digest();
            }).catch(function(data){
                $yikeUtils.toast('暂无推送时间');
            })
        }
        //获取用户信息
        function getMyInfo() {
            yikeShop.query('/user/get_my_info')
                .then(function (data) {
                    $scope.user = data.data.money;
                    $scope.$digest();
                }).catch(function(data){
                    $state.go('login');
                })
        }

        //获取地址
        function  getCartAddress() {
            var address=localStorage.getItem('xiuGen_jwd');
            yikeShop.query('/address/lists', {token: TOKEN,address:address})
                .then(function (data) {
                   // console.log(data);
                    var list_address = data.data;
                    for(var k in list_address){
                        if(list_address[k].default==1&&list_address[k].cd>=0){
                            $scope.address=list_address[k];
                            addressId = $scope.address.id;
                            aflag=true;
                            break;
                        }
                    }
                    getDetail();
                    $scope.$digest();
                })
                .catch(function (data) {
                    console.log(data);
                })
        }


        /*//获取上门时间
        function  getTime(){
            yikeShop.query('/time/door_time',{token:TOKEN})
                .then(function(data){
                    console.log(data);
                    $scope.getTime=data.data;
                    console.log($scope.getTime);
                })
                .catch(function(data){
                    console.log(data);
                });
        }*/

        //选择上门时间
        function  selected(i,x){
            var itemx,item;
            $scope.timeSelect= i.id;
            $scope.days = i.days;
            $scope.timeActive=document.querySelector('.delivery-cont');
            itemx=$scope.timeActive.querySelectorAll('.item');
            item=this.$index;
            if(itemx[item].className.match('tActive')){
                return;
            }else{
                for (var j = 0; j < itemx.length; ++j) {
                    itemx[j].className = 'item';
                }
                itemx[item].className+=' tActive';
                $scope.realSendTime = i.time + '提前'+i.days+'天预定';
            }
            $scope.closeModal();
        }

        //获取套餐详情
        function getDetail(){
            yikeShop.query('/cart/package',{goods_id:goodsId,address_id:addressId})
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
            //console.log('/payment/' + target[$scope.zhifu], {city_id: $rootScope.cart.city_id,order_money:$rootScope.cart.total_price,packet_id:tid,since_mentioning:siteData.since_mentioning,site_id:siteData.site_id,cd:siteData.cd});
            if(aflag==false){
              $yikeUtils.toast('请选择有效的地址');
              return false;
            }else if(!$scope.timeSelect){
                $yikeUtils.toast('请选择配送时间');
            }else if ($scope.zhifu == 0) {
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
        }

        //支付参数
        function Settlement(){
            yikeShop.query('/payment/' + target[$scope.zhifu], {times: $scope.days,payTime:$scope.timeSelect,is_ticket:0,is_package:1,goods_id:goodsId,order_money:$scope.detail.price,since_mentioning:0,address:addressId,cd:$scope.address.cd})
                .then(function (data) {
                    if (data.code == 1) {
                        if (data.data.type == '0') {
                              $yikeUtils.toast('支付成功!');
                              $timeout(function(){
                                  $state.go('my-package');
                              },500);
                              return false;
                        } else if (data.data.type == '1') {
                            try {
                                cordova.plugins.AliPay.pay(data.data.form, function success(e) {
                                    $yikeUtils.toast('支付完成');
                                    $state.go('my-package');
                                }, function error(e) {
                                    $yikeUtils.toast('支付失败');
                                    $timeout(function(){
                                        $state.go('tab.home');
                                    })
                                });
                            } catch (ex) {
                                $yikeUtils.toast('支付未完成');
                                $timeout(function(){
                                    $state.go('tab.home');
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
                                Wechat.sendPaymentRequest(n, function () {
                                    $yikeUtils.toast('支付完成');
                                    $state.go('orders');
                                }, function (reason) {
                                    $yikeUtils.toast('支付失败');
                                    $state.go('orders');
                                });
                            } catch (ex) {
                                $yikeUtils.toast('支付未完成');
                                $state.go('orders');
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