controll.controller('KoleksiController', function($scope, $state, $ionicHistory, user) {
	console.info("Koleksi Controller");

	$scope.openBook = function(n) {
		$state.go("app.buku", {id: n});
	}

	$ionicHistory.clearHistory();

});