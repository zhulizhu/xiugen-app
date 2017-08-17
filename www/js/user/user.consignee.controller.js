/**
 * Created by Administrator on 2016/12/15 0015.
 */
(function() {
    'use strict';
    angular.module('user.consignee.controller', [])
        .controller('ConsigneeCtrl',ConsigneeCtrl);
    ConsigneeCtrl.$inject = ['$scope', '$ionicModal', '$rootScope', '$yikeUtils', '$state'];
    function ConsigneeCtrl($scope, $ionicModal, $rootScope, $yikeUtils, $state) {
        $scope.switchP=switchP;
        $scope.switchC=switchC;
        $scope.switchCt=switchCt;
        $scope.sub=sub;
        $scope.showS=showS;
        $scope.hideS=hideS;
        init();

        $scope.contInfo={
            name:'',
            tel:'',
            address:''
        };
        $scope.allInfo={};
        var flag=true;
        function init() {
            getProvinece();
        }
        //点击,显示,隐藏
        function  showS(i){
            $(i).fadeIn();
            $('.shade').show();
        }
        function hideS(i){
            $(i).fadeOut();
            $('.shade').hide();
        }
        //选择
        function  switchP(i){
            if(!i){
                $yikeUtils.toast('网络异常');
                return false;
            }
            else {
                $scope.provineceId = i;
                getCountry();
                hideS('.con-pro');
            }
        }
        function  switchC(i){
            $scope.countryId=i;
            getCity();
            hideS('.con-city');
        }
        function switchCt(i){
            $scope.cityId=i;
            hideS('.con-country');
        }
        function getProvinece(){
            yikeShop.query('/address/get_province',{token:TOKEN}).then(function(data){
              //  console.log(data);
                $scope.provinece=data.data;
                for(var k in $scope.provinece){
                    $scope.provineceId=$scope.provinece[0];
                }
                getCountry();
                $scope.$digest();
            })
        }
        function getCountry(){
            if($scope.provineceId) {
                yikeShop.query('/address/get_country', {
                    token: TOKEN,
                    province_id: $scope.provineceId.area_id
                }).then(function (data) {
                  //  console.log(data.data);
                    $scope.country = data.data;
                    for(var k in $scope.country){
                        $scope.countryId=$scope.country[0];
                    }
                    getCity();
                    $scope.$digest();
                })
            }
        }
        function getCity(){
            if($scope.countryId) {
                yikeShop.query('/address/get_city', {
                    token: TOKEN,
                    country_id: $scope.countryId.area_id
                }).then(function (data) {
                    $scope.city = data.data;
                    for(var k in $scope.city){
                        $scope.cityId=$scope.city[0];
                    }
                    //console.log(data.data);
                    $scope.$digest();
                })
            }
        }
        function  sub(){
            if(!/^[\u4e00-\u9fa5]+$/.test($scope.contInfo.name)){
                $yikeUtils.toast('请正确输入姓名');
                return false;
            }
            if(!/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/.test($scope.contInfo.tel)||$scope.contInfo.tel==''){
                $yikeUtils.toast('请正确输入电话');
                return false;
            }
            if(!$scope.provineceId){
                $yikeUtils.toast('请选择省份');
                return false;
            }
            if(!$scope.countryId){
                $yikeUtils.toast('请选择市');
                return false;
            }
            if(!$scope.cityId){
                $yikeUtils.toast('请选择县');
                return false;
            }
            if($scope.contInfo.address==''||/^\d+$/.test($scope.contInfo.address) ){
                $yikeUtils.toast('请正确输入地址');
                return false;
            }
            var contInfo={
                name:$scope.contInfo.name,
                tel:$scope.contInfo.tel,
                add:$scope.contInfo.address,
                pro:$scope.provineceId.area_id,
                cou:$scope.countryId.area_id,
                cnt:$scope.cityId.area_id
            }
            if(flag==true) {
                flag=false;
                yikeShop.query('/address/add_address', {
                    token: TOKEN,
                    name: contInfo.name,
                    telephone: contInfo.tel,
                    address: contInfo.add,
                    province_id: contInfo.pro,
                    country_id: contInfo.cou,
                    city_id: contInfo.cnt
                }).then(function (data) {
                    $yikeUtils.toast(data.msg);
                    $state.go('tab.home');

                }).catch(function(data){
                    $yikeUtils.toast(data.msg);
                    flag=true;
                });
            }
        }
    }
})();