controll.controller('ProfilController', ['$scope', '$state', '$ionicHistory', 'user', '$ionicLoading', '$timeout', '$ionicPopup', function($scope, $state, $ionicHistory, user, $ionicLoading, $timeout, $ionicPopup) {
	console.info('ProfilController');

	$ionicHistory.clearHistory();

	$scope.edit = {
		member_name: user.profile.member_name,
		member_phone: user.profile.member_phone,
		member_address: user.profile.member_address
	};

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

	$scope.isEditName = false;
	$scope.editName = function() {
		if (!$scope.isEditName) {
			$scope.edit.member_name = user.profile.member_name;
			$scope.isEditName = true;
		}
	};

	$scope.saveBio = function() {
		$ionicLoading.show({template: 'Menyimpan Biodata'});
		user.saveBio($scope.edit).then(function() {
			user.profile.member_phone = $scope.edit.member_phone;
			user.profile.member_address = $scope.edit.member_address;
			user.profile.member_name = $scope.edit.member_name;

			$scope.isEditPhone = false;
			$scope.isEditAddress = false;
			$scope.isEditName = false;
			$ionicLoading.hide();
		}, function() {
			$ionicLoading.hide();
		});
	};

	$scope.doChangeAvatar = function() {
		if (window.imagePicker) {
			window.imagePicker.getPictures(
			function(results) {
				if (results.length > 0) {
					uploadFile(results[0]);
				} else {
					alert("Image Not Detected");
				}
			}, function (error) {
				alert('Error: ' + error);
			}, {
				maximumImagesCount: 1,
				width: 200
			});
		} else {
			alert("tanpa imagePicker");
			document.getElementById("userImageEl").click();
		}
	};
	
	$scope.changeImage = function(f) {
		if (f.files.length > 0) {
			var file = f.files[0];

			$ionicLoading.show({template: "Ganti Profil"});
			user.changeAvatar(file).then(function(url) {
				$ionicLoading.hide();

				$timeout(function() {
					user.profile.member_image = url;
				}, 200);

			}, function(err) {
				$ionicLoading.hide();
				if (typeof(err) == 'string') {
					$ionicPopup.alert({template: err, title: "Gagal"});
				} else {
					$ionicPopup.alert({template: "Gagal ganti avatar", title: "Gagal"});
				}
			});
		}
	};

	function uploadFile(fileURL) {
		/* upload avatar ke server */
		if (FileUploadOptions && FileTransfer) {
			$ionicLoading.show({template: "Ganti Profil"});

			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
			options.mimeType = "image/jpg";

			var headers = {'token': user.getKey()};
			options.headers = headers;

			var ft = new FileTransfer();
			ft.upload(fileURL, encodeURI(apiUrl + "user/avatar"), function(res) {
				$ionicLoading.hide();
				try {
					var dres = JSON.parse(res.response);
					if (dres.status) {

						$timeout(function() {
							user.profile.member_image = dres.data;
						}, 200);
						
						return;
					} else {
						alert("gagal : " + res.response);
					}
				} catch (e) {
					alert("error : " + res.response);
				}

				//success callback
			}, function() {
				//error callback
				$ionicLoading.hide();
				$ionicPopup.alert({template: "Ganti Avatar Gagal.", title: "Gagal"});
			}, options);
		} else {
			$ionicPopup.alert("Kesalahan pengolahan gambar.");
		}
	}

}]);