(function () {
    'use strict';

    angular
        .module('order.cart.controller', [])
        .controller('OrderCartCtrl', OrderCartCtrl);

    /* @ngInject */
    OrderCartCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$rootScope','$ionicModal'];
    function OrderCartCtrl($scope, $yikeUtils, $state, $rootScope,$ionicModal) {
        var aid = 0;
        $scope.data = {};
        $scope.add = add;
        $scope.remove = remove;
        //$scope.sendTime=sendTime;
        $scope.selected=selected;
        $scope.cartSelect=cartSelect;
        $scope.submitOrder=submitOrder;
        $scope.change=change;
        $scope.addExits=false;
        $scope.timeSelect='';
        var siteId=true;//判断是否自提
        var cd='';
        var TOKEN='';
        init();
        function init() {
            getTime();
            template();
        }

        function  template() {
            //模态窗口
            $ionicModal.fromTemplateUrl('templates/modal/detail-delivery.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
        };
        //键盘事件
        function  change(item){
            console.log(item.quantity);
            if(item.quantity%1==0&&item.quantity){
                //update(item);
                getDetail(item);
                console.log('te');
            }else if(item.quantity%1!=0&&!isNaN(item.quantity)){
                item.quantity=Math.ceil(item.quantity);
                console.log('tes');
                //update(item);
                getDetail(item);
            }else if(item.quantity){
                $yikeUtils.toast('请输入数字!');
                item.quantity=1;
            }
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.addExits=false;
            TOKEN=localStorage.getItem('TOKEN');
            if(TOKEN&&TOKEN.length>5){
                getCartAddress();
            }else{
                $yikeUtils.toast('请先登录');
                $state.go('login');
            }
        });
        //是否选择商品
        function cartSelect(i){
            var item;
            $scope.cartImg=(document.querySelectorAll('.col-33'));
            item=this.$index;
            if($scope.cartImg[item].className.match('rkf')){
                $scope.cartImg[item].className=$scope.cartImg[item].className.replace(' rkf',' rkg');
                i.itemx='true';
            }else{
                $scope.cartImg[item].className=$scope.cartImg[item].className.replace(' rkg',' rkf');
                i.itemx='false';
            }
            yikeShop.query('/cart/select',{cart_id: i.cart_id})
                .then(function(data){
                    getCart();
                    $scope.$digest();
                })
                .catch(function(data){
                   //console.log(data);
                });
            //console.log(i);
        }

        function calc() {
            var totalPrice = 0;
            var goods = $rootScope.cart.goods;
            for (var i = 0; i < goods.length; i++) {
                var obj = goods[i];
                totalPrice += obj.price * obj.quantity;
            }
            $scope.cart.total_price = totalPrice;
            console.log($scope.cart.total_price);
            $scope.$digest();
        };

        function getCart() {
            if(siteId){
                var site_id= localStorage.getItem("xiuGen_sites");
            }
            if($scope.data.address){
                cd=$scope.data.address.cd;
            }
            yikeShop.query('/cart/index',{since_mentioning:0,cd:cd,site_id:site_id})
                .then(function (data) {
                    $rootScope.cart = data.data;
                    console.log($rootScope.cart);
                    aid = $rootScope.cart.address_id;
                   // console.log(data.data);
                    if($rootScope.cart.goods.length<=0){
                        $yikeUtils.toast('购物车太空了，去选购一些吧');
                    }
                    //getAddress();
                    $scope.$digest();
                })
        }

        function  getCartAddress() {
            var address=localStorage.getItem('xiuGen_jwd');
            if(JSON.parse(localStorage.getItem('xiuGen_pickSite'))){
                $scope.checkSiteId=JSON.parse(localStorage.getItem('xiuGen_pickSite')).id;
                if($scope.checkSiteId>=0){
                    siteId=false;
                    $scope.addExits=true;
                    console.log('test');
                }
            }
                yikeShop.query('/address/lists', {token: TOKEN,address:address})
                    .then(function (data) {
                        var list_address = data.data;
                        for(var k in list_address){
                            if(list_address[k].default==1&&list_address[k].cd>=0){
                                $scope.data.address=list_address[k];
                                $scope.addExits=true;
                                break;
                            }
                        }
                        getCart();
                        $scope.$digest();
                    })
                    .catch(function (data) {
                        //console.log(data);
                        getCart();
                        $scope.addExits=false;
                    })
        }


        //获取上门时间
        function  getTime(){
                yikeShop.query('/time/door_time',{token:TOKEN})
                    .then(function(data){
                        console.log(data);
                        $scope.getTime=data.data;
                        console.log($scope.getTime);
                    })
                    .catch(function(data){
                       console.log(data);
                    });
        }

        //选择上门时间
        function  selected(i,x){
            var itemx,item;
            $scope.timeSelect= i.id;
            //console.log(i.status);
            $scope.timeActive=document.querySelector('.delivery-cont');
            itemx=$scope.timeActive.querySelectorAll('.item');
            item=this.$index;
            if(itemx[item].className.match('tActive')){
                return;
            }else{
                for (var j = 0; j < itemx.length; ++j) {
                    itemx[j].className = 'item';
                }
                itemx[item].className+=' tActive';
                $scope.realSendTime=(itemx[item].innerHTML);
            }
            $scope.closeModal();
        }

       /* //确定上门时间
        function  sendTime(){
           if($scope.timeSelect){
               yikeShop.query('/time/user_door_time',{token:TOKEN,id:$scope.timeSelect})
                   .then(function(data){
                      $yikeUtils.toast(data.msg);
                   })
                   .catch(function(data){
                      $yikeUtils.toast(data.msg);
                   });
           }
            $scope.closeModal();
        }*/


        //获取数量
        function getDetail(item) {
            yikeShop.query('/goods/detail', {id: item.goods_id})
                .then(function (data) {
                    $scope.data = data.data;
                    $scope.data.sl=data.data.goods.quantity;
                    if ($scope.data.sl == 0) {
                        $yikeUtils.toast('商品暂无库存!');
                        remove(item);
                        return false;
                    }
                    else if (item.quantity >= $scope.data.sl) {
                        item.quantity = $scope.data.sl;
                        $yikeUtils.toast('超出商品库存!');
                        return false;
                    }else if(item.quantity==0){
                        remove(item);
                        return false;
                    }
                    else{
                        item.quantity++;
                        update(item);
                    }
                    $scope.$digest();
                }).catch(function(data){
                    console.log(data);
                })

        }

        //添加,移除，更新
        function add(item) {
            getDetail(item);
        }

        function remove(item) {
            if (item.quantity > 0) {
                item.quantity--;
                if (item.quantity == 0) {
                    yikeShop.query('/cart/remove_by_goods_id', item)
                      .then(function (data) {
                         //$yikeUtils.toast(data.data.success);
                         getCart();
                      })
                } else {
                    update(item);
                }
                return false;
            }else{
                yikeShop.query('/cart/remove_by_goods_id', item)
                    .then(function (data) {
                        getCart();
                        $scope.$digest();
                       //getCart();
                    })
            }
        }

        function update(item) {
            var payload = item;
            if (payload.quantity > 0) {
                yikeShop.query('/cart/add', payload)
                    .then(function (data) {
                        calc();
                    }).catch(function(data){
                        $yikeUtils.toast(data.error);
                        getCart();
                    })
            }
        }

        //结账
        function submitOrder(i,id){
            if($scope.addExits==false){
              $yikeUtils.toast('请选择收货地址');
              return false;
            }
            else if(i>0){
                var bag={
                    id:'',
                    money:''
                };
                localStorage.setItem('xiuGen_bag',JSON.stringify(bag));
                $state.go('submit-order',{tid:id});
                return false;
            }else{
                $yikeUtils.toast('您没有选择任何的商品');
            }
        }
    }
})();