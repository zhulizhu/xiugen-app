/**
 * Created by Garuda on 2017/1/6 0006.
 */
(function () {
    'use strict';

    angular
        .module('package.controller', [])
        .controller('PackageCtrl', PackageCtrl);

    PackageCtrl.$inject = ['$scope', '$yikeUtils', '$state'];
    /* @ngInject */
    function PackageCtrl($scope, $yikeUtils, $state) {
        $scope.data = {};
        $scope.getSelect = getSelect;
        $scope.index=0;
        $scope.parentIndex=0;
        init();

        function init() {
            getPackage();
        }
        function getPackage() {
            pollQuery('/Package/package_list',TOKEN,{token: TOKEN},function(data){
                $scope.category = data.data;
                /* for (var i = 0; i < $scope.category.length; i++) {
                 var obj = $scope.category[i];
                 var id = obj.id;
                 getList(id);
                 }*/
                $scope.$digest();
            },function(data){
                console.log(data);
            },function(){
                $yikeUtils.toast('请先登录');
                $state.go('login');
            })
        }
        function getSelect(i) {
            $scope.parentIndex = this.$parent.$index;
            $scope.index = this.$index;
            $scope.pid= i.id;
        }
    }
})();