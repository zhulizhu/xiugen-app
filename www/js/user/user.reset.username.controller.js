/**
 * Created by Garuda on 2017/2/14 0014.
 */
(function(){
    'use strict';

    angular.module('user.reset.username.controller',[])
        .controller('ResetUserName',ResetUserName)
     ResetUserName.$inject=["$scope","$yikeUtils","$state"];
     function ResetUserName($scope,$yikeUtils,$state){
            $scope.person = {
                name:''
            };
            $scope.submit = submit;
            $scope.getMyInfo = getMyInfo;
            init();
            function init(){
                getMyInfo();
            };
            function getMyInfo(){
                yikeShop.query('/user/get_my_info').then(function(data){
                    $scope.info = data.data;
                });
            };
            function submit() {
                if($scope.person.name){
                    yikeShop.query('/user/username',{token:TOKEN, new:$scope.person.name})
                     .then(function(data){
                        $yikeUtils.toast(data.msg);
                        $state.go('person');
                    }).catch(function(data){
                        $yikeUtils.toast('未知错误');
                    })
                }
            }
        }
})();