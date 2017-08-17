/**
 * Created by Grauda on 2016/12/10 0010.
 */
(function () {
    angular.module('icons.join.controller', [])
        .controller('joinCtrl', joinCtrl);
    joinCtrl.$inject=["$scope","$yikeUtils","$state","$sce","$ionicScrollDelegate","$ionicLoading"];
    function joinCtrl($scope, $yikeUtils, $state, $sce, $ionicScrollDelegate,$ionicLoading) {
        var pattern1 = /&lt;/gim;
        var pattern2 = /&gt;/gim;
        var pattern3 = /&quot;/gim;
        var pattern4 = /&nbsp;/gim;
        var pattern5 = /ldquo;/gim;
        var pattern6 = /rdquo;/gim;
        var pattern7 = /&amp;/gim;


        init();
        $scope.join = {
            name: '',
            cname: '',
            phone: '',
            note: '',
            image: ''
        };
        $scope.joinSub = joinSub;
        function init() {
            getClassfiy();
            joinUs();
        }

        function joinUs() {
            yikeShop.query('/index/join', {token: TOKEN}).then(function (data) {
                data.data.store = data.data.store.replace(pattern1, '<');
                data.data.store = data.data.store.replace(pattern2, '>');
                data.data.store = data.data.store.replace(pattern3, '"');
                data.data.store = data.data.store.replace(pattern4, ' ');
                data.data.store = data.data.store.replace(pattern5, '“');
                data.data.store = data.data.store.replace(pattern6, '”');
                data.data.store = data.data.store.replace(pattern7, ' ');
                data.data.store = $sce.trustAsHtml(data.data.store);
                $scope.tmp = data.data.store;
                $scope.$digest();

            }).catch(function (data) {
                console.log(data);
            })
        }

        function getClassfiy() {
            yikeShop.query('/ArticleList/get_message', {token: TOKEN, id: 3}).then(function (data) {
                //console.log(data);
                $scope.joinx = data.data;
                $scope.join.image = 'img/food-img/join.png';
                $ionicScrollDelegate.resize();
                $scope.$digest();
                /* if($scope.joinx) {
                 var str = $scope.joinx[0].content;
                 }*/
                // $scope.$sce=$sce;
                //yconsole.log(str);
            }).catch(function (data) {
                console.log(data);
            })
        }

        //表单
        function joinSub() {
            if (!/^[\u4e00-\u9fa5]+$/.test($scope.join.name)) {
                $yikeUtils.toast('请正确输入姓名');
                return false;
            } else if (!/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/.test($scope.join.phone)) {
                $yikeUtils.toast('请正确输入电话');
                return false;
            } else if (!/^[\u4e00-\u9fa5]+$/.test($scope.join.cname)) {
                $yikeUtils.toast('请正确输入公司名字');
                return false;
            } else {
                yikeShop.query('/user/to_join', {
                    token: TOKEN,
                    name: $scope.join.name,
                    phone: $scope.join.phone,
                    cname: $scope.join.cname,
                    note: $scope.join.note
                })
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        console.log(data);
                        $state.go('tab.home');
                    })
                    .catch(function (data) {
                        $yikeUtils.toast(data.msg);
                        console.log(data);
                    })
            }
        }
    }
})();