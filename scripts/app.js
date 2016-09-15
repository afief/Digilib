var mainApp = angular.module('digilib', ['ionic', 'controllers', 'UserModule', 'SettingModule', 'ngFileUpload', 'PushModule']);

mainApp.run(['$ionicConfig', '$ionicPlatform', '$ionicHistory', '$rootScope', 'user', '$ionicPopup', function($ionicConfig, $ionicPlatform, $ionicHistory, $rootScope, user, $ionicPopup) {

	user.getVersion(app_version).then(function(res) {
		$ionicPopup.alert({
			title: res.title,
			template: res.text
		}).then(function() {
			window.open(res.gplay, "_system");
		});
	});

	$rootScope.version_text = app_version_text;

	$ionicPlatform.ready(function() {

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});

	if (screen.lockOrientation) {
		screen.lockOrientation('portrait');
	}

	if (window.cordova && window.cordova.plugins && window.cordova.plugins.autoStart) {
		alert("autoStart");
		cordova.plugins.autoStart.enable();
	}

	$rootScope.getVersion = function() {
		return app_version_text;
	};

	//$rootScope.user = user;

}]);

mainApp.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	//$ionicConfigProvider.views.transition('ios');
    $ionicConfigProvider.tabs.style('standard').position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center').positionPrimaryButtons('left');

	$stateProvider

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/index.html',
		controller: 'IndexController'
	})

	.state('app.koleksi', {
		url: '/koleksi',
		views: {
			historyRoot: true,
			content: {
				templateUrl: 'templates/koleksi.html',
				controller: 'KoleksiController'
			}
		}
	})

	.state('app.profil', {
		url: '/profil',
		views: {
			content: {
				templateUrl: 'templates/profil.html',
				controller: 'ProfilController'
			}
		}
	})

	.state('app.buku', {
		url: '/buku/:id',
		views: {
			content: {
				templateUrl: 'templates/buku.html',
				controller: 'BukuController'
			}
		}
	})

	.state('app.buku-review', {
		url: '/buku/:id/review',
		views: {
			content: {
				templateUrl: 'templates/buku-review.html',
				controller: 'BukuReviewController'
			}
		}
	})

	.state('app.pesan', {
		url: '/pesan',
		views: {
			content: {
				templateUrl: 'templates/pesan.html',
				controller: 'PesanController'
			}
		}
	})

	.state('app.pesan-single', {
		url: '/pesan-single/:member_id',
		views: {
			content: {
				templateUrl: 'templates/pesan-single.html',
				controller: 'PesanSingleController'
			}
		}
	})

	.state('app.pemberitahuan', {
		url: '/pemberitahuan',
		views: {
			content: {
				templateUrl: 'templates/pemberitahuan.html',
				controller: 'PemberitahuanController'
			}
		}
	})

	.state('app.pinjaman', {
		url: '/pinjaman',
		views: {
			content: {
				templateUrl: 'templates/pinjaman.html',
				controller: 'PinjamanController'
			}
		}
	})

	.state('app.reservasi', {
		url: '/reservasi',
		views: {
			content: {
				templateUrl: 'templates/reservasi.html',
				controller: 'ReservasiController'
			}
		}
	})

	.state('app.favorit', {
		url: '/favorit',
		views: {
			content: {
				templateUrl: 'templates/favorit.html',
				controller: 'FavoritController'
			}
		}
	})

	.state('app.send_feedback', {
		url: '/send-feedback',
		views: {
			content: {
				templateUrl: 'templates/send-feedback.html',
				controller: 'SendFeedbackController'
			}
		}
	})

	.state('app.pengaturan', {
		url: '/pengaturan',
		views: {
			content: {
				templateUrl: 'templates/pengaturan.html',
				controller: 'PengaturanController'
			}
		}
	})

	.state('app.about', {
		url: '/about',
		views: {
			content: {
				templateUrl: 'templates/about.html'
			}
		}
	})

	.state('app.support', {
		url: '/support',
		views: {
			content: {
				templateUrl: 'templates/support.html',
				controller: 'SupportController'
			}
		}
	})

	.state('login-home', {
		url: '/login-home',
		templateUrl: 'templates/login-home.html',
		controller: 'LoginController'
	})
	.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'LoginController'
	})
	.state('register', {
		url: '/register',
		templateUrl: 'templates/login-register.html',
		controller: 'RegisterController'
	})
	;

	$urlRouterProvider.otherwise('/app/koleksi');
  

 
}]);


mainApp.filter('goodate', function() {
  return function(input) {
  	if (input) {
	  	var d = new Date(input);
	  	var m = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
	  	var r = d.getDate() + " " + m[d.getMonth()] + " " + d.getFullYear() + ", " + d.getHours().toStringZero(2) + ":" + d.getMinutes().toStringZero(2);
	  	return r;
	  } else {
	  	return "-";
	  }
  };
});