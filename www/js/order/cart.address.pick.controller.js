/**
 * Created by Garuda on 2017/2/15 0015.
 */
(function() {
    'use strict';
    angular.module('cart.address.pick.controller', [])
        .controller('CartAddressPick', CartAddressPick)
    CartAddressPick.$inject=["$scope","$yikeUtils","$ionicActionSheet","$state","$ionicPopup"];
    function CartAddressPick($scope, $yikeUtils, $ionicActionSheet, $state,$ionicPopup) {
        $scope.titSelect=titSelect;
       // $scope.select=select;
        var address;
        init();
        function  init(){
        }
        $scope.$on('$ionicView.afterEnter',function(){
            if(JSON.parse(localStorage.getItem('xiuGen_pickSite'))){
                $scope.check=JSON.parse(localStorage.getItem('xiuGen_pickSite')).id;
            }
            address=localStorage.getItem('xiuGen_jwd');
            getSites();
        });


        function titSelect(item){
            var confirmPopup = $ionicPopup.confirm({
                title: '是否选择当前上门自提点',
                template: '',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType:'button-default', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: 'button-energized',
            });
            confirmPopup.then(function (res) {
                if (res) {
                  var sites=item;
                  localStorage.setItem("xiuGen_pickSite", JSON.stringify(sites));
                  $state.go('cart');
                }else{
                    return;
                }
            });
        }

        //获取店铺自提点
        function getSites(){
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
                    $yikeUtils.toast('附近暂无自提点');
                    var sites="";
                    localStorage.setItem("xiuGen_pickSite", JSON.stringify(sites));
                })
        }
    }
})();