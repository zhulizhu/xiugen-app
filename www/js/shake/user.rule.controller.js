/**
 * Created by Administrator on 2016/12/12 0012.
 */
(function(){
    'use strict';
    angular.module('shake.user_rule.controller',[]).controller('UserRuleCtrl',UserRuleCtrl);
    UserRuleCtrl.$inject = ['$scope','$ionicModal'];
    function UserRuleCtrl($scope,$ionicModal){
        init();
        function  init(){
            getMessage();
        }
       function  getMessage(){
           yikeShop.query('/packet/use_rules',{token:TOKEN,id:4}).then(function(data){
               console.log(TOKEN);
               $scope.rule=data.data;
               console.log($scope.rule);
           })
       }
    }
})();