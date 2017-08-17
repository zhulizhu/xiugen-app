/**
 * Created by Administrator on 2017/1/19 0019.
 */
(function(){
    'use strict';
    angular.module('refund.list',[])
        .controller('RefundList',RefundList)
        RefundList.$inject=['$scope','$yikeUtils','$ionicLoading','$timeout','$state'];
        function RefundList($scope,$yikeUtils,$ionicLoading,$timeout,$state){
            $scope.page=0;
            $scope.refresh = refresh;
            $scope.loadMore = loadMore;
            $scope.offShop=offShop;
            $scope.olist=[];
            var index=0;
            var flag=true;
            init();
            function init(){
                $ionicLoading.show();
                getRefundList();
            };

            //申请退款
            function offShop(id,gid){
                $state.go('refund-reason',{id:id,status:gid});
            }

            //下拉刷新
            function refresh() {
                $scope.page = 0;
                $scope.olist=[];
                getRefundList();
            }

            //上拉加载
            function loadMore() {
                if(index==1){
                    getRefundList();
                }
            }

            function getRefundList(){
                if (flag == true) {
                    flag=false;
                    yikeShop.query('/order/ajax_order_list', {status:2, page: $scope.page})
                        .then(function (data) {
                                if ($scope.page == 0) {
                                    $scope.oList = AV._.values(data.data.list);
                                } else {
                                    $scope.oList=$scope.oList.concat(AV._.values(data.data.list));
                                }
                                $scope.page++;
                                $scope.noMoreItemsAvailable = $scope.oList.length>=Number(data.data.num);
                                if(!$scope.oList.length){
                                  $scope.noMoreItemsAvailable =true;
                                }
                                $scope.$broadcast('scroll.refreshComplete');
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                flag=true;
                                index=1;
                                $ionicLoading.hide();
                                $scope.$digest();
                        })
                        .catch(function (data) {
                                $scope.oList=[];
                                $scope.noMoreItemsAvailable = true;
                                $scope.$digest();
                                $scope.$broadcast('scroll.refreshComplete');
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                flag=true;
                                $ionicLoading.hide();
                        });
                }
            }

           /* function getRefundList() {
                if (flag == true) {
                    flag=false;
                    yikeShop.query('/order/refund_list')
                        .then(function (data) {
                            console.log(data);
                            $scope.values = (data.data.list);
                            if ($scope.page == 1) {
                                $scope.list = $scope.values;
                            } else {
                                if ($scope.list == data.data.list) {
                                    $scope.list = $scope.values;
                                } else {
                                    $scope.list = $scope.list.concat($scope.values);
                                }
                            }
                            $scope.noMoreItemsAvailable = $scope.list.length >= Number(data.data.num);
                            $scope.page++;
                            index = 1;
                            flag=true;
                            $scope.$digest();
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        })
                        .catch(function (data) {
                            flag=true;
                            $scope.noMoreItemsAvailable = true;
                            $scope.$digest();
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                }
            }*/
        }
})();
