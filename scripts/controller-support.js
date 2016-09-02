controll.controller('SupportController', ['$scope', '$state', '$location', '$ionicHistory', 'user', '$ionicLoading', '$ionicPopup', 
	function($scope, $state, $location, $ionicHistory, user, $ionicLoading, $ionicPopup) {
	console.info('SupportController');

	$scope.input = {
		text: ''
	};

	$scope.doSend = function() {

		if ($scope.input.text) {
			$ionicLoading.show({template: 'Mengirim Pesan'});
			user.sendReport($scope.input.text).then(function() {
				$scope.input.text = '';
				$ionicLoading.hide();

				$ionicPopup.alert({
					title: 'Berhasil',
					template: 'Pertanyaan / saran telah terkirim. Mohon tunggu untuk balasan lebih lanjut dari kami melalui kotak pesan.'
				});
			}, function() {
				$ionicLoading.hide();
			});
		}
	};

}]);