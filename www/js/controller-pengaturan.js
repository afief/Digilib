controll.controller('PengaturanController', function($scope, $state, $ionicHistory, user) {
	console.info('PengaturanController');

	$ionicHistory.clearHistory();


	$scope.doLogout = function() {
		$state.go("app.login");
	}

});