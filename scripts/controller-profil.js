controll.controller('ProfilController', ['$scope', '$state', '$ionicHistory', 'user', '$ionicLoading', function($scope, $state, $ionicHistory, user, $ionicLoading) {
	console.info('ProfilController');

	$ionicHistory.clearHistory();

	$scope.edit = {
		member_phone: '',
		member_address: ''
	};

	$scope.edit.member_phone = user.profile.member_phone;
	$scope.edit.member_address = user.profile.member_address;

	$scope.isEditPhone = false;
	$scope.editPhone = function() {
		if (!$scope.isEditPhone) {
			$scope.edit.member_phone = user.profile.member_phone;
			$scope.isEditPhone = true;
		}
	};

	$scope.isEditAddress = false;
	$scope.editAddress = function() {
		if (!$scope.isEditAddress) {
			$scope.edit.member_address = user.profile.member_address;
			$scope.isEditAddress = true;
		}
	};

	$scope.saveBio = function() {
		$ionicLoading.show({template: 'Menyimpan Biodata'});
		user.saveBio($scope.edit).then(function() {
			user.profile.member_phone = $scope.edit.member_phone;
			user.profile.member_address = $scope.edit.member_address;

			$scope.isEditPhone = false;
			$scope.isEditAddress = false;
			$ionicLoading.hide();
		}, function() {
			$ionicLoading.hide();
		});
	};

}]);