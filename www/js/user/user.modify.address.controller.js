/**
 * Created by Garuda on 2017/1/4 0004.
 */
(function () {
    'use strict';
    angular
        .module('user.modify.address.controller', [])
        .controller('ModifyAddressCtrl', ModifyAddressCtrl);

    ModifyAddressCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', '$ionicLoading'];
    /* @ngInject */
    function ModifyAddressCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, $ionicLoading) {
        $scope.addressId=$state.params.id;
        $scope.switchP=switchP;
        $scope.switchC=switchC;
        $scope.switchCt=switchCt;
        $scope.sub=sub;
        $scope.showS=showS;
        $scope.hideS=hideS;
        var flag=true;
        init();
        $scope.contInfo={
            name:'',
            tel:'',
            address:''
        };
        $scope.allInfo={};
        function init(){
            getProvinece();
            getMyAddress();
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
        function  getMyAddress(){
            yikeShop.query('/address/gmodify_address',{token:TOKEN,address_id:$scope.addressId})
                .then(function(data){
                    $scope.myaddress=data.data;
                   // console.log($scope.myaddress);
                    $scope.contInfo.name=$scope.myaddress.name;
                    $scope.contInfo.tel=$scope.myaddress.telephone;
                    $scope.contInfo.address=$scope.myaddress.address;
                    getProvineceTwo();
                })
                .catch(function(data){
                    $yikeUtils.toast(data.msg);
                })
        }
        function  switchP(i){
            $scope.provineceId=i;
            getCountryTwo();
            hideS('.con-pro');
        }
        function  switchC(i){
            if(!$scope.provineceId){
                $yikeUtils.toast('请先选择省');
                return;
            }
            $scope.countryId=i;
            $scope.conI = $scope.countryId;
            getCity($scope.countryId);
            hideS('.con-city');
        }
        function switchCt(i){
            $scope.cityId=i;
            $scope.citI=$scope.cityId;
            hideS('.con-country');
        }
        function getProvinece(){
            yikeShop.query('/address/get_province',{token:TOKEN})
                .then(function(data){
                $scope.provinece=data.data;
                $scope.$digest();
            })
        }
        function getProvineceTwo(){
            yikeShop.query('/address/get_province',{token:TOKEN})
                .then(function(data){
                    $scope.provinece=data.data;
                    for(var k in $scope.provinece){
                        if($scope.provinece[k].area_id==$scope.myaddress.province_id){
                            $scope.proI=$scope.provinece[k];
                        }
                    }
                    //console.log($scope.proI);
                    $scope.provineceId=$scope.proI;
                    getCountry();
                    $scope.$digest();
                })
        }
        function getCountry(){
            if($scope.provineceId) {
                yikeShop.query('/address/get_country', {token: TOKEN, province_id: $scope.provineceId.area_id})
                    .then(function (data) {
                    $scope.country = data.data;
                    for(var k in $scope.country){
                        if($scope.country[k].area_id==$scope.myaddress.country_id){
                            $scope.conI=$scope.country[k];
                        }
                    }
                    getCityTwo();
                    $scope.$digest();
                })
            }
        }
        function  getCountryTwo(){
            yikeShop.query('/address/get_country', {token: TOKEN, province_id: $scope.provineceId.area_id})
                .then(function (data) {
                    $scope.country = data.data;
                    if(!$scope.countryId) {
                        $scope.conI = $scope.country[0];
                        getCity($scope.conI);
                    }
                    $scope.$digest();
                })
        }
        function getCityTwo(){
            yikeShop.query('/address/get_city', {token: TOKEN, country_id: $scope.conI.area_id})
                .then(function (data) {
                    $scope.city = data.data;
                    for(var k in $scope.city){
                        if($scope.city[k].area_id==$scope.myaddress.city_id){
                          $scope.citI=$scope.city[k];
                        }
                    }
                    $scope.$digest();
                }).catch(function(data){
                console.log('error')
            });
        }
        function getCity(i){
            if(i) {
                yikeShop.query('/address/get_city', {token: TOKEN, country_id:i.area_id})
                 .then(function (data) {
                     $scope.city = data.data;
                     if(!$scope.cityId) {//通过判断选择框是否选择，来让显示默认值
                         $scope.citI = $scope.city[0];
                     }
                     $scope.$digest();
                 }).catch(function (data) {
                    console.log('error')
                 });
            }
        }
        function  sub(){
            setTimeout(function(){
                flag=true;
            },200);
            if($scope.contInfo.name.length<2||$scope.contInfo.name==''){
                $yikeUtils.toast('请正确输入姓名');
                return false;
            }
            if(!/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/.test($scope.contInfo.tel)||$scope.contInfo.tel==''){
                $yikeUtils.toast('请正确输入电话');
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
                pro:$scope.provineceId||$scope.proI,
                cou:$scope.countryId||$scope.conI,
                cnt:$scope.cityId||$scope.citI
            }
            if(flag==true) {
                flag=false;
               // console.log(TOKEN);
                yikeShop.query('/address/modify_address', {
                    token:TOKEN,
                    address_id:$scope.addressId,
                    name: contInfo.name,
                    telephone: contInfo.tel,
                    address: contInfo.add,
                    province_id: contInfo.pro.area_id,
                    country_id: contInfo.cou.area_id,
                    city_id: contInfo.cnt.area_id
                    }).then(function (data) {
                        $yikeUtils.toast(data.msg);
                        window.history.back();
                    })
                    .catch(function (data) {
                        $yikeUtils.toast(data.msg);
                        flag=true;
                    });
            }

        }
    }
})();