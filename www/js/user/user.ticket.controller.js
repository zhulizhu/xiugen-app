/**
 * Created by Garuda on 2017/1/18 0018.
 */
(function() {
    'use strict';
    angular.module('user.ticket.controller', [])
        .controller('MyTicketCtrl',MyTicketCtrl);
    MyTicketCtrl.$inject=["$scope","$yikeUtils","$state","$ionicActionSheet","$ionicPopup","$ionicModal",'$filter'];
    function MyTicketCtrl($scope, $yikeUtils, $state,$ionicActionSheet,$ionicPopup,$ionicModal,$filter) {
        $scope.date = [];
        $scope.open = open;
        $scope.selectTime =  selectTime;
        init();
        //选中门票 参数分别：开始时间，结束时间，门票id,门票类型id
        function open(s_time,e_time,id,type_id) {
            filterTime(s_time,e_time,id,type_id);
            $scope.openModal();
        };
        function init() {
            $ionicModal.fromTemplateUrl('select.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (share) {
                $scope.shareModal = share;
            });
            $scope.openModal = function () {
                $scope.shareModal.show();
            };
            $scope.closeModal = function () {
                $scope.shareModal.hide();
            };
            getTicketList();
        };
        function getTicketList(){
            yikeShop.query('/Ticket/get_list').then(function(data){
                $scope.info = data.data;
                $scope.$digest();
            }).catch(function(data){
                $yikeUtils.toast(data.msg);
            })
        };
        //过滤时间生成date数组 is_verify
        function filterTime(start,end,id,type_id) {
            var s_time = $filter('date')(start*1000,'yyyy-MM-dd');
            var e_time = $filter('date')(end*1000,'yyyy-MM-dd');
            var c_days = DateDiff(s_time,e_time);
            console.log(c_days);
            for( var i = 0; i <=c_days;i++ ){
                   $scope.date[i] = {
                       name:$filter('date')(start*1000 + i *86400000,'yyyy-MM-dd'),
                       time:start*1000 + i *86400000,
                       id:id,
                       type_id:type_id
                   };
            }
        };
        //计算时间差转换成天数
        function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式
            var  aDate,  oDate1,  oDate2,  iDays;
            aDate  =  sDate1.split("-");
            oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);   //转换为12-18-2002格式
            aDate  =  sDate2.split("-");
            oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
            iDays  =  parseInt((Math.abs(oDate2 - oDate1)  /  1000  /  60  /  60  /24));   //把相差的毫秒数转换为天数
            return  iDays
        };
        function selectTime(name,time,id,type_id){
            yikeShop.query('/Ticket/subscribe_ticket',{
                time: Math.ceil(time / 1000) ,
                id:id,
                type_id:type_id
            }).then(function(data){
                $scope.closeModal();
                getTicketList();
                $scope.$digest();
                $yikeUtils.toast(data.msg);
            }).catch(function(data){
                $scope.closeModal();
                $yikeUtils.toast(data.msg);
                $scope.$digest();
            })
        };
    }
})();