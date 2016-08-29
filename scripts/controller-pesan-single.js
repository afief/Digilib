controll.controller('PesanSingleController', ['$scope', '$state', 'user', '$ionicLoading', '$ionicPopup', '$stateParams', '$ionicScrollDelegate',
	function($scope, $state, user, $ionicLoading, $ionicPopup, $stateParams, $ionicScrollDelegate) {
	console.info('PesanController');

	var sdel = $ionicScrollDelegate.$getByHandle('chatScroll');

	if (!$stateParams.member_id) {
		$state.go('app.pesan');
	}

	$scope.member_id = $stateParams.member_id;

	$scope.text = '';

	$scope.messages = [];
	$scope.doRefresh = function() {
		$ionicLoading.show({template: 'Mengambil Pesan'});
		user.getMessageTexts($stateParams.member_id).then(function(res) {
			$scope.messages = res;
			sdel.scrollBottom();
			$ionicLoading.hide();
		}, function() {
			$ionicLoading.hide();
		});
	};

	$scope.doRefresh();

	$scope.sendMessage = function() {
		$ionicLoading.show({template: 'Mengirim Pesan'});
		user.postMessage($stateParams.member_id, $scope.text).then(function() {
			$ionicLoading.hide();
			$scope.text = '';
			$scope.doRefresh();
		}, function() {
			$ionicLoading.hide();
		});
	};

	$scope.$on('refresh', function() {
		$scope.doRefresh();
	});	

}]);