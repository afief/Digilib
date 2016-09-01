controll.controller('BukuController', ['$scope', '$state', '$ionicHistory', 'user', '$ionicLoading', '$ionicPopup',
	function($scope, $state, $ionicHistory, user, $ionicLoading, $ionicPopup) {
	console.info("Buku Controller");

	$scope.id = $state.params.id;
	$scope.book = false;
	$scope.isFavorit = false;

	$ionicLoading.show({template: "Mengambil Data Buku"});
	user.getBook($scope.id).then(function (res) {
		onGetBook(res);	
		$ionicLoading.hide();
	}, function(err) {
		$ionicLoading.hide();
		console.log(err);
	});

	$scope.toggleFav = function () {
		if (!$scope.isFavorit) {
			$scope.isFavorit = true;
			user.setBookFav($scope.id);
		} else {
			$scope.isFavorit = false;
			user.unsetBookFav($scope.id);
		}
	};

	function onGetBook(res) {
		$scope.book = res;

		if (res.is_fav) {
			$scope.isFavorit = true;
		}
	}

	$scope.doOpenUser = function(memberId) {
		console.log(memberId);

		$ionicLoading.show({template: 'Mengambil data user'});
		user.getUserByMemberId(memberId).then(function(res) {
			$ionicLoading.hide();

			openUser(res);
		}, function() {
			$ionicLoading.hide();
		});
	};

	function openUser(member) {
		$scope.member = member;

		var popup = $ionicPopup.show({
			title: 'Member Info',
			cssClass: 'popup-member',
			templateUrl: 'templates/popup-user.html',
			scope: $scope,
			buttons: [{
				text: 'Tutup',
				type: 'button-default'
			}, {
				text: 'Kirim Pesan',
				type: 'button-positive',
				onTap: function(e) {
					$state.go('app.pesan-single', {member_id: member.member_id});
				}
			}]
		});
	}
}]);

controll.controller('BukuReviewController', ['$scope', '$state', '$ionicHistory', 'user', '$ionicLoading', '$ionicPopup',
	function($scope, $state, $ionicHistory, user, $ionicLoading, $ionicPopup) {
	console.info("Buku Controller");

	$scope.id = $state.params.id;
	$scope.book = false;
	$scope.rating = 0;
	$scope.comments = [];
	$scope.input = {
		comment: ""
	};

	$ionicLoading.show({template: "Mengambil Data Buku"});
	user.getBook($scope.id).then(function (res) {
		onGetBook(res);
		 $ionicLoading.hide();
	}, function(err) {
		$ionicLoading.hide();
		console.log(err);
	});

	$scope.setRating = function(n) {
		$scope.rating = n;
		user.setBookRate($scope.id, n).then(function(res) {
			console.log("Set Rate Success");
		});
	};

	$scope.doSendComment = function () {
		 if (!$scope.input.comment) {
		 	$ionicPopup.alert({
		 		title: "Data tidak lengkap",
		 		template: "Kolom komentar harus diisi."
		 	});
		 }

		 user.setBookComments($scope.id, $scope.input.comment).then(function (res) {
		 	$scope.comments.unshift(res);
		 	 $scope.input.comment = "";
		 }, function (err) {
		 	 if (typeof(err) == 'string') {
		 	 	$ionicPopup.alert({
		 	 		title: 'Gagal mengirim komentar',
		 	 		template: err
		 	 	});
		 	 }
		 });
	};

	function onGetBook(res) {
		$scope.book = res;
		if (res.own_rate){
			$scope.rating = res.own_rate;
		} else {
			$scope.rating = 0;
		}

		user.getBookComments($scope.id).then(function(res) {
			$scope.comments = res;
		});
	}
}]);