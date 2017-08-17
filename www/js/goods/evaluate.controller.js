/**
 * Created by Garuda on 2017/1/17 0017.
 */
(function() {
    'use strict';
    angular.module('evaluate.controller', [])
        .controller('EvaluateCtrl', Evaluate);
    Evaluate.$inject = ['$scope', '$ionicModal', '$rootScope', '$yikeUtils', '$state'];
    function Evaluate($scope, $ionicModal, $rootScope, $yikeUtils, $state) {
        var id=$state.params.id;
        var oid=$state.params.oid;
        var flag=true;
        $scope.payload={
         star:5,
         cont:'',
         name:''
        };
        $scope.evaluate=evaluate;
        $scope.select=select;
        init();
        function  init(){
            getDetail(id);
        }

        function getDetail(id) {
            yikeShop.query('/goods/detail', {id: id})
                .then(function (data) {
                    $scope.data = data.data;
                }).catch(function(data){
                    console.log(data);
            })

        }
        function  select(){
            if($scope.payload.name=='匿名'){
                $scope.payload.name='';
                return false;
            }else{
                $scope.payload.name='匿名';
            }
        }
        function  evaluate(){
            if(flag==true){
                flag=false;
            if($scope.payload.cont==''){
                $yikeUtils.toast('请输入评价');
                return false;
            }
            yikeShop.query('/goods/evaluation_add',{token:TOKEN,goods_id:id,oid:oid,star:$scope.payload.star,content:$scope.payload.cont,nickname:$scope.payload.name})
                .then(function(data){
                   $yikeUtils.toast(data.msg);
                   $state.go('tab.home');
                })
                .catch(function(data){
                  $yikeUtils.toast(data.msg);
                    flag=true;
                });
            }
        }
    }
})();