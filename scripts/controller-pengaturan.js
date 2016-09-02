controll.controller('PengaturanController', ['$scope', '$state', '$location', '$ionicHistory', 'user', function($scope, $state, $location, $ionicHistory, user) {
	console.info('PengaturanController');

	$ionicHistory.clearHistory();


	$scope.doLogout = function() {
		$location.path("/login");
	};

	$scope.doOpenAbout = function() {
		$state.go('app.about');
	};

	$scope.doOpenSupport = function() {
		$state.go('app.support');
	};

}]);