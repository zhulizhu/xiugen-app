/**
 * Created by Garuda on 2017/2/9 0009.
 */
(function(){
    'use strict';
    angular.module('cart.address.controller',[]).
    controller('CartAddress',CartAddress)
    CartAddress.$inject=["$scope","$yikeUtils","$ionicPopup","$ionicLoading","$state","$rootScope"];
    function CartAddress($scope,$yikeUtils,$ionicPopup, $ionicLoading,$state,$rootScope){
        $scope.page=0;
        $scope.refresh = refresh;
        $scope.loadMore = loadMore;
        $scope.noMoreItemsAvailable=true;
        $scope.list=[];
        $scope.module={
            manage:false,
            select:false
        };
        $scope.cont_address_id=[];
        $scope.manage=manage;
        $scope.check=check;
        $scope.titSelect=titSelect;
        $scope.setDefault=setDefault;
        $scope.cancelPick=cancelPick;
        $scope.package=$state.params.package;
        var index=0;
        var flag=true;
        var vary=$state.params.vary;
        var TOKEN="";
        init();
        function init() {
            $ionicLoading.show();
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            TOKEN=localStorage.getItem('TOKEN');
            if(TOKEN&&TOKEN.length>5){
                refresh();
                isPick();
            }else{
                $yikeUtils.toast('请先登录');
                $state.go('login');
            }
        });

        //是否有自提
        function isPick(){
            if(JSON.parse(localStorage.getItem('xiuGen_pickSite'))){
                $scope.checkSiteId=JSON.parse(localStorage.getItem('xiuGen_pickSite')).id;
            }
        }

        //取消自提
        function cancelPick(){
            var confirmPopup = $ionicPopup.confirm({
                title: '确定删除自提?',
                template: '',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType:'button-default', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: 'button-energized',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    var sites={};
                    localStorage.setItem("xiuGen_pickSite", JSON.stringify(sites));
                    $scope.checkSiteId='';
                    $state.go('cart');
                } else {
                    return;
                }
            });
        }

        //管理地址
        function manage(){
          if($scope.module.manage){
              $scope.module.manage=false;
              return false;
          }else{
              $scope.module.manage=true;
              return false;
          }
        }
        //点击选择
        function check(item,$event){
            var length=$('.checkbox-one').length;
            for(var j=0;j<length;++j){
               if($('.checkbox-one').eq(j).is(':checked')){
                   $scope.module.select=true;
                   break;
               }else{
                   $scope.module.select=false;
               }
            }
        }
        //确认删除
        function  deleteAddress(){
            var length=$('.checkbox-one').length;
            for(var j=length-1;j>=0;j--){
                if($('.checkbox-one').eq(j).is(':checked')){
                    var i=j;
                    var parent=$('.checkbox-one')[i].parentNode.parentNode.parentNode;
                    //$(parent).remove();
                    var id=$('.checkbox-one')[i].value;
                    delMore(id);
                    $(parent).remove();
                    //console.log(id);
                }
            }
        }
        //删除提示
        function titSelect(){
            var confirmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '确定删除地址？',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType:'button-default', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确认', // String (默认: 'OK')。OK按钮的文字。
                okType: 'button-energized',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    deleteAddress();
                } else {
                    return;
                }
            });
        }

        //下拉刷新
        function refresh() {
            $scope.list=[];
            $scope.page = 0;
            getCartAddress();
        }

        //上拉加载
        function loadMore() {
           getCartAddress();
        }
        //获取地址列表
        function  getCartAddress() {
            var address=localStorage.getItem('xiuGen_jwd');
            if (flag == true) {
                flag=false;
                yikeShop.query('/address/lists', {token: TOKEN,address:address})
                    .then(function (data) {
                        $ionicLoading.hide();
                        if ($scope.page == 0) {
                            $scope.list = data.data;
                        } else {
                            if ($scope.list == data.data) {
                                $scope.list = data.data;
                            } else {
                                $scope.list = $scope.list.concat(data.data);
                            }
                        }
                        $scope.page++;
                        flag=true;
                        $scope.noMoreItemsAvailable = $scope.list.length >= Number(data.data.num);
                        $scope.$digest();
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
                    .catch(function (data) {
                        $ionicLoading.hide();
                        flag=true;
                        $scope.noMoreItemsAvailable = true;
                        $scope.$digest();
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
            }
        }
        //设置默认地址
        function  setDefault(item){
           if(item.default==1){
               return false;
           }
           else if(item.cd>=0){
               yikeShop.query('/address/defaults',{token:TOKEN,id:item.id})
                   .then(function(data){
                       $yikeUtils.toast(data.msg);
                       if(vary){
                           $rootScope.$ionicGoBack();
                           //$state.go('cart',{vary:true});
                           return false;
                       }
                       refresh();
                   })
                   .catch(function(data){
                      $yikeUtils.toast(data.msg);
                   });
           }else{
                $yikeUtils.toast('该地址已超出配送范围了哦');
           }
        }
        //删除地址
        function delMore(id){
            yikeShop.query('/address/delete',{token:TOKEN,id:id})
                .then(function(data){
                   $yikeUtils.toast('删除成功!')
                })
                .catch(function(data){
                   $yikeUtils.toast('删除失败');
                })
        }
    }
})();
