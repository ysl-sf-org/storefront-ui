app.controller('ItemController', ['$scope','$routeParams','$location','$route','$timeout', 'BlueAPIService','UserInfoService',function($scope,$routeParams, $location,$route,$timeout, BlueAPIService, UserInfoService) {

	console.log("Entering Inventory Controller")
	//$scope.baseimURL = "/image/"
	$scope.loggedIn = UserInfoService.state.authenticated
	$scope.success = false;
	$scope.fail = false;
	$scope.showReview = false;
	$scope.reviewSuccess = false;
	$scope.reviewFail = false;
	// Determine whether to show the SocailReview section at all
	// For trimmed down version of BlueCompute, we can hide the entire socialReview section
	$scope.showReviewList = false;

	angular.element('#stars').starrr();

	$scope.getStars = function () {
			$scope.count = angular.element('#stars').find('.fa-star.fa');
	}

	BlueAPIService.getItemById($routeParams.id, function (response) {
			console.log("Get Item Detail Result" + response)
			$scope.item = response.data
			BlueAPIService.getItemReviewById($routeParams.id, function (response) {
					console.log("Get Item Review List Result" + response)
					if (response.data.statusCode == 404) {
						$scope.showReviewList = false;
					} else {
						$scope.itemReviewList = response.data
					}

				}, function (error){
					console.log("Get Item Review List Error: " + error);
					$scope.showReviewList = false;
			});

		}, function (error){
			console.log("Get Item Detail Result Error: " + error);
	});

	$scope.buy = function () {
			$scope.payload = {'count':$scope.itemQuantity,
												'itemId':$scope.item.id
											}

			BlueAPIService.buyItems(UserInfoService.state.accessToken, $scope.payload, function (response) {
					console.log("Buy Item Result" + response)
					$scope.result = response.data
					$scope.success = true;
					$scope.fail = false;

				}, function (error){
					console.log("Buy Item Error: " + error);
					$scope.success = false;
					$scope.fail = true;
			});
	}
	$scope.addReview = function () {
			//$location.path('review/'+$scope.item.id);
			$scope.payload = {
												'rating':$scope.count.length,
												'comment':$scope.comments
											}

			BlueAPIService.addReviewItem(UserInfoService.state.accessToken, $routeParams.id, $scope.payload, function (response) {
					console.log("Add Review Item Result" + response)
					$scope.result = response.data
					$scope.reviewFail = false;
					$scope.reviewSuccess = true;
					$timeout(function() {
          	$route.reload();
        	}, 2000);

				}, function (error){
					console.log("Add Review Item Error: " + error);
					$scope.reviewFail = true;
					$scope.reviewSuccess = false;
			});
	}

}]);
