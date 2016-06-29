controll.controller('KoleksiController', ['$scope', '$state', '$ionicHistory', '$ionicLoading', 'user', function($scope, $state, $ionicHistory, $ionicLoading, user) {
	console.info("Koleksi Controller");

	$scope.openBook = function(n) {
		$state.go("app.buku", {id: n});
	};

	$ionicHistory.clearHistory();

	$scope.doRefresh = function() {
		$ionicLoading.show({
				template: 'Mengambil Buku'
			});
		window.setTimeout(function() {
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		}, 2000);

	};

}]);