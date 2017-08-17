(function(){
	'use strict';
	   angular.module('refund.details',[])
		.controller('RefundDetails', RefundDetails);

	    RefundDetails.$inject=["$scope","$yikeUtils","$state"];
		function RefundDetails($scope,$yikeUtils,$state) {
			var id=$state.params.id;
			var gid=$state.params.gid;
			init();

			function init() {
				getRefundDetails();
			};
			function getRefundDetails() {
				yikeShop.query('/order/refund_detail', {oid:id,goods_id:gid})
					.then(function (data) {
					  $scope.details=data.data;
					 // console.log($scope.details);
					  $scope.time=data.data.time;
					  $scope.$digest();
				    })
					.catch(function(data){
					  console.log(data);
					})
			}
		}
})();