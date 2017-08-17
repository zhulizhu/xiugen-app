(function(){
    'use strict';
    angular.module('recharge.controller',[])
        .controller('RechargeCtrl',RechargeCtrl);
    RechargeCtrl.$inject= ['$scope','$ionicModal','$rootScope','$yikeUtils','$state'];
    function  RechargeCtrl($scope,$ionicModal,$rootScope,$yikeUtils,$state){

        $scope.select=select;
        $scope.select2=select2;
        $scope.sub=sub;
        $scope.getMoney=getMoney;
        $scope.status=100;
        $scope.zhifu=10;
        var TOKEN="";
        $scope.oth_money={
            mon:''
        };
        init();
        function  init(){
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            TOKEN = localStorage.getItem('TOKEN');
            if(TOKEN) {
                if (TOKEN&&TOKEN.length < 5) {
                    $yikeUtils.toast('请登录');
                    $state.go('login');
                }
            }else{
                $yikeUtils.toast('请登录');
                $state.go('login');
            }
        });

        function  select(i){//选择金额
            $scope.status=i;
            $scope.oth_money.mon='';
        }
        function  select2(j){//选择支付方式
            $scope.zhifu=j;
        }

        //键盘限制
        function getMoney(){
            if(!isNaN($scope.oth_money.mon)) {
                if(/[1-9]?[0-9]*\.[0-9]*$/.test($scope.oth_money.mon)){
                    if ($scope.oth_money.mon < 0.01) {
                        $yikeUtils.toast('金额太小');
                        return false;
                    }
                }
            }else{
                $yikeUtils.toast('请输入数字');
                return false;
            }
        }

        function  sub(){
            if($scope.oth_money.mon==''&&$scope.status==''){
                $yikeUtils.toast('未选择支付金额!');
                return;
            }else if(isNaN($scope.oth_money.mon)){
                $yikeUtils.toast('请输入数字');
                return false;
            }
            $scope.oth_money.mon = Number($scope.oth_money.mon).toFixed(2);
            $state.go('top-sure',({'money':$scope.status||$scope.oth_money.mon,'type':$scope.zhifu}));
        }
    }
})();