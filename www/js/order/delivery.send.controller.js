/**
 * Created by Garud on 2017/1/7 0007.
 */
(function () {
    'use strict';
    angular
        .module('delivery.send.controller', [])
        .controller('DeliverySendCtrl', DeliverySendCtrl);
    DeliverySendCtrl.$inject = ['$scope', '$yikeUtils', '$state',];
    /* @ngInject */
    function DeliverySendCtrl($scope, $yikeUtils, $state) {
        var meal={
            id:$state.params.id
        };
        init();
        function  init(){
            getDistribution();
        }

        function getDistribution(){
            yikeShop.query('/Package/get_distribution',{token:TOKEN,goods_id:meal.id,status:0})
                .then(function(data){
                    $scope.data=data.data;
                    console.log(data);
                    getTime();
                })
                .catch(function(data){
                   console.log(data);
                    $scope.data=[];
                    getTime();
                });
        }

        function getTime(){
            $('#ca').calendar({
                width: 320,
                height: 320,
                data: $scope.data
            });
        }
    }
})();