controll.controller('PesanController', ['$scope', '$state', '$ionicHistory', 'user', '$ionicLoading', '$ionicPopup', function($scope, $state, $ionicHistory, user, $ionicLoading, $ionicPopup) {
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

	$scope.newMessage = function() {
		$scope.input = {
			member_id: '',
			text: ''
		};

		var popup = $ionicPopup.show({
			title: 'Kirim Pesan',
			cssClass: 'new-message',
			templateUrl: 'templates/popup-newmessage.html',
			scope: $scope,
			buttons: [{
				text: 'Batal',
				type: 'button-default'
			}, {
				text: 'Kirim',
				type: 'button-positive',
				onTap: function(e) {
					e.preventDefault();
					$ionicLoading.show({template: 'Mengirim Pesan'});
					user.postMessage($scope.input.member_id, $scope.input.text).then(function() {
						$ionicLoading.hide();
						popup.close();
						$scope.doRefresh();
					}, function(err) {
						$ionicLoading.hide();
						if (typeof(err) == 'string') {
							alert(err);
						}
					});
				}
			}]
		});
	};

}]);