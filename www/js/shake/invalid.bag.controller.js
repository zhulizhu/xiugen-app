/**
 * Created by Garuda on 2016/12/12 0012.
 */
(function(){
    'use strict';
    angular.module('shake.invalid.bag.controller',[])
        .controller('InvalidBagCtrl',InvalidBagCtrl);
    InvalidBagCtrl.$inject=["$scope"];
    function InvalidBagCtrl($scope){
        init();
        function  init(){
            getMessage();
        }
        function  getMessage(){
            yikeShop.query('/packet/failure_packet',{token:TOKEN}).then(function(data){
                $scope.mybag_fail=data.data.list;
               // console.log(data.data);
                $scope.$digest();
            })
        }
    }
})();