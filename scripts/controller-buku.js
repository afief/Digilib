controll.controller('BukuController', ['$scope', '$state', '$ionicHistory', 'user', '$ionicLoading', '$ionicPopup', '$timeout',
	function($scope, $state, $ionicHistory, user, $ionicLoading, $ionicPopup, $timeout) {
	console.info("Buku Controller");

	$scope.id = $state.params.id;
	$scope.book = false;
	$scope.isFavorit = false;
	$scope.isReserve = false;

	$scope.doRefresh = function() {
		$ionicLoading.show({template: "Mengambil Data Buku"});
		user.getBook($scope.id).then(function (res) {
			onGetBook(res);	
			$ionicLoading.hide();
		}, function(err) {
			$ionicLoading.hide();
			console.log(err);
			$state.go('app.koleksi');
		});
	};
	$scope.doRefresh();

	$scope.toggleFav = function () {
		if (!$scope.isFavorit) {
			$scope.isFavorit = true;
			user.setBookFav($scope.id);
		} else {
			$scope.isFavorit = false;
			user.unsetBookFav($scope.id);
		}
	};

	$scope.doReservasi = function() {
		if (!$scope.isReserve) {
			user.setBookReserve($scope.book.biblio_id).then(function(res) {
				$ionicPopup.alert({title: "Reservasi", template: res});
				$scope.doRefresh();
			}, function(err) {
				if (typeof(err) == 'string') {
					$ionicPopup.alert({title: "Reservasi", template: err});
				}
			});

		} else {
			$ionicPopup.alert({title: "Reservasi", template: "Sudah direservasi."});
		}
	};

	$scope.dontReservasi = function() {
		if ($scope.isReserve) {
			user.unsetBookReserve($scope.book.biblio_id).then(function(res) {
				$scope.doRefresh();
			}, function(err) {
				if (typeof(err) == 'string') {
					$ionicPopup.alert({title: "Reservasi", template: err});
				}
			});

		} else {
			$ionicPopup.alert({title: "Reservasi", template: "Belum direservasi."});
		}
	};

	function onGetBook(res) {
		$scope.book = res;

		if (res.is_fav) {
			$scope.isFavorit = true;
		} else {
			$scope.isFavorit = false;
		}
		if (res.is_reserve) {
			$scope.isReserve = true;
		} else {
			$scope.isReserve = false;
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
					$timeout(function() {
						sendMessage(member.member_id);
					}, 500);
				}
			}]
		});
	}

	function sendMessage(memberId) {
		$scope.input = {
			member_id: memberId,
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
					}, function(err) {
						$ionicLoading.hide();
						if (typeof(err) == 'string') {
							alert(err);
						}
					});
				}
			}]
		});
	}

	$scope.doShare = function() {
		if (window.hasOwnProperty('plugins') && window.plugins.hasOwnProperty('socialsharing')) {
			window.plugins.socialsharing.share($scope.book.title, $scope.book.notes, $scope.book.image, webUrl + "index.php?p=show_detail&id=" + $scope.book.biblio_id);
		}
	};

	$scope.$on('refresh', function() {
		$scope.doRefresh();
	});
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

	$scope.doRefresh = function() {
		$ionicLoading.show({template: "Mengambil Data Buku"});
		user.getBook($scope.id).then(function (res) {
			onGetBook(res);
			 $ionicLoading.hide();
		}, function(err) {
			$ionicLoading.hide();
			console.log(err);
			$state.go('app.koleksi');
		});
	};
	$scope.doRefresh();

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

	$scope.$on('refresh', function() {
		$scope.doRefresh();
	});
}]);