/**
 * Created by Grauda on 2016/12/10 0010.
 */
(function(){
    'use strict';
    angular
        .module('icons.teamIntro.controller',[])
        .controller('teamIntroCtrl',teamIntroCtrl);
    teamIntroCtrl.$inject=['$scope', '$yikeUtils', '$state','$ionicLoading','$timeout'];
    function teamIntroCtrl($scope,$yikeUtils,$state,$ionicLoading,$timeout){
        init();
        function  init(){
        }
        $scope.$on('$ionicView.beforeEnter',function(){
            $ionicLoading.show();
            getClassfiy();
        });
        function getClassfiy(){
            yikeShop.query('/ArticleList/get_message',{id:2,typeId:3}).then(function(data){
                $timeout(function(){$scope.team=data.data;
                console.log($scope.team[0]);
                $ionicLoading.hide();
           },1000)})
        }
    }
})();