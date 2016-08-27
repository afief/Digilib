controll.controller('PemberitahuanController', ['$scope', '$state', '$ionicHistory', 'user', '$ionicLoading', function($scope, $state, $ionicHistory, user, $ionicLoading) {
	console.info("PemberitahuanController");

	$ionicHistory.clearHistory();

	$scope.notifs = [];

	$scope.doRefresh = function() {
		$ionicLoading.show({template: 'Mengambil Data Notifikasi'});
		user.getNotif().then(function(res) {
			$scope.notifs = res;

			reads();

			$ionicLoading.hide();
		}, function() {
			$ionicLoading.hide();
		});
	};

	$scope.$on('refresh', function() {
		$scope.doRefresh();
	});	

	$scope.doRefresh();


	function reads() {
		var ids = [];
		for (var i = 0; i < $scope.notifs.data.length; i++) {
			if ($scope.notifs.data[i].is_read == '0')
				ids.push($scope.notifs.data[i].id);
		}

		if (ids.length) {
			user.postNotifRead(ids).then(function(res) {
				console.log("Notif Read", res);
			}, function() {

			});
		}
	}
}]);