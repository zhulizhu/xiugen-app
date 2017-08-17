/**
 * Created by Garuda on 2017/1/19 0019.
 */
(function () {
    'use strict';

    angular
        .module('go.submit.controller', [])
        .controller('GoSubmitCtrl', GoSubmit);

    GoSubmit.$inject = ['$scope', '$yikeUtils', '$state', '$rootScope'];
    /* @ngInject */
    function GoSubmit($scope, $yikeUtils, $state, $rootScope) {
        var id=$state.params.id;
        var timeId=$state.params.tid;
        var flag=true;
        var tid='';
        var red_money='';
        var siteId=true;
        $scope.addExits=false;
        var cd='';
        var site_id='';
        var target = {
            '0': 'money_pay',
            '1': 'weixin_pay',
            '2': 'alipay_app_pay'
        };
        var siteData={
            since_mentioning:'',
            site_id:'',
            cd:''
        };
        $scope.data = {};
        $scope.pay = pay;
        $scope.select=select;
        $scope.zhifu=0;
        $scope.goId=id;//订单id
        init();
        function init() {
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            getMyInfo();
            isPick();
        });

        //获取地址跟自提
        function isPick(){
            if(JSON.parse(localStorage.getItem('xiuGen_pickSite'))){
                $scope.checkSiteId=JSON.parse(localStorage.getItem('xiuGen_pickSite')).id;
                if($scope.checkSiteId>=0){
                    siteData={since_mentioning:'1', site_id:'', cd:''};
                    siteId=false;
                    $scope.addExits=true;
                    getMyBag();
                    return false;
                }else{
                    getCartAddress();
                }
                return false;
            }else{
                getCartAddress();
            }
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

        //获取红包信息
        function getMyBag(){
            if(JSON.parse(localStorage.getItem('xiuGen_bag'))){
                var type=JSON.parse(localStorage.getItem('xiuGen_bag')).type;
                if(type=='goSub'){
                    tid=JSON.parse(localStorage.getItem('xiuGen_bag')).id;
                    red_money=JSON.parse(localStorage.getItem('xiuGen_bag')).money;
                    $scope.red_money=red_money;
                }
                getCart();
                return false;
            }else{
                getCart();
            }
        }

        function getCart() {
            if(siteId){
                site_id= localStorage.getItem("xiuGen_sites");
            }
            if($scope.address){
                cd=$scope.address.cd;
            }
            yikeShop.query('/cart/goods',{order_id:id,packet_id:tid,since_mentioning:0,cd:cd,site_id:site_id})
                .then(function (data) {
                    $scope.cart = data.data;
                    $scope.cart.transport = Number(data.data.transport);
                    $scope.money=Number($scope.cart.total_price)+$scope.cart.transport;
                    $scope.$digest();
                })
        }

        function  getCartAddress() {
            var address=localStorage.getItem('xiuGen_jwd');
            yikeShop.query('/address/lists', {token: TOKEN,address:address})
                .then(function (data) {
                    // console.log(data);
                    var list_address = data.data;
                    for(var k in list_address){
                        if(list_address[k].default==1&&list_address[k].cd>=0){
                            $scope.address=list_address[k];
                            $scope.addExits=true;
                            siteData={since_mentioning:'0', site_id:$scope.address.id, cd:$scope.address.cd};
                            break;
                        }
                    }
                    getMyBag();
                    $scope.$digest();
                })
                .catch(function (data) {
                    console.log(data);
                    $scope.addExits=false;
                })
        }

        function  select(i){//选择支付方式
            $scope.zhifu=i;
        }
        function pay() {
            if($scope.addExits==false){
                $yikeUtils.toast('请选择收货地址');
                return false;
            }
            else if($scope.cart.goods.length<=0||$scope.cart==''){
                $yikeUtils.toast('没有任何的商品!');
                return;
            }
            else if($scope.delist==1){
                $yikeUtils.toast('请选择其它支付方式');
                return false;
            }
            yikeShop.query('/payment/' + target[$scope.zhifu], {
                    order_id:id,
                    is_package: 0,
                    order_money:$scope.money,
                    packet_id: tid,
                    since_mentioning: siteData.since_mentioning,
                    site_id:site_id,
                    cd: siteData.cd,
                    timeset_id:timeId,
                    address:siteData.site_id
               }).then(function (data) {
                    //console.log(data);
                    if (data.code == 1) {
                        if (data.data.type == '0') {
                            $yikeUtils.toast(data.data.msg);
                            $state.go('orders');
                        } else if (data.data.type == '1') {
                            try {
                                cordova.plugins.AliPay.pay(data.data.form, function success(e) {
                                    $yikeUtils.toast('支付完成');
                                    $state.go('orders');
                                }, function error(e) {
                                    $yikeUtils.toast('支付失败');
                                    $state.go('orders');
                                    alert(JSON.stringify(e));
                                });
                            } catch (ex) {
                                $yikeUtils.toast('支付未完成');
                                $state.go('orders');
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
                                }
                                Wechat.sendPaymentRequest(n, function () {
                                    $yikeUtils.toast('支付完成');
                                    $state.go('orders');
                                }, function (reason) {
                                    $yikeUtils.toast('支付失败' + reason);
                                    $state.go('orders');
                                });
                            } catch (ex) {
                                $yikeUtils.toast('支付未完成');
                                $state.go('orders');
                            }
                        }
                    }
                })
        }
    }
})();