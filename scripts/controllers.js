var controll = angular.module('controllers', []);

controll.run(['$ionicPlatform', '$ionicHistory', '$rootScope', 'user', '$location', function($ionicPlatform, $ionicHistory, $rootScope, user, $location) {
	if (!user.isLoginLocal()) {
		$location.path('/login');
	}
}]);


/*
Main Controller
*/
controll.controller('IndexController', ['$scope', '$state', '$ionicHistory', '$location', '$ionicSideMenuDelegate', 'user', function($scope, $state, $ionicHistory, $location, $ionicSideMenuDelegate, user) {
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
		 return "http://localhost/perpus/lib/phpthumb/phpThumb.php?src=../../images/docs/" + argument + "&w=100";
	};


	$scope.reviews = [
	{
		name: "Afief Yona R",
		date: "10 Oktober 2015",
		content: "Proin euismod sapien quis libero luctus elementum. Mauris semper ullamcorper porta. Integer aliquam ullamcorper ante vel convallis. Fusce nec lacus quis mi accumsan lobortis. Aliquam erat volutpat. Nunc condimentum pharetra accumsan. Suspendisse pharetra convallis dui, eu faucibus eros rhoncus nec.",
		like: false,
		thumbnail: "img/afief.jpg"
	},
	{
		name: "Rizky Djati M",
		date: "9 Agustus 2015",
		content: "Proin euismod sapien quis libero luctus elementum. Mauris semper ullamcorper porta. Integer aliquam ullamcorper ante vel convallis. Fusce nec lacus quis mi accumsan lobortis. Aliquam erat volutpat. Nunc condimentum pharetra accumsan. Suspendisse pharetra convallis dui, eu faucibus eros rhoncus nec.",
		like: true,
		thumbnail: "img/djati.jpg"
	},
	{
		name: "Henida W",
		date: "6 Agustus 2015",
		content: "Proin euismod sapien quis libero luctus elementum. Mauris semper ullamcorper porta. Integer aliquam ullamcorper ante vel convallis. Fusce nec lacus quis mi accumsan lobortis. Aliquam erat volutpat. Nunc condimentum pharetra accumsan. Suspendisse pharetra convallis dui, eu faucibus eros rhoncus nec.",
		like: false,
		thumbnail: "img/nurul.jpg"
	}
	];

	$scope.messages = [
	{
		name: "Admin",
		date: "10 Oktober 2015",
		subject: "Teguran",
		content: "Buku `Merajut Untaian Rindu` telah melebihi waktu pengembalian.",
		thumbnail: "img/djati.jpg"
	},
	{
		name: "Admin",
		date: "3 Oktober 2015",
		subject: "Respon Tanggapan",
		content: "Terimakasih telah memberikan tanggapan pada tanggal 2 Oktober 2015. Kami akan terus memperbaiki aplikasi ini menjadi lebih baik. Terima kasih.",
		thumbnail: "img/nurul.jpg"
	}
	];


	$scope.borroweds = [
	{
		title: "The Forever War",
		author: "Joe Haldeman",		
		thumbnail: "img/books/book5.jpg",
		pages_count: 300,
		isbn: "9785412654856",
		year: 2000,
		date_borrow: "15 September 2015",
		date_return: "10 Oktober 2015"
	},
	{
		title: "Ender's Game",
		author: "Orson Scott",		
		thumbnail: "img/books/book6.jpg",
		pages_count: 210,
		isbn: "9785412654856",
		year: 2010,
		date_borrow: "12 September 2015",
		date_return: "13 Oktober 2015"
	},
	{
		title: "Merajut Untaian Rindu",
		author: "Alibaba Everest",		
		thumbnail: "img/books/book1.jpg",
		pages_count: 250,
		isbn: "9788935487965",
		year: 2015,
		date_borrow: "10 September 2015",
		date_return: "7 Oktober 2015"
	}
	];
}]);