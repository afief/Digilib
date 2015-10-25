controll.controller('BukuController', function($scope, $state, $ionicHistory, user) {
	console.info("Buku Controller");

	$scope.id = $state.params.id;
	$scope.book = $scope.books[$scope.id - 1];
	$scope.isFavorit = false;

	$scope.rating = 0;
	$scope.setRating = function(n) {
		$scope.rating = n;
	}
});