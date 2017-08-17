/**
 * Created by frank on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('home.controller', [])
        .controller('HomeCtrl', HomeCtrl);
    /* @ngInject */
    HomeCtrl.$inject = ["$scope", "$rootScope", "$yikeUtils", "$ionicActionSheet","$ionicScrollDelegate"];
    function HomeCtrl($scope, $rootScope, $yikeUtils, $ionicActionSheet,$ionicScrollDelegate) {
        $scope.data = {};
        $scope.addList = [];
        $scope.showS = showS;
        $scope.hideS = hideS;
        $scope.switchC = switchC;
        var index = 0;
        var SitesId = '';
        init();

        function init() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                autoplay: 2000,
                paginationClickable: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true//修改swiper的父元素时，自动初始化swiper
            });

            var swiper1 = new Swiper('.swiper-container1', {
                slidesPerView: 2,
                paginationClickable: true,
                spaceBetween: 10,
                freeMode: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true//修改swiper的父元素时，自动初始化swiper
            });
            getSlide();
            getLocation();
        }

        $scope.$on('$ionicView.beforeEnter', function () {
            getRecommendGoods();
        });

        //点击,显示,隐藏
        function showS(i) {
            $(i).fadeIn();
            $('.shade-home').show();
        }

        function hideS(i) {
            $(i).fadeOut();
            $('.shade-home').hide();
        }

        //选择站点
        function switchC(i) {
            //console.log(i);
            $scope.address_name_title = i.address;
            var sites_id = i.id;
            SitesId = sites_id;
            localStorage.setItem("xiuGen_sites", sites_id);
            hideS('.con-set-cont');
        }

        //获得banner图
        function getSlide() {
            yikeShop.query('/index/slideshow')
                .then(function (data) {
                    $scope.slides = data.data;
                    $scope.$digest();
                    index++;
                })
                .catch(function (data) {
                    console.log(data);
                })
        }

        //获得站点
        function getSites() {
            var address = localStorage.getItem('xiuGen_jwd');
            var site_id = localStorage.getItem("xiuGen_sites");
            var i = '';
            try {
                yikeShop.query('/sites/index', {address: address})
                    .then(function (data) {
                        $scope.sites = data.data.list;
                        for (var k in $scope.sites) {
                            var string = $scope.sites[k].address;
                            string = string.replace(/,/g, '');
                            string = string.replace(/ /g, '');
                            $scope.sites[k].address = string;
                            if (site_id == $scope.sites[k].id) {
                                $scope.address_name_title = $scope.sites[k].address;
                            } else {
                                site_id = '';
                            }
                            if (i == '') {
                                i = k;
                            }
                        }
                        if (!site_id) {
                            $scope.address_name_title = $scope.sites[i].address;
                            var sites_id = $scope.sites[i].id;
                            localStorage.setItem("xiuGen_sites", sites_id);
                        }
                        $scope.$digest();
                    })
                    .catch(function (data) {
                        var sites="";
                        localStorage.setItem("xiuGen_pickSite", JSON.stringify(sites));
                        console.log(data);
                    })
            } catch (err) {
                console.log(err);
            }
        }

        //ios
        function getIosLocation() {
            var geolocation = new BMap.Geolocation();
            var gc = new BMap.Geocoder();
            geolocation.getCurrentPosition(
                function (r) {//定位结果对象会传递给r变量
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {  //通过Geolocation类的getStatus()可以判断是否成功定位.
                        var pt = r.point;
                        getCurrentAddress(r.point.lng, r.point.lat);
                    } else {
                        $yikeUtils.toast('定位失败');
                    }
                },
                {enableHighAccuracy: true}
            );
        }

        //获取
        function getLocation() {
            //获取当前的位置
            try {
                baidu_location.getCurrentPosition(function (message) {
                    message = JSON.parse(message);
                    getCurrentAddress(message.lontitude, message.latitude);
                }, function (message) {
                    getIosLocation();
                });
            } catch (err) {
                getCurrentxPosition();
            }
        }

        //获取地址
        function getCurrentAddress(x, y) {
            var point = new BMap.Point(x, y);
            var geoc = new BMap.Geocoder();
            var xiuGen_jwd = (x + ', ' + y);
            localStorage.setItem("xiuGen_jwd", xiuGen_jwd);
            var mPoint = point;
            geoc.getLocation(mPoint, function (rs) {
                var addComp = rs.addressComponents;
                //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
            }, {poiRadius: 500});
            //遍历附近的点
            var local = new BMap.LocalSearch(mPoint, {
                pageCapacity: 5, onSearchComplete: function (results) {
                    var xiuGen_list = [];
                    xiuGen_list = results;
                    localStorage.setItem("xiuGen_list", JSON.stringify(xiuGen_list));
                }
            });
            getSites();
            local.searchNearby(['广场', '小区', '学校', '大厦', '酒店'], mPoint, 500);
            local.getResults();
        }

        function getCurrentxPosition() {
            //定位数据获取成功响应
            try{
                var onSuccess = function (position) {
                    var x = position.coords.longitude;
                    var y = position.coords.latitude;
                    var ggPoint = new BMap.Point(x, y);
                    var convertor = new BMap.Convertor();
                    var pointArr = [];
                    pointArr.push(ggPoint);
                    convertor.translate(pointArr, 3, 5, function (data) {
                        if (data.status === 0) {
                            getCurrentAddress(data.points[0].lng, data.points[0].lat);
                        }
                    })
                };
                //定位数据获取失败响应
                var onError=function onError(error) {
                    getIosLocation();
                }
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }catch(err){
                getIosLocation();
            }
        }


        //获得爆款
        $scope.page = 0;
        function getRecommendGoods() {
            $scope.page = 0;
            yikeShop.query('/index/get_recommend_goods_list')
                .then(function (data) {
                    if ($scope.page == 0) {
                        $scope.dataList = data.data;
                    }
                    else {
                        $scope.dataList = $scope.dataList.concat(data.data);
                    }
                    $scope.dataLength = $scope.dataList.length <= 2;
                    $ionicScrollDelegate.resize();
                    $scope.$digest();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }).catch(function(data){
                    console.log(data);
                })
        }
        $scope.loadMore = function () {
            $scope.page++;
            console.log($scope.page);
            getRecommendGoods();
        };
    }
})();