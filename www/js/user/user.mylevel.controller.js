/**
 * Created by Garuda on 2017/1/18 0018.
 */
(function() {
    'use strict';
    angular.module('user.mylevel.controller', [])
        .controller('Level', Level);
    Level.$inject = ['$scope', '$ionicModal', '$rootScope', '$yikeUtils', '$state'];
    function Level($scope, $ionicModal, $rootScope, $yikeUtils, $state) {

        init();

        function init() {
          getLevel();
        }

        function  getLevel(){
            yikeShop.query('/user/grade')
                .then(function(data){
                    $scope.Level=data.data;
                    $scope.$digest();
                })
                .catch(function(data){
                    console.log(data);
                })
        }
    }
})();