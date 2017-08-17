/*
/!**
 * Created by frank on 2016/9/6.
 *!/
(function () {
    'use strict';

    angular
        .module('custom.detail.controller', [])
        .controller('CustomDetailCtrl', CustomDetailCtrl);

    CustomDetailCtrl.$inject = ['$scope', '$yikeUtils', '$state'];
    /!* @ngInject *!/
    function CustomDetailCtrl($scope, $yikeUtils, $state) {
        var id = $state.params.id;
        //$scope.pid = $state.params.pid;
        $scope.id = parseInt(id);
        $scope.data = {};
        $scope.add = add;
        $scope.getList=getList;
        $scope.index=0;
        var flag=true;
        init();

        function init() {
            getCategory();
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            getCategory();
        });

        //获取套餐信息
        function getCategory() {
            yikeShop.query('/Package/package_list', {token:TOKEN,id:id})
                .then(function (data) {
                    $scope.category = data.data;
                    if(!$scope.typeId){
                            //$scope.typeId=$scope.category[0].class[k].id;
                        for(var k in $scope.category) {
                            for (var j in $scope.category[k].class) {
                                $scope.typeId = $scope.category[0].class[j].id;
                                console.log($scope.typeId);
                                getDetail();
                                return;
                            }
                        }
                    }
                    $scope.$digest();
                }).catch(function(data){
                    console.log(data);
                });
        }
        //购买
        function add() {
            if(flag==true) {
                flag=false; //防止连续点击
                //console.log($scope.typeId, $scope.id, TOKEN);
                yikeShop.query('/Package/save_package', {token: TOKEN, tid: $scope.typeId, nid: $scope.id})
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $state.go('tab.home');
                        flag=true;
                    })
                    .catch(function (data) {
                        $yikeUtils.toast(data.msg);
                        console.log(data);
                        flag=true;
                    });
            }
        }
        //获取数据列表
        function getDetail() {
            yikeShop.query('/Package/get_detail', {token:TOKEN,pid:id,id:$scope.typeId})
                .then(function (data) {
                    $scope.data = data.data;
                    console.log($scope.data);
                    $scope.$digest();
                })

        }
        //点击事件
        function getList(i){
            //console.log(i);
            $scope.index=this.$index;
            $scope.typeId= i.id;
            getDetail();
        }
    }
})();*/
(function () {
    'use strict';
    angular
        .module('custom.detail.controller', [])
        .controller('CustomDetailCtrl', CustomDetailCtrl);
    /* @ngInject */
    CustomDetailCtrl.$inject=["$scope","$yikeUtils","$state"];
    function CustomDetailCtrl($scope, $yikeUtils, $state) {
        var id = $state.params.id;
        $scope.id = parseInt(id);
        $scope.data = {};
        $scope.add = add;
        init();

        function init() {
            getDetail(id);
            getCategory();
        }

        function getCategory() {
            yikeShop.query('/category/children', {pid: 27})
                .then(function (data) {
                    $scope.category = data.data;
                    for (var i = 0; i < $scope.category.length; i++) {
                        var obj = $scope.category[i];
                        var id = obj.id;
                        getList(id);
                    }
                    $scope.$digest();
                })
        }

        function getList(id) {
            yikeShop.query('/category/get_goods', {id: id})
                .then(function (data) {
                    $scope.data['category'] = data.data;
                    $scope.data['category'].checkIndex = 0;
                    $scope.$digest();
                })
        }

        function add(id) {
            var payload = {
                goods_id: id,
                quantity: 1
            };
            yikeShop.query('/cart/add', payload)
                .then(function (data) {
                    $yikeUtils.toast(data.data.success);
                })
        }

        function getDetail(id) {
            yikeShop.query('/goods/detail', {id: id})
                .then(function (data) {
                    $scope.data = data.data;
                    console.log($scope.data);
                    $scope.$digest();
                })

        }
    }
}());
