/**
 * Created by Garuda on 2017/1/5 0005.
 */
(function () {
    'use strict';
    angular
        .module('delivery.count.controller', [])
        .controller('DeliveryCountCtrl', DeliveryCountCtrl);
    /* @ngInject */
    DeliveryCountCtrl.$inject=["$scope","$yikeUtils","$state","$ionicPopup","$ionicLoading"];
    function DeliveryCountCtrl($scope, $yikeUtils, $state, $ionicPopup,$ionicLoading) {
        var template,cancelType,okType;
        var meal={
            id:$state.params.id,
            oid:$state.params.oid,
            count:$state.params.count,
            start:$state.params.start,
            end:$state.params.end
        };
        var date=(new Date()).Format("yyyy/MM/dd");
        init();
        var flag=true;
        function  init(){
            $ionicLoading.show();
            getDistribution();
        }
         /*$scope.$on('$ionicView.beforeEnter',function(){
             getDistribution();
             //$scope.doRefresh();
         })*/

        function showConfirm(i) {
            if(flag==true) {
                var time = i;
                flag=false;
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: template,
                    cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                    cancelType: cancelType, // String (默认: 'button-default')。取消按钮的类型。
                    okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                    okType: okType,
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        saveTime(time);
                        //  window.location.reload();
                    } else {
                        getDistribution();
                        return;
                    }
                });
            }
        };
        //获取已点击
        function getDistribution(){
            yikeShop.query('/Package/get_distribution',{token:TOKEN,goods_id:meal.id,order_id:meal.oid,status:1})
                .then(function(data){
                    $scope.data=data.data;
                    getTime();
                    $scope.$digest();
                    flag=true;
                    $ionicLoading.hide();
                    //console.log(data);
                })
                .catch(function(data){
                    //console.log(data);
                    flag=true;
                    $scope.data=[];
                    getTime();
                    $ionicLoading.hide();
                });
        }
        //点击事件
        function getTime(){
            $('#caT').remove();
            $('#demo').append('<div id="caT"></div>');
                $('#caT').calendar({
                    width: 320,
                    height: 320,
                    data: $scope.data,
                    selectedRang: [date],
                    onSelected: function (view, date, data) {
                        //saveTime(date.getTime());
                        //console.log(typeof(date));
                        if (this.innerHTML.length <= 2) {
                            template = '您确定要增加这次配送？';
                            okType = 'button-energized';
                            cancelType = 'button-default';
                            if(meal.count<=0){
                                return false;
                            }
                            showConfirm(Math.floor(+new Date(date).getTime()/1000));
                            //console.log(showConfirm(Math.floor(+new Date(date).getTime()/1000)));
                            return;
                        } else if (this.innerHTML.match('配送')) {
                            template = '您确定要取消这次配送？';
                            cancelType = 'button-energized';
                            okType = 'button-default';
                            showConfirm(Math.floor(+new Date(date).getTime()/1000));
                            return;
                        } else {
                            return;
                        }
                    }
                });

        }

        //保存时间
        function saveTime(i){
            var time=i;
            yikeShop.query('/Package/save_distribution',{token:TOKEN,goods_id:meal.id,order_id:meal.oid,stime:time})
                .then(function(data){
                    $yikeUtils.toast(data.msg);
                    getDistribution();
                })
                .catch(function(data){
                    $yikeUtils.toast(data.msg);
                })
        }
    }
})();