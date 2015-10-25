angular.module('digilib', ['ionic', 'controllers', 'UserModule'])

.run(function($ionicConfig, $ionicPlatform, $ionicHistory, $rootScope) {
	//$ionicConfig.views.transition("ios");

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

})

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
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

	.state('app.buku', {
		url: '/buku/:id',
		views: {
			content: {
				templateUrl: 'templates/buku.html',
				controller: 'BukuController'
			}
		}
	});

	$urlRouterProvider.otherwise('/app/koleksi');
  

 
}]);
