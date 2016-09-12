controll.controller('ReservasiController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('ReservasiController');

	$scope.books = [];
	$scope.doRefresh = function() {
		user.getBookReserve().then(function(res){
			console.log(res);
			$scope.books = res;
		});
	};

	$scope.doRefresh();

	$scope.$on("$ionicView.enter", function() {
		$scope.doRefresh();
	});

	$scope.$on('refresh', function() {
		$scope.doRefresh();
	});

	$scope.openBook = function(n) {
		console.log("Open " + n);
		$state.go("app.buku", {id: n});
	};

}]);