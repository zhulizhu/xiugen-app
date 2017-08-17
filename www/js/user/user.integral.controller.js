/**
 * Created by Garuda on 2017/1/16 0016.
 */
(function() {
    'use strict';
    angular.module('user.integral.controller', [])
        .controller('Integral', Integral);
    Integral.$inject=["$scope","$ionicLoading"];
    function Integral($scope,$ionicLoading) {
        // $scope.choose=$scope.address.
        $scope.page=0;
        $scope.refresh = refresh;
        $scope.loadMore = loadMore;
        $scope.list=[];
        $scope.noMoreItemsAvailable=true;
        var index=0;
        var flag=true;
        init();
        function init() {
            $ionicLoading.show();
        }


        $scope.$on('$ionicView.beforeEnter',function(){
            getIntegral();
        });

        //下拉刷新
        function refresh() {
            $scope.list=[];
            $scope.page = 0;
            getIntegral();
        }

        //上拉加载
        function loadMore() {
            if(index==1) {
                getIntegral();
            }
        }

        function  getIntegral() {
            if (flag == true) {
                flag=false;
                yikeShop.query('/user/points', {token: TOKEN, page: $scope.page})
                    .then(function (data) {
                        $scope.allPoint = data.data.return_points;
                        //console.log(data.data.points);
                        if ($scope.page == 0) {
                            $scope.list = data.data.points;
                        } else {
                            if ($scope.list == data.data) {
                                $scope.list = data.data.points;
                            } else {
                                $scope.list = $scope.list.concat(data.data.points);
                            }
                        }
                        $scope.page++;
                        index = 1;
                        flag=true;
                        $scope.noMoreItemsAvailable = $scope.list.length >= Number(data.data.num);
                        $scope.$digest();
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $ionicLoading.hide();
                    })
                    .catch(function (data) {
                        $ionicLoading.hide();
                        flag=true;
                        $scope.noMoreItemsAvailable = true;
                        $scope.$digest();
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
            }
        }
    }
})();