var controll = angular.module('controllers', []);

controll.run(['$ionicPlatform', '$ionicHistory', '$rootScope', 'user', '$location', function($ionicPlatform, $ionicHistory, $rootScope, user, $location) {
	if (!user.isLoginLocal()) {
		$location.path('/login');
	}
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
	$scope.getBookThumbnail = function (argument) {
		return argument;
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