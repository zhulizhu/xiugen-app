/**
 * Created by Garuda on 2017/2/9 0009.
 */
(function(){
    'use strict';
    angular.module('cart.add.address.controller',[])
      .controller('CartAddAddress',CartAddAddress)
    CartAddAddress.$inject=["$scope","$yikeUtils","$ionicActionSheet","$state"];
    function CartAddAddress($scope,$yikeUtils,$ionicActionSheet,$state){
        $scope.addCartAddress=addCartAddress;
        $scope.showS=showS;
        $scope.hideS=hideS;
        $scope.switchP=switchP;
       // $scope.listItem=listItem;
        $scope.addressList=[];
        $scope.addList=[];
        $scope.cont={
            name:'',
            telephone:'',
            gender:'1',
            address:'',
            address_name:'',
            remarks:''
        };
        $scope.gender=[
         {text:'男',value:'1'},
         {text:'女',value:'2'},
        ];
        var telReg=/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var flag=true;
        init();
        function init() {
            getAddress();
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
          $scope.provineceId = i;
          $scope.cont.address_name=i.text;
          hideS('.con-pro');
        }
        /*//获取地址经纬度跟列表
        function listItem(){
            var hideSheet = $ionicActionSheet.show({
                buttons: $scope.addList,
                titleText: '选择地址',
                cancelText: '取消',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                   $scope.cont.address_name=$scope.addList[index].text;
                   hideSheet();
                }
            });
        }*/
        //获取地址
        function getAddress() {
            $scope.cont.address = localStorage.getItem('xiuGen_jwd');
            var results = JSON.parse(localStorage.getItem('xiuGen_list'));
            console.log(results);
            for (var k in results) {
                var x = k;
                if (results[k].mr.length > 0) {
                    for (var j in results[k].mr) {
                        var a = {text: ''};
                        a.text = results[k].mr[j].title;
                        $scope.addList.push(a);
                    }
                }
            }
        };
        //保存地址
        function  addCartAddress() {
            if (flag == true) {
                flag=false;
                if($scope.cont.name==''){
                   $yikeUtils.toast('请输入姓名!');
                    flag=true;
                    return false;
                }else if(!telReg.test($scope.cont.telephone)){
                    $yikeUtils.toast('请填写正确的手机号码!');
                    flag=true;
                    return false;
                }
                else if($scope.cont.address_name==''){
                    $yikeUtils.toast('请选择地址!');
                    flag=true;
                    return false;
                }
                else if($scope.cont.remarks==''){
                    $yikeUtils.toast('请填写地址!');
                    flag=true;
                    return false;
                }else {
                    var date=$scope.cont;
                    yikeShop.query('/address/add',{token:TOKEN,date:date})
                        .then(function (data) {
                           $yikeUtils.toast(data.msg);
                           $state.go('cart-address');
                        })
                        .catch(function (data) {
                            flag = true;
                            $yikeUtils.toast(data.msg);
                        });
                }
            }
        }
    }
})();
