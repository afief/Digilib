controll.controller('PinjamanController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('PinjamanController');

	$scope.books = [];
	$scope.doRefresh = function() {
		user.getBookLoans().then(function(res){
			console.log(res);
			$scope.books = res;
		});
	};

	$scope.doRefresh();

	$scope.$on('refresh', function() {
		$scope.doRefresh();
	});

}]);