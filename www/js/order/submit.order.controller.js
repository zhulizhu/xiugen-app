(function () {
    'use strict';

    angular
        .module('submit.order.controller', [])
        .controller('SubmitOrderCtrl', SubmitOrderCtrl);
    /* @ngInject */
    SubmitOrderCtrl.$inject=['$scope', '$yikeUtils', '$state', '$rootScope'];
    function SubmitOrderCtrl($scope, $yikeUtils, $state, $rootScope) {
        /*
        * 先获取是否自提,再获取红包,然后获取cart
        * */
        var flag=true;
        var target = {
            '0': 'money_pay',
            '1': 'weixin_pay',
            '2': 'alipay_app_pay'
        };
        var tid='';
        var red_money='';
        var goodsId=[];
        var goodsIdArry='';
        var siteId=true;
        $scope.data = {};
        $scope.pay = pay;
        $scope.select=select;
        $scope.zhifu=0;
        var siteData={
            since_mentioning:'',
            site_id:'',
            cd:''
        };
        var cd='';
        var timeId=$state.params.tid;
        var site_id='';
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


        //获取地址信息
        function  getCartAddress() {
            var address=localStorage.getItem('xiuGen_jwd');
            yikeShop.query('/address/lists', {token: TOKEN,address:address})
                .then(function (data) {
                    var list_address = data.data;
                    for(var k in list_address){
                        if(list_address[k].default==1){
                            $scope.data.address=list_address[k];
                            siteData={since_mentioning:'0', site_id:$scope.data.address.id, cd:$scope.data.address.cd};
                            break;
                        }
                    }
                    getMyBag();
                    $scope.$digest();
                })
                .catch(function (data) {
                    $yikeUtils.toast('网络异常');
                })
        }

        //获取红包信息
        function getMyBag(){
           if(JSON.parse(localStorage.getItem('xiuGen_bag'))){
               var type=JSON.parse(localStorage.getItem('xiuGen_bag')).type;
               if(type=='sub'){
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

        function getCart() {
            if(siteId){
                site_id= localStorage.getItem("xiuGen_sites");
            }
            if($scope.data.address){
                cd=$scope.data.address.cd;
            }
            yikeShop.query('/cart/index',{packet_id:tid,since_mentioning:0,cd:cd,site_id:site_id})
                .then(function (data) {
                    goodsId=[];
                    $rootScope.cart = data.data;
                    console.log($rootScope.cart);
                    $rootScope.cart.transport = Number($rootScope.cart.transport);
                    //console.log($rootScope.cart);
                    for(var k in $rootScope.cart.goods){
                      if($rootScope.cart.goods[k].status==1){
                          goodsId.push($rootScope.cart.goods[k].goods_id);
                      }
                    }
                    goodsIdArry=goodsId.join(',');
                    $scope.$digest();
                })

        };
        function  select(i){//选择支付方式
            $scope.zhifu=i;
            $scope.delist=i;
        };
        function pay() {
            if (flag == true) {
                flag = false;
                if ($rootScope.cart.goods.length <= 0 || $rootScope.cart == '') {
                    $yikeUtils.toast('没有任何的商品!');
                    flag = true;
                    return;
                }else if ($scope.zhifu == 0) {
                    if ($rootScope.cart.transport > $scope.user) {
                        $yikeUtils.toast('账户余额不足!');
                        flag=true;
                        return false;
                    }else{
                        Settlement();
                    }
                } else {
                    Settlement();
                }
            }
        };
        //结算参数
        function Settlement(){
            yikeShop.query('/payment/' + target[$scope.zhifu], {
                    is_ticket:0,
                    is_package: 0,
                    goods_id: goodsIdArry,
                    order_money: $rootScope.cart.total_price,
                    packet_id: tid,
                    since_mentioning: siteData.since_mentioning,
                    site_id:site_id,
                    cd: siteData.cd,
                    timeset_id:timeId,
                    address:siteData.site_id
                }).then(function (data) {
                    if (data.code == 1) {
                        if (data.data.type == '0') {
                            $yikeUtils.toast('支付成功');
                            $state.go('orders');
                        } else if (data.data.type == '1') {
                            try {
                                cordova.plugins.AliPay.pay(data.data.form, function success(e) {
                                    $yikeUtils.toast('支付完成');
                                    $state.go('orders');
                                }, function error(e) {
                                    $yikeUtils.toast('支付失败');
                                    $state.go('orders');
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
                    var bag = {
                        id: '',
                        money: ''
                    };
                    localStorage.setItem('xiuGen_bag', JSON.stringify(bag));
                    flag = true;
                }).catch(function (data) {
                    $yikeUtils.toast(data.error || data.msg);
                    var bag = {
                        id: '',
                        money: ''
                    };
                    localStorage.setItem('xiuGen_bag', JSON.stringify(bag));
                    $state.go('tab.home');
                    flag = true;
                });
        }
    }
})();