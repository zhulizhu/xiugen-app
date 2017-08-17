(function () {
    'use strict';

    angular
        .module('order.list.controller', [])
        .controller('OrderListCtrl', OrderListCtrl);
    /* @ngInject */
    OrderListCtrl.$inject=["$scope","$yikeUtils","$state","$ionicPopup","$ionicLoading","$timeout","$ionicScrollDelegate"];
    function OrderListCtrl($scope, $yikeUtils, $state, $ionicPopup,$ionicLoading,$timeout,$ionicScrollDelegate) {
        $scope.data={
            status:$state.params.status||0,
            page:0
        }
        $scope.getSelect=getSelect;
        $scope.goPay=goPay;
        $scope.delOrder=delOrder;
        $scope.affirm=affirm;
        $scope.celOrder=celOrder;
        $scope.offShop=offShop;
        $scope.refresh = refresh;
        $scope.loadMore = loadMore;
        $scope.oList=[];
        var flag=true;
        var index=0;
        init();
        function init() {
        }
        $scope.$on('$ionicView.afterEnter',function(){
            $ionicLoading.show();
            getOrders();
        });

        //下拉刷新
        function refresh() {
            $scope.oList=[];
            $scope.data.page = 0;
            getOrders();
        }

        //上拉加载
        function loadMore() {
            if(index==1) {
                getOrders();
            }
        }


        //获取列表
        function  getSelect(i){
            $ionicLoading.show();
            $scope.oList=[];
            $scope.data.page = 0;
            index=0;
            $scope.data.status=i;
            $ionicScrollDelegate.resize();
            getOrders();
        }

        //去支付
        function  goPay(id){
            $state.go('go-submit',{id:id})
        }

        //删除订单
        function  delOrder(i,id){
            var parent=i.target.parentNode.parentNode.parentNode;
            console.log(prompt('确认删除订单？','button-energized','button-default',parent,delOrderX));
            function delOrderX() {
                yikeShop.query('/order/del_order', {token: TOKEN, oid: id})
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                    })
                    .catch(function (data) {
                        $yikeUtils.toast(data.msg);
                    });
            }
        }


        //确认收货
        function  affirm(id){
            yikeShop.query('/order/confirm_receipt',{token:TOKEN,oid:id})
                .then(function(data){
                   $yikeUtils.toast(data.msg);
                    $scope.oList=[];
                    $scope.data.page = 0;
                    getOrders();
                    $scope.$digest();
                })
                .catch(function(data){
                   console.log(data);
                });
        }

        //取消订单
        function  celOrder(){
            yikeShop.query('',{token:TOKEN})
                .then(function(data){

                })
                .catch(function(data){

                });
        }

        //申请退款
        function offShop(id,gid){
            $state.go('refund-reason',{id:id,status:gid});
        }

        //弹出提示
        function prompt(tmp,cel,okt,fn,fnf){
            var confirmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: tmp,
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType:cel, // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: okt //'button-energized'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $(fn).remove();
                    fnf();
                    //  window.location.reload();
                } else {
                    return false;
                }
            });
        }

        function getOrders() {
            if (flag == true) {
                flag=false;
                yikeShop.query('/order/ajax_order_list', {status: $scope.data.status, page: $scope.data.page})
                    .then(function (data) {
                        $timeout(function(){
                            if ($scope.data.page == 0) {
                                $scope.oList = AV._.values(data.data.list);
                                console.log($scope.oList);
                            } else {
                                    //$scope.oList = $scope.oList.concat(4,5);
                                    $scope.oList=$scope.oList.concat(AV._.values(data.data.list));
                            }
                            $scope.data.page++;
                            $scope.noMoreItemsAvailable = $scope.oList.length>=Number(data.data.num);
                            if(!$scope.oList.length){
                                $scope.noMoreItemsAvailable =true;
                            }
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            index=1;
                            flag=true;
                            $ionicLoading.hide();
                            $scope.$digest();
                        },500);
                    })
                    .catch(function (data) {
                        $timeout(function(){
                            $scope.noMoreItemsAvailable = true;
                            $scope.$digest();
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            flag=true;
                            $ionicLoading.hide();
                        },500);
                    });
            }
        }
    }
})();