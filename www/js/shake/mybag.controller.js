/**
 * Created by Administrator on 2016/12/12 0012.
 */
(function(){
    'use strict';
    angular.module('shake.mybag.controller',[]).controller('MyBagCtrl',MyBagCtrl);
    MyBagCtrl.$inject=["$scope","$state","$ionicLoading","$yikeUtils"];
    function MyBagCtrl($scope,$state,$ionicLoading,$yikeUtils){
        $scope.select=select;
        var id=$state.params.id;
        var useMoney=$state.params.money;
        var type=$state.params.type;
        var gId=$state.params.gId;
        var isSelect=true;
        if(!useMoney){
            $scope.open=true;
            isSelect=false;
        }
        $scope.id=id;
        var status='';
        var check= '';
        switch (id){
            case '0':
                status='balance';
                break;
            case '1':
                status='weixin';
                break;
            case '2':
                status='alipay';
                break;
        }
        init();
        function  init(){
            $ionicLoading.show();
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            if(JSON.parse(localStorage.getItem('xiuGen_bag'))){
                $scope.check=JSON.parse(localStorage.getItem('xiuGen_bag')).id;
                var typeS=JSON.parse(localStorage.getItem('xiuGen_bag')).type;
                if(typeS!=type){
                    $scope.type=false;
                }else{
                    $scope.type=true;
                }
            }
            getMessage();
        });

        function  getMessage(){
            pollQuery('/packet/look_packet',TOKEN,{token:TOKEN,tab:status,usemoney:useMoney},function(data){
                $scope.mybag=data.data.list;
                $scope.$digest();
                $ionicLoading.hide();
            },function(data){
                $ionicLoading.hide();
            },function(){
                $yikeUtils.toast('请先登录');
                $state.go('login');
            })
        }

        //选择红包使用后返回
        function  select(id){
            if(isSelect==true){
                check = id.id;
                var bag = {
                    id: check,
                    money: id.money,
                    type:type
                }
                localStorage.setItem('xiuGen_bag', JSON.stringify(bag));
                if(type=='sub'){
                    $state.go('submit-order', {tid: id.id});
                    return false;
                }else{
                    $state.go('go-submit', {id:gId,tid: id.id});
                    return false;
                }
            }else{
                return false;
            }
        }
    }
})();