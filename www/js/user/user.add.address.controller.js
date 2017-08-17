/**
 * Created by Garuda on 2016/12/14 0014.
 */
(function(){
    'use strict';
    angular.module('user.add.address.controller',[])
        .controller('AddressCtrl',AddressCtrl);
    AddressCtrl.$inject=["$scope","$yikeUtils","$state","$ionicPopup"];
    function  AddressCtrl($scope,$yikeUtils,$state,$ionicPopup){
        init();
        $scope.select=select;
        $scope.select2=select2;
        $scope.delAddress=delAddress;
        $scope.status=1;
        $scope.addList=[];
       // $scope.choose=$scope.address.
         function init(){
             getAddress();
         }

         function  select(i){//选择方式
             $scope.status=i;
             getSites();
             //console.log(i);
         }
        function  select2(i){
            $scope.choose=i;
           // console.log( $scope.choose);
            yikeShop.query('/address/set_default',{token:TOKEN,address_id:$scope.choose}).then(function(data){
                $yikeUtils.toast(data.msg);
                getAddress();
                $scope.$digest();
            })
        }
        function getAddress(){
            yikeShop.query('/address/get_address',{token:TOKEN}).then(function(data){
                $scope.address=data.data;
                console.log($scope.address);
                //console.log(data);
                $scope.$digest();
            });
        }

        //获取店铺自提点
        function getSites(){
            var address=localStorage.getItem('xiuGen_jwd');
            yikeShop.query('/sites/index',{address:address})
                .then(function (data) {
                    $scope.sites = data.data.list;
                    for(var k in $scope.sites){
                        var string=$scope.sites[k].address;
                        string=string.replace(/,/g,'');
                        string=string.replace(/ /g,'');
                        $scope.sites[k].address=string;
                    }
                    $scope.ztFT=$scope.sites.length>data.data.num;
                    // $scope.addList=$scope.addList.concat($scope.addList);
                    $scope.$digest();
                })
                .catch(function (data) {
                    $yikeUtils.toast('网络异常');
                })
        }

        //删除地址
        function delAddress(id){
            yikeShop.query('/address/delete_address',{token:TOKEN, address_id:id})
                .then(function(data){
                    $yikeUtils.toast(data.msg);
                    getAddress();
                }).catch(function(data) {
                    $yikeUtils.toast(data.msg);
                });
        }

        //删除提示
        $scope.titleTip=function(id){
            var id=id;
            var confirmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '确定删除地址？',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType:'button-energized', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: 'button-default',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    delAddress(id);
                } else {
                    return;
                }
            });
        }
    }
})();