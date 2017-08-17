/**
 * Created by frank on 2016/9/8.
 */
(function () {
    'use strict';

    angular
        .module('user.scheme.controller', [])
        .controller('UserSchemeCtrl', UserSchemeCtrl);

    UserSchemeCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicPopup','$ionicLoading'];
    /* @ngInject */
    function UserSchemeCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicPopup,$ionicLoading){
        $scope.user=localStorageService.get('user');
        $scope.playingMethod='ssc';
        $scope.selectPlayingMethod=selectPlayingMethod;
        $scope.deleteCollect=deleteCollect;
        init();
        function init() {
            myCollect();
        }
        //我收藏的方案
        function myCollect() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        yikeTaishan.myCollect('my_collection',$scope.playingMethod,$scope.user.id)
                            .then(function (data) {
                                $ionicLoading.hide();
                                if(data.status == 1){
                                    $scope.collect=data.result.collection;
                                    $scope.$digest();
                                }else{
                                    $scope.collect=[];
                                    $yikeUtils.toast(data.result.collection);
                                }
                            })
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: '提示',
                            template: data.result.result,
                            buttons:[{
                                text:'确定',
                                type: 'button-positive'
                            }]
                        });
                        alertPopup.then(function() {
                            $ionicLoading.hide();
                            // localStorageService.remove('user');
                            $state.go('login')
                        });
                    }
                })
        }
        //选择玩法
        function selectPlayingMethod() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            myCollect();
        }
        //删除收藏
        function deleteCollect(id,index) {
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        var comfirmPopup=$ionicPopup.confirm({
                            title:'删除收藏方案',
                            template:'确认要删除？',
                            okText:'确定',
                            cancelText:'取消'
                        });
                        comfirmPopup.then(function(res) {
                            if (res) {
                                $ionicLoading.show({
                                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                                });
                                yikeTaishan.deleteCollect('delete',$scope.playingMethod,id)
                                    .then(function (data) {
                                        $ionicLoading.hide();
                                        $yikeUtils.toast(data.result.result);
                                        if(data.status == 1){
                                            $scope.collect.splice(index,1);
                                        }
                                        $scope.$digest();
                                    })
                            }
                        });
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: '提示',
                            template: data.result.result,
                            buttons:[{
                                text:'确定',
                                type: 'button-positive'
                            }]
                        });
                        alertPopup.then(function() {
                            $ionicLoading.hide();
                            // localStorageService.remove('user');
                            $state.go('login')
                        });
                    }
                })
        }
    }
})();