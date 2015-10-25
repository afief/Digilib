var controll = angular.module('controllers', []);

controll.run(function($ionicPlatform, $ionicHistory, $rootScope) {
});


/*
Main Controller
*/
controll.controller('IndexController', function($scope, $state, $ionicHistory, user) {
	console.info("IndexController");

	$scope.$on('$ionicView.enter', function(e, ts) {
		//lgi("enter", e, ts);
	});
	$scope.$on('$ionicView.leave', function(e, fs) {
		//lgi("leave", e, fs);
	});

	$scope.isBackButtonShow = function() {
		return $ionicHistory.backView() != null;
	}

});

controll.controller('KoleksiController', function($scope, $state, $ionicHistory, user) {
	console.info("Koleksi Controller");

	$scope.openBook = function(n) {
		$state.go("app.buku", {id: n});
	}

	$ionicHistory.clearHistory();
});

controll.controller('BukuController', function($scope, $state, $ionicHistory, user) {
	console.info("Buku Controller");

	$scope.id = $state.params.id;
});