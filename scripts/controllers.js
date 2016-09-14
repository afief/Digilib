var controll = angular.module('controllers', []);

controll.run(['$rootScope', '$ionicPlatform', '$ionicHistory', '$rootScope', 'user', '$location', '$timeout', function($root, $ionicPlatform, $ionicHistory, $rootScope, user, $location, $timeout) {
	if (!user.isLoginLocal()) {
		$location.path('/login-home');
	}

	$root.notifCount = 0;

	/* Handle Notifikasi */
	$root.$on('notification', function(event, res) {
		console.log(res, $location.$$path, res.path);

		$timeout(function() {
			if (res.foreground) {

				if ($location.$$path.indexOf(res.path) >= 0) {
					console.log("refresh");
					$root.$broadcast("refresh");
				} else {
					if ($location.$$path == "/app/pemberitahuan") {
						$root.$broadcast("refresh");
						$root.notifCount = 0;
					} else {
						$root.notifCount++;
					}
				}

			} else {
				if (res.path) {
					$location.path(res.path);
				}
			}
		}, 1000);
	});

	/*$timeout(function() {
		$rootScope.$broadcast("notification", {
	        "message": "Notifikasi dari Perpustakaan Labschool UPI. Oke?",
	        "title": "Mobile APP Library 2.0",
	        "path": "/app/pesan"
    	});	
	}, 2000);*/
}]);


/*
Main Controller
*/
controll.controller('IndexController', ['$scope', '$state', '$ionicHistory', '$location', '$ionicSideMenuDelegate', 'user', '$ionicPopover', 
	function($scope, $state, $ionicHistory, $location, $ionicSideMenuDelegate, user, $ionicPopover) {
	console.info("IndexController");

	$scope.$on('$ionicView.enter', function(e, ts) {
		//lgi("enter", e, ts);
	});
	$scope.$on('$ionicView.leave', function(e, fs) {
		//lgi("leave", e, fs);
	});

	$scope.isBackButtonShow = function() {
		return $ionicHistory.backView() !== null;
	};
	$scope.changeState = function(to) {
		if ($ionicSideMenuDelegate.isOpenLeft()) {
			$ionicSideMenuDelegate.toggleLeft();
		}
		$state.go(to);
	};
	$scope.getColor = function (id) {
		id = id || 0;
		var colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#E65100", "#33691E", "#827717", "#006064", "#01579B", "#009688", "#424242"];
		if (id >= colors.length) {
			id = id % colors.length;
		}

		return colors[id];
	};
	$scope.getBookThumbnail = function (url) {
		if (url) {
			return url;
		}
		return '';
		 //return "http://localhost/perpus/lib/phpthumb/phpThumb.php?src=../../images/docs/" + argument + "&w=100";
	};

	$scope.getMemberAvatar = function (url) {
		if (url) {
			return url;
		} else {
			return 'img/default-user-image.png';
		}
	};


	/*
	 * Popup Kanan Atas
	 */
	$ionicPopover.fromTemplateUrl('menu-pop.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popTopRight = popover;
	});
	$scope.showRightMenu = function($event) {
		$scope.popTopRight.show($event);
	};

	$scope.$on('$destroy', function() {
		$scope.popTopRight.remove();
	});

	$scope.doViewRefresh = function() {
		$scope.popTopRight.hide();

		$scope.$broadcast('refresh');
	};

	$scope.doViewHelp = function() {
		$scope.popTopRight.hide();
	};
}]);