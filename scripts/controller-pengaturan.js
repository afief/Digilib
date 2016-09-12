controll.controller('PengaturanController', ['$scope', '$state', '$location', '$ionicHistory', 'user', function($scope, $state, $location, $ionicHistory, user) {
	console.info('PengaturanController');

	$ionicHistory.clearHistory();

	$scope.setting = {
		notif_email: user.profile.setting.notif_email == '1',
		notif_app: user.profile.setting.notif_app == '1'
	};

	$scope.$on("$ionicView.enter", function() {
		$scope.setting = {
			notif_email: user.profile.setting.notif_email == '1',
			notif_app: user.profile.setting.notif_app == '1'
		};
	});

	$scope.doUpdateSetting = function() {
		var setting = {
			notif_email: ($scope.setting.notif_email ? '1' : '0'),
			notif_app: ($scope.setting.notif_app ? '1' : '0')
		};

		user.updateUserSetting(setting);
	};


	$scope.doLogout = function() {
		user.logout();
		$location.path("/login");
	};

	$scope.doOpenAbout = function() {
		$state.go('app.about');
	};

	$scope.doOpenSupport = function() {
		$state.go('app.support');
	};

}]);