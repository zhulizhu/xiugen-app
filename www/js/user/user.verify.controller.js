/**
 * Created by Garuda on 2016/12/30 0030.
 */
(function () {
    'use strict';

    angular
        .module('user.verify.controller', [])
        .controller('UserVerifyCtrl', UserVerifyCtrl);

    UserVerifyCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory'];
    function UserVerifyCtrl($scope,$yikeUtils,$state,$ionicHistory){
        $scope.sendVerify=sendVerify;
        $scope.subMit=subMit;
        $scope.checked=checked;
        $scope.flag=false;
        var flag=true;
        var countdown;
        var count=1;
        $scope.user={
            phone:'',
            code:'',
            code2:'',
            phoneTwo:''
        }
      init();
      function  init(){
      }
      function sendVerify(){
          if(flag==true) {
              flag=false;
              var sendMsg = document.body.querySelector('.send-msg');
              countdown = 60;
              if (!ShopPublic.formData($scope.user.phone)) {
                  return false;
              }
              count++;
              yikeShop.query('/login/verify', {phone: $scope.user.phone})
                  .then(function (data) {
                      $yikeUtils.toast(data.msg);
                      $scope.user.code2 = data.data;
                      $scope.user.phoneTwo = $scope.user.phone;
                      settime(sendMsg);
                  })
                  .catch(function (data) {
                      $yikeUtils.toast(data.msg);
                  });
          }
      }
       //倒计时
        function settime(obj) {
            if (countdown == 0) {
                flag=true;
                obj.removeAttribute("disabled");
                obj.innerHTML="获取验证码";
                countdown = 60;
                return;
            } else {
                obj.setAttribute("disabled", true);
                obj.innerHTML="重新发送(" + countdown + ")";
                countdown--;
            }
            setTimeout(function() {
                settime(obj)
            },1000)
        }
        function subMit(){
            if(!ShopPublic.formData($scope.user.phone,$scope.user.code,$scope.user.code2,1)){
                return false;
            }else if($scope.flag==false){
                $yikeUtils.toast('请阅读并同意秀根用户协定');
                return false;
            }
            yikeShop.query('/login/msg_login',{phone:$scope.user.phone})
                .then(function(data){
                    //console.log(data);
                    $yikeUtils.toast(data.msg);
                    localStorage.setItem('TOKEN', data.data);
                    TOKEN = data.data;
                    $state.go('tab.home');
                })
                .catch(function(data){
                    $yikeUtils.toast(data.msg);
                });
        }
        function  checked(){
            $scope.check=document.querySelector('#checkbox_five_input');
            if($scope.check.className.match('checked')){
                $scope.flag=false;
                $scope.check.className=$scope.check.className.replace(' checked','');
                return;
            }else{
                $scope.flag=true;
                $scope.check.className+=' checked';
            }
        }
    }
})();