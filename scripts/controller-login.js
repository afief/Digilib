controll.controller('LoginController', ['$scope', '$location', '$ionicHistory', 'user', function($scope, $location, $ionicHistory, user) {
	console.info('LoginController');

	$ionicHistory.clearHistory();


	$scope.doLogin = function() {
		console.log("login");
		$location.path("/app/koleksi");
	};

}]);