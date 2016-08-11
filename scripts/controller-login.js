controll.controller('LoginController', ['$scope', '$location', '$ionicHistory', 'user', '$ionicPopup', '$ionicLoading', function($scope, $location, $ionicHistory, user, $ionicPopup, $ionicLoading) {
	console.info('LoginController');

	$ionicHistory.clearHistory();
	$scope.data = {
		username: '',
		password: ''
	};

	$scope.doLogin = function() {
		console.log("login", $scope.data.username);
		if($scope.data.username === "") {
			$ionicPopup.alert({
				template: "Username / Email tidak boleh kosong.",
				title: "Data Tidak Lengkap"
			});
		} else if ($scope.data.password === "") {
			$ionicPopup.alert({
				template: "Password tidak boleh kosong.",
				title: "Data Tidak Lengkap"
			});
		} else {
			$ionicLoading.show({template: "Memproses Login"});
			user.login($scope.data.username, $scope.data.password).then(function(res) {
				$location.path("/app/koleksi");
				$ionicLoading.hide();
			}, function(err) {
				$ionicLoading.hide();
				$ionicPopup.alert({
					template: err,
					title: "Gagal"
				});
			});
		}
	};

	$scope.openRegister = function() {
		$location.path('register');
	};

}]);


controll.controller('RegisterController', ['$scope', '$location', '$ionicHistory', 'user', '$ionicPopup', '$ionicLoading', function($scope, $location, $ionicHistory, user, $ionicPopup, $ionicLoading) {
	console.log("RegisterController");

	$scope.data = {
		member_id: '',
		member_name: '',
		email: '',
		member_phone: '',
		password: ''
	};

	$scope.openLogin = function() {
		$location.path('login');
	};

	$scope.doRegister = function() {
		var mailtest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	
		if (!$scope.data.member_id || ($scope.data.member_id.length < 5)) {
			$ionicPopup.alert({
				template: "Member ID tidak boleh kosong. Minimal 5 Karakter.",
				title: "Data Tidak Lengkap"
			});
		} else if (!$scope.data.member_name || ($scope.data.member_name.length < 5)) {
			$ionicPopup.alert({
				template: "Nama Lengkap tidak boleh kosong. Minimal 5 Karakter.",
				title: "Data Tidak Lengkap"
			});
		} else if (!$scope.data.email) {
			$ionicPopup.alert({
				template: "Email tidak boleh kosong.",
				title: "Data Tidak Lengkap"
			});
		} else if (!mailtest.test($scope.data.email)) {
			$ionicPopup.alert({
				template: "Format Email tidak benar.",
				title: "Data Tidak Lengkap"
			});
		} else if (!$scope.data.member_phone && ($scope.data.member_phone.length < 5)) {
			$ionicPopup.alert({
				template: "Nomor HP tidak boleh kosong.",
				title: "Data Tidak Lengkap"
			});
		} else if (!$scope.data.password || ($scope.data.password.length < 6) || ($scope.data.password != $scope.data.password2)) {
			$ionicPopup.alert({
				template: "Password tidak boleh kosong dan minimal mengandung 6 karakter. Kedua password harus sama.",
				title: "Data Tidak Lengkap"
			});
		} else {
			$ionicLoading.show({template: "Memproses Registrasi"});
			user.register($scope.data).then(function() {
				$location.path('/app/koleksi');
				$ionicLoading.hide();
			}, function(err) {
				$ionicLoading.hide();
				$ionicLoading.hide();
				$ionicPopup.alert({
					template: err,
					title: "Gagal"
				});
			});
		}
	};
}]);