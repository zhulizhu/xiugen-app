/**
 * Created by Garuda on 2017/1/6 0006.
 */
(function () {
    'use strict';

    angular
        .module('user.mylike.controller', [])
        .controller('MyLikeCtrl', MyLikeCtrl);
    /* @ngInject */
    MyLikeCtrl.$inject=["$scope","$yikeUtils","$state","$ionicLoading"];
    function MyLikeCtrl($scope, $yikeUtils, $state,  $ionicLoading) {
        $scope.getData = getData;
        $scope.getSelect = getSelect;
        $scope.getSelectL = getSelectL;
        $scope.fold=fold;
        $scope.fold2=fold2;
        $scope.index = 0;
        var flag2=true;
        var TOKEN="";
        init();
        function init(){
            $ionicLoading.show();
            var mySwiper = new Swiper('.swiper-container3', {
                slidesPerView: 3,
                paginationClickable: true,
                spaceBetween: 30,
                freeMode: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true//修改swiper的父元素时，自动初始化swiper
            });
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            TOKEN=localStorage.getItem('TOKEN');
            if(TOKEN&&TOKEN.length>5){
                getList();
            }else{
                $yikeUtils.toast('请先登录');
                $state.go('login');
            }
        });

        //获取列表
        function  getList(){
            yikeShop.query('/hobby/hobby_list',{token:TOKEN})
                .then(function(data){
                    $scope.current=data.data;
                    console.log($scope.current);
                    for(var k in $scope.current){
                        $scope.id=$scope.current[k].id;
                        $scope.titleName=$scope.current[k].name;
                        getDetail($scope.id);
                        return;
                    }
                })
                .catch(function(data){
                    $yikeUtils.toast(data.msg);
                })
        }

        //列表点击事件
        function  getData(i,j){
            $scope.index=this.$index;
            $scope.id=i;
            $scope.titleName= j.name;
            getDetail(i);
        }

        //获取下面的数据
        function getDetail(id){
            var id=id;
            yikeShop.query('/hobby/get_detail',{token:TOKEN,pid:id})
                .then(function(data){
                    $scope.detail=data.data;
                    getAll(id);
                   // console.log($scope.detail);
                    $scope.$digest();
                })
                .catch(function(data){
                    $yikeUtils.toast(data.msg||'暂无信息');
                })
        }

        //喜欢点击事件
        function getSelectL(i){
            var index,mylabel,mylabelx,cid;
            //console.log(i.id);
            cid= i.id;
            index=this.$index;
            mylabel=document.querySelectorAll('.mylabel');
            mylabelx=document.querySelectorAll('.mylabelx');
            //console.log(index);
            if(flag2==true) {
                if (mylabelx[index].className.match('sz')) {
                    mylabelx[index].className = mylabelx[index].className.replace(' sz', '');
                    saveDetail($scope.id,1, cid, 0);
                    return;
                }
                else {
                    if (mylabel[index].className.match('sz')) {
                        mylabel[index].className = mylabel[index].className.replace(' sz', '');
                    }
                    mylabelx[index].className += ' sz';
                    saveDetail($scope.id,1, cid, 1);
                }
            }
        }
        //不喜欢点击事件
        function getSelect(i){
            var index,mylabel,mylabelx,cid;
            //console.log(i);
            cid= i.id;
            index=this.$index;
            mylabel=document.querySelectorAll('.mylabel');
            mylabelx=document.querySelectorAll('.mylabelx');
            //console.log(index);
            if(flag2==true){
                if (mylabel[index].className.match('sz')) {
                    mylabel[index].className = mylabel[index].className.replace(' sz', '');
                    saveDetail($scope.id, 2, cid, 0);
                    return;
                } else {
                    if (mylabelx[index].className.match('sz')) {
                        mylabelx[index].className = mylabelx[index].className.replace(' sz', '');
                    }
                    mylabel[index].className += ' sz';
                    saveDetail($scope.id, 2, cid, 1);
                }
            }
        }

        //表单事件
        function saveDetail(id,type,cid,status){
            if(flag2==true) {
                flag2=false;
                yikeShop.query('/hobby/save_hobby', {token: TOKEN, tid: id, type: type, cid: cid, status: status})
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        setTimeout(function(){
                            flag2=true;
                        },500);
                    })
                    .catch(function (data) {
                        $yikeUtils.toast(data.msg);
                    });
            }else{
                $yikeUtils.toast('请不要操作过于频繁');
            }
        }

        //获取下面的元素
        function  getAll(id){
            yikeShop.query('/hobby/get_all',{token:TOKEN})
                .then(function(data){
                  $scope.getAll=data.data;
                  for(var k in $scope.detail){
                      for(var j in $scope.getAll){
                          if($scope.detail[k].id==$scope.getAll[j].cid){
                              $scope.detail[k].checked=$scope.getAll[j].status;
                              $scope.detail[k].type=$scope.getAll[j].type;
                          }
                      }
                  }
                    $scope.$digest();
                    $ionicLoading.hide();
                   //console.log($scope.detail);
                  //console.log(data);
                })
                .catch(function(data){
                    console.log(data);
                })
        }

        //折叠
        function fold(){
            if($('.myUIcon')[0].className.match('ion-ios-arrow-down')){
                $('.likeUl')[0].className+=' ul-an';
                $('.myUIcon')[0].className=$('.myUIcon')[0].className.replace('ion-ios-arrow-down','ion-ios-arrow-up');
            }else{
                $('.likeUl')[0].className= $('.likeUl')[0].className.replace(' ul-an','');
                $('.myUIcon')[0].className=$('.myUIcon')[0].className.replace('ion-ios-arrow-up','ion-ios-arrow-down');
            }
        }

        function fold2(){
            if($('.myOIcon')[0].className.match('ion-ios-arrow-down')){
                $('.likeOl')[0].className+=' ol-an';
                $('.myOIcon')[0].className=$('.myOIcon')[0].className.replace('ion-ios-arrow-down','ion-ios-arrow-up');
            }else{
                $('.likeOl')[0].className= $('.likeOl')[0].className.replace(' ol-an','');
                $('.myOIcon')[0].className=$('.myOIcon')[0].className.replace('ion-ios-arrow-up','ion-ios-arrow-down');
            }
        }
    }
})();