// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'templates', 'yike','tab.module', 'user.module', 'goods.module', 'crop.module', 'order.module', 'icons.module', 'shake.module', 'ngCordova'])

    .constant('$ionicLoadingConfig',{
        template: '<div><img src="img/xiugen_loading.gif" alt="" style="width:48px;"></div>',
        animation: 'fade-in',
        duration: 1000,
        noBackdrop: false,
        hideOnStateChange: false
    })
    .run(function ($ionicPlatform, $yikeUtils, $rootScope, $state) {
        $rootScope.STATIC_ROOT = STATIC_ROOT;
        $rootScope.UPLOAD_ROOT = UPLOAD_ROOT;
        $rootScope.cart = {};
        $rootScope.classFiy={};//获取分类id
        $rootScope.uid={};//获取uid
        $rootScope.cartTotal = localStorage.getItem('cartTotal') || 0;
        window.toast = $yikeUtils.toast;
        getCart();
        function getCart() {
            yikeShop.query('/cart/index')
                .then(function (data) {
                    $rootScope.cart = data.data;
                    console.log(data.data);
                }).catch(function(data){
                   $yikeUtils.toast(data.msg);
                    $state.go('login');
                    console.log(data);
                })
        }
        if (!DEBUG) {
            console.log = function () {
                return null;
            }
        }
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)\
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });

    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        var tplPre = '';
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.navBar.positionPrimaryButtons('left');
        $ionicConfigProvider.backButton.icon('ion-ios-arrow-left');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.views.maxCache(1);
        //$ionicConfigProvider.views.transition('no');
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/an gular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: tplPre + 'tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('tab.home', {
                url: '/home',
                cache:true,
                views: {
                    'tab-home': {
                        templateUrl: tplPre + 'tab-home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('tab.recharge', {
                url: '/recharge',
                views: {
                    'tab-recharge': {
                        templateUrl: tplPre + 'tab-recharge.html',
                        controller: 'RechargeCtrl'
                    }
                }
            })
            .state('tab.package', {
                url: '/package',
                views: {
                    'tab-package': {
                        //templateUrl: tplPre + 'package/custom.html', 
                        templateUrl: tplPre + 'tab-package.html',
                        controller: 'CustomCtrl'
                        //controller: 'PackageCtrl'
                    }
                }
            })
            /*个人中心*/
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: tplPre + 'tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })
            /*登录*/
            .state('login', {
                url: '/login',
                templateUrl: tplPre + 'login/login.html',
                controller: 'UserLoginCtrl'
            })
            /*注册*/
            .state('register', {
                url: '/register',
                cache:false,
                templateUrl: tplPre + 'login/register.html',
                controller: 'UserRegisterCtrl'
            })
            /*忘记密码*/
            .state('forget', {
                url: '/forget',
                cache:false,
                templateUrl: tplPre + 'login/forget.html',
                controller:'UserForgetCtrl'
            })
            /*验证手机号*/
            .state('verify', {
                url: '/verify',
                cache:false,
                templateUrl: tplPre + 'login/verify.html',
                controller:'UserVerifyCtrl'
            })
            /*套餐定制*/
            .state('custom', {
                url: '/custom',
                templateUrl: tplPre + 'package/custom.html',
                controller: 'CustomCtrl'
            })
            /*套餐详情*/
            .state('package_details', {
                url: '/package_details/:id/:pid',
                templateUrl: tplPre + 'package/package_details.html',
                controller: 'CustomDetailCtrl'
            })
            /*果蔬直供*/
            .state('goods-list', {
                url: '/goods-list/:id',
                templateUrl: tplPre + 'goods/list.html',
                controller: 'GoodsListCtrl'
            })
            //DIY种植页
            .state('crop-list', {
                url: '/crop-list/:id',
                templateUrl: tplPre + 'crop/list.html',
                controller: 'CropListCtrl'
            })
            /*水果详情*/
            .state('detail', {
                url: '/detail/:id',
                cache:false,
                templateUrl: tplPre + 'goods/detail.html',
                controller: 'GoodsDetailCtrl'
            })
            /*种植详情*/
            .state('crop-detail', {
                url: '/detail/:id',
                templateUrl: tplPre + 'crop/detail.html',
                controller: 'CropDetailCtrl'
            })
            /*摇红包*/
            .state('red_bag', {
                url: '/red_bag',
                cache:false,
                templateUrl: tplPre + 'shake/red_bag.html',
                controller: 'ShakeCtrl'
            })
            /*红包使用规则*/
            .state('user_rule', {
                url: '/user_rule',
                templateUrl: tplPre + 'shake/user_rule.html',
                controller:'UserRuleCtrl'
            })
            /*我的红包*/
            .state('my_bag', {
                url: '/my_bag/:id,:money,:type,:gId',
                templateUrl: tplPre + 'shake/my_bag.html',
                controller:'MyBagCtrl'
            })
            /*失效红包*/
            .state('invalid_bag', {
                url: '/invalid_bag',
                templateUrl: tplPre + 'shake/invalid_bag.html',
                controller: 'InvalidBagCtrl'
            })
            /*验证银行卡信息*/
            .state('card_message', {
                url: '/card_message',
                templateUrl: tplPre + 'top-up/card_message.html'
            })
            /*我的喜好*/
            .state('my_like', {
                url: '/my_like',
                templateUrl: tplPre + 'account/my_like.html',
                controller:'MyLikeCtrl'
            })
            /*配送地址*/
            .state('delivery-count',{
                url:'/delivery-count/:id,:oid,:count,:start,:end',
                cache:false,
                templateUrl:tplPre+'order/delivery-count.html',
                controller:'DeliveryCountCtrl'
            })
            /*查看配送记录*/
            .state('delivery-send', {
                url: '/delivery-send/:id,:oid',
                cache:false,
                templateUrl: tplPre + 'order/delivery-send.html',
                controller: 'DeliverySendCtrl'
            })
            //草莓采摘门票页
            .state('strawberry', {
                url: '/strawberry',
                templateUrl: tplPre + 'package/ticket.html',
                controller: 'TicketCtrl'
            })
            //食品安全页
            .state('food-safe', {
                url: '/food-safe',
                templateUrl: tplPre + 'food/food-safe.html',
                controller:'FoodSafeCtrl'
            })
            //食品安全新闻
            .state('food-news', {
                url: '/food-news/:title',
                templateUrl: tplPre + 'food/food-news.html',
                controller:'FoodDetailCtrl'
            })
            //食品安全新闻详情页
            .state('food', {
                url: '/food/:id',
                templateUrl: tplPre + 'food/food.html',
                controller:'DetailCtrl'
            })
            //我的订单
            .state('orders', {
                url: '/orders/:status',
                templateUrl: tplPre + 'order/list.html',
                controller: 'OrderListCtrl',
                cache:false
            })
            //购物车
            .state('cart', {
                url: '/cart/:vary',
                templateUrl: tplPre + 'order/cart.html',
                controller: 'OrderCartCtrl'
            })
            //我的二维码
            .state('my-code', {
                url: '/my-code',
                templateUrl: tplPre + 'food/my-code.html',
                controller:'MyCodeCtrl'
            })
            //我的套餐
            .state('my-package', {
                url: '/my-package',
                templateUrl: tplPre + 'food/my-package.html',
                controller:'MyPackageCtrl'
            })
            //我的门票
            .state('my-ticket', {
                url: '/my-ticket',
                templateUrl: tplPre + 'food/my-ticket.html',
                controller:'MyTicketCtrl'
            })
            //添加地址
            .state('add-address', {
                url: '/add-address',
                templateUrl: tplPre + 'food/add-address.html',
                controller:'AddressCtrl'
            })
            //定位置
            .state('position', {
                url: '/position',
                templateUrl: tplPre + 'food/position.html'
            })
            //定位置2
            .state('position-two', {
                url: '/position-two',
                templateUrl: tplPre + 'food/position-two.html'
            })
           //新建地址
            .state('consignee',{
                url:'/consignee',
                templateUrl:tplPre + 'food/consignee.html',
                controller:'ConsigneeCtrl'
            })
            //修改地址
            .state('modify-address',{
                url:'/modify-address/:id',
                templateUrl:tplPre+'food/modify-address.html',
                controller:'ModifyAddressCtrl'
            })
            //积分
            .state('integral', {
                url: '/integral',
                templateUrl: tplPre + 'food/integral.html',
                controller:'Integral'
            })
            //秀根之家
            .state('xiu-home', {
                url: '/xiu-home',
                templateUrl: tplPre + 'food/xiu-home.html',
                controller:'XiuHomeCtrl'
            })
            //公司介绍
            .state('introduce', {
                url: '/introduce',
                templateUrl: tplPre + 'food/introduce.html',
                controller:'introCtrl'
            })
            //品牌介绍
            .state('brand', {
                url: '/brand',
                templateUrl: tplPre + 'food/brand.html',
                controller:'brandCtrl'
            })
            //团队介绍
            .state('team-introduce', {
                url: '/team-introduce',
                templateUrl: tplPre + 'food/team-introduce.html',
                controller:'teamIntroCtrl'
            })
            //种植技术
            .state('teach', {
                url: '/teach',
                templateUrl: tplPre + 'food/teach.html',
                controller:'teachCtrl'
            })
            //监测报告
            .state('detection', {
                url: '/detection',
                templateUrl: tplPre + 'food/detection.html',
                controller:'decCtrl'
            })
            //产品展示页
            .state('product', {
                url: '/product',
                templateUrl: tplPre + 'food/product.html',
                controller:'proCtrl'
            })
            //合作加盟
            .state('join', {
                url: '/join',
                templateUrl: tplPre + 'food/join.html',
                controller:'joinCtrl'
            })
            //提交订单页
            .state('submit-order', {
                url: '/submit-order/:tid',
                templateUrl: tplPre + 'order/submit-order.html',
                controller: 'SubmitOrderCtrl'
            })
            //立即支付页
            .state('go-submit', {
                url: '/go-submit/:id,:tid',
                templateUrl: tplPre + 'order/go-submit.html',
                controller: 'GoSubmitCtrl'
            })
            //充值页
            .state('top-up', {
                url: '/top-up',
                templateUrl: tplPre + 'top-up/top-up.html',
                controller:'TopUpCtrl'
            })
            //充值绑定银行卡
            .state('top-bank', {
                url: '/top-bank',
                templateUrl: tplPre + 'top-up/top-bank.html'
            })
            //订单详情页面
            .state('order-detail', {
                url: '/order-detail',
                templateUrl: tplPre + 'food/order-detail.html'
            })
            //我的爱好提交
            .state('my-hobby', {
                url: '/my-hobby/:id',
                templateUrl: tplPre + 'food/my-hobby.html',
                controller:'MyHobbyCtrl'
            })
            //充值页面
            .state('top-sure', {
                url: '/top-sure/:money/:type',
                templateUrl: tplPre + 'top-up/top-sure.html',
                controller:'TopSureCtrl'
            })
            //充值明细
            .state('top-account', {
                url: '/top-account',
                templateUrl: tplPre + 'top-up/top-account.html'
            })
            /*退款详情-退款被拒绝*/
            .state('refund-refuse', {
                url: '/refund-refuse',
                templateUrl: tplPre + 'account/refund-refuse.html'
                // controller:'MyLikeCtrl'
            })
             /*退款详情-申请已提交*/
            .state('apply-submit', {
                url: '/apply-submit/:id,:gid',
                templateUrl: tplPre + 'account/apply-submit.html',
                controller:'RefundDetails'
            }) 
            /*申请退款*/
            .state('refund-reason', {
                url: '/refund-reason/:id,:status',
                templateUrl: tplPre + 'account/refund-reason.html',
                controller:'SubmitRefundReason'
            }) 
            //商品评价
            .state('evaluate',{
                url:'/evaluate/:id/:oid',
                templateUrl:tplPre + 'goods/evaluate.html',
                controller:'EvaluateCtrl'
            })
            //个人信息
            .state('person',{
                url:'/person',
                templateUrl:tplPre+'account/my_info.html',
                controller:'Person'
            })
           //我的等级
            .state('level',{
                url:'/level',
                templateUrl:tplPre+'account/my_level.html',
                controller:'Level'
            })
            //退款列表
            .state('refunds-list',{
                url:'/refunds-list',
                cache:false,
                templateUrl:tplPre+'account/refunds_order.html',
                controller:'RefundList'
            })
            //退款详情
            //我的收货地址
           .state('cart-address',{
               url:'/cart-address/:vary,:package',
               templateUrl:tplPre+'order/address.html',
               controller:'CartAddress'
            })
            //添加购物车收货地址
           .state('cart-add-address',{
              url:'/cart-add-address',
              cache:false,
              templateUrl:tplPre+'order/cart-add-address.html',
              controller:'CartAddAddress'
           })
            //添加用户自提点地址
            .state('cart-address-pick',{
                url:'/cart-address-pick',
                templateUrl:tplPre+'order/cart-address-pick.html',
                controller:'CartAddressPick'
            })
            //修改用户名
            .state('reset-username', {
                url: '/reset-username',
                templateUrl: tplPre + 'account/reset-username.html',
                controller: 'ResetUserName'
            })
            //套餐定制支付界面
            .state('package-pay', {
                url: '/package-pay/:id',
                templateUrl: tplPre + 'package/package-pay.html',
                controller:'PackagePayCtrl'
            })
            //门票支付
            .state('ticket-pay', {
                url: '/ticket-pay/:id/:pid',
                templateUrl: tplPre + 'package/ticket-pay.html',
                controller:'TicketPayCtrl'
            })
            //更改手机号
            .state('reset-phone', {
                url: '/reset-phone',
                cache:false,
                templateUrl: tplPre + 'account/reset-phone.html',
                controller:'ResetPhoneCtrl'
            })
          ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('tab/home');
        //$urlRouterProvider.otherwise('login');
    });
