controll.controller('PesanController', ['$scope', '$state', '$ionicHistory', 'user', '$ionicLoading', function($scope, $state, $ionicHistory, user, $ionicLoading) {
	console.info('PesanController');
	$ionicHistory.clearHistory();

	$scope.messages = [];

	$scope.doRefresh = function() {
		$ionicLoading.show({template: 'Mengambil Daftar Pesan'});
		user.getMessageList().then(function(res) {
			$scope.messages = res;
			$ionicLoading.hide();
		}, function() {
			$ionicLoading.hide();
		});
	};

	$scope.$on('refresh', function() {
		$scope.doRefresh();
	});	

	$scope.doRefresh();

}]);