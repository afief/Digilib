controll.controller('PengaturanController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('PengaturanController');

	$ionicHistory.clearHistory();


	$scope.doLogout = function() {
		$state.go("app.login");
	};

}]);