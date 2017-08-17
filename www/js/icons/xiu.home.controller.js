/**
 * Created by Garuda on 2017/2/15 0015.
 */
(function() {
    'use strict';
    angular.module('xiu.home.controller', [])
        .controller('XiuHomeCtrl', XiuHomeCtrl)
    XiuHomeCtrl.$inject=["$scope","$yikeUtils","$ionicActionSheet","$state","$ionicPopup"];
    function XiuHomeCtrl($scope, $yikeUtils, $ionicActionSheet, $state, $ionicPopup) {
        $scope.select=select;
        var token="";
        token=localStorage.getItem('TOKEN');
        init();
        function init() {
        }
        if(token&&token.length>5){
            $scope.TOKEN=true;
        }else{
            $scope.TOKEN=false;
        }
        function  select(){
            try {
                window.open('http://www.aikf.com/ask/h5/ykxg.htm', '_blank', 'location=yes');
            }catch(err){
                $yikeUtils.toast('该功能暂未开放')
            }
        }
    }
})();
