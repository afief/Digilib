controll.controller('LoginController', function($scope, $state, $ionicHistory, user) {
	console.info('LoginController');

	$ionicHistory.clearHistory();


	$scope.doLogin = function() {
		$state.go("app.koleksi");
	}

});