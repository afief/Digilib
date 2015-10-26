var mainApp = angular.module('digilib', ['ionic', 'controllers', 'UserModule']);

mainApp.run(function($ionicConfig, $ionicPlatform, $ionicHistory, $rootScope) {

	$ionicPlatform.ready(function() {

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});

	//$rootScope.user = user;

});

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

	.state('app.login', {
		url: '/login',
		views: {
			content: {
				templateUrl: 'templates/login.html',
				controller: 'LoginController'
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

	.state('app.pesan', {
		url: '/pesan',
		views: {
			content: {
				templateUrl: 'templates/pesan.html',
				controller: 'PesanController'
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
	;

	$urlRouterProvider.otherwise('/app/koleksi');
  

 
}]);
