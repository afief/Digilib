var lg = console.log.bind(console);
var lgi = console.log.bind(console);
var lge = console.log.bind(console);
var lgw = console.log.bind(console);


var apiUrl = "http://localhost/vlp/public_html/api/";//"http://128.199.172.146/esq/public_html/api/";//;//"; //
var userModule = angular.module("UserModule", [], ["$httpProvider", function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);

userModule.factory("user", ["$http","$q", "$rootScope", function($http, $q, $root) {

	var key = window.localStorage.getItem("vlp-key") || "";
	var isLogin = false;
	var withCookie = false;

	function changeKey(newKey) {
		key = newKey;
		window.localStorage.setItem("vlp-key", key);
		console.log("change key", key);
	}
	var serialize = function(obj, prefix) {
		var str = [];
		for(var p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push(typeof v == "object" ?
					serialize(v, k) :
					encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	};

	return {
		profile: {},
		getKey: function() {
			return key;
		},
		isLogin: function() {
			console.log(isLogin);
			return isLogin;
		},
		isLoginLocal: function() {
			return (key !== "");
		},
		login: function(email, password) {
			var defer = $q.defer();
			var ini = this;

			var credential = {email: email, password: password};

			$http.post(apiUrl + "login", serialize(credential)).
			success(function(data) {
				if (data.status) {

					changeKey(data.data);
					$http.defaults.headers.common.key = data.data;

					isLogin = true;		
					ini.cek();
					defer.resolve(true);
				} else {
					defer.reject(data.message);
				}
			}).
			catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		},
		register: function(full_name, email) {
			var defer = $q.defer();
			var ini = this;

			var credential = {
				full_name: full_name,
				email: email
			};

			$http.post(apiUrl + "register", serialize(credential)).
			success(function(data) {
				if (data.status) {
					defer.resolve(true);
				} else {
					defer.reject(data.message);
				}
			}).
			catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		},
		confirm: function(username, code) {
			var defer = $q.defer();
			var ini = this;

			var credential = {
				username: username,
				code: code
			};

			$http.post(apiUrl + "confirm", serialize(credential)).
			success(function(data) {
				if (data.status) {
					defer.resolve(true);
				} else {
					defer.reject(data.message);
				}
			}).
			catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		},
		changePassword: function(username, password, code) {
			var defer = $q.defer();
			var ini = this;

			var credential = {
				username: username,
				password: password,
				code: code
			};

			$http.post(apiUrl + "changePassword", serialize(credential)).
			success(function(data) {
				if (data.status) {
					defer.resolve(true);
				} else {
					defer.reject(data.message);
				}
			}).
			catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		},
		cekLocal: function() {
			lgi("cek local", key);

			if (key === "") {
				return $q.when({status: false});
			} else {
				return $q.when({status: true});
			}

		},
		cek: function() {
			var defer = $q.defer();
			var ini = this;
			
			if (key === "") {
				lgi("cek login", false);
				return $q.when({status: false});
			}

			$http.get(apiUrl + "user").
			success(function(data, status) {
				lgi("cek login", data.status, data.data);
				if (data.status) {
					isLogin = true;
					ini.profile = data.data;
					defer.resolve(data);
					$root.$broadcast("userProfileUpdated", ini.profile);
					lg("bradcast");
				} else if (data.hasOwnProperty("status")) {
					changeKey("");
					defer.resolve(data);
				} else {
					defer.reject(data);
				}
			}).
			catch(function(err) {
				defer.reject(data.message);
			});

			return defer.promise;
		},
		changeKey: changeKey,
		logout: function() {
			var defer  = $q.defer();
			var promise = $http.get(apiUrl + "logout").
			success(function(data) {
				if (data.status) {
					isLogin = false;
				}
				changeKey("");
				defer.resolve(true);
			}).
			catch(function(err) {
				changeKey("");
				defer.resolve(true);
			});

			return defer.promise;
		},

		saveLocalData: function(key, dat) {
			if (window.localStorage) {
				lgw("save local data", dat);
				window.localStorage.setItem(key, JSON.stringify(dat));
			}
		},
		getLocalData: function(key) {
			var res = {};
			if (window.localStorage) {
				var dat = window.localStorage.getItem(key);
				res = JSON.parse(dat);
				lgw("load local data", res);
			}
			return res;
		},

		getPakets: function() {
			var defer = $q.defer();

			$http.get(apiUrl + "pakets").
			success(function(data, status) {
				lgi("get pakets", data.status, data.data);
				if (data.status) {
					defer.resolve(data.data);
				} else {
					defer.reject(data);
				}
			}).
			catch(function(err) {
				defer.reject(data.message);
			});

			return defer.promise;
		},
		getPaket: function(slug) {
			var defer = $q.defer();

			$http.get(apiUrl + "paket/" + slug).
			success(function(data, status) {
				lgi("get paket detail", data.status, data.data);
				if (data.status) {
					defer.resolve(data.data);
				} else {
					defer.reject(data);
				}
			}).
			catch(function(err) {
				defer.reject(data.message);
			});

			return defer.promise;
		},
		getVideo: function(id) {
			var defer = $q.defer();

			$http.get(apiUrl + "video/" + id).
			success(function(data, status) {
				lgi("get video detail", data.status, data.data);
				if (data.status) {
					defer.resolve(data.data);
				} else {
					defer.reject(data);
				}
			}).
			catch(function(err) {
				defer.reject(data.message);
			});

			return defer.promise;
		}
	};

}]);

userModule.run(["user", "$rootScope", "$http", function(user, $root, $http) {
	$root.user = user;
	$http.defaults.headers.common.key = user.getKey();
	user.cek();
}]);


userModule.factory("connectivity", function() {
	return {
		checkStatus: function(hres) {
			if (hres.status <= 0)
				return "Koneksi mati. Mohon periksa kembali jaringan anda.";
			else if (hres <= 199)
				return "Gagal (" + hres.status + "): " + hres.statusText;
			else if (hres <= 299)
				return "Gagal mengambil data melalui akun anda. Cobalah untuk keluar, lalu masuk kembali ke aplikasi";
			else if (hres <= 399)
				return "Terjadi kesalahan koneksi. Koneksi dialihkan";
			else if (hres <= 499)
				return "Terjadi kesalahan ketika mengakses server.";
			else
				return "Terjadi kesalahan pada server. Hubungi administrator";
		}
	};
});
var mainApp = angular.module('digilib', ['ionic', 'controllers', 'UserModule']);

mainApp.run(['$ionicConfig', '$ionicPlatform', '$ionicHistory', '$rootScope', function($ionicConfig, $ionicPlatform, $ionicHistory, $rootScope) {

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

var controll = angular.module('controllers', []);

controll.run(['$ionicPlatform', '$ionicHistory', 'rootScope', function($ionicPlatform, $ionicHistory, $rootScope) {
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


	/* SAMPLE DATA */
	$scope.books = [
	{
		title: "Boneshaker",
		author: "Cherie Priest",
		thumbnail: "img/books/book1.jpg",
		rating: 3.5,
		review_count: 15,
		stock: {
			available: 5,
			total: 20
		},
		pages_count: 300,
		isbn: "9785412654856",
		year: 2000,
		shelf_number: 4.1,
	},
	{
		title: "The Anubis Gates",
		author: "Tim Powers",
		thumbnail: "img/books/book2.jpg",
		rating: 2.5,
		review_count: 17,
		stock: {
			available: 5,
			total: 34
		},
		pages_count: 250,
		isbn: "9856327594524",
		year: 2010,
		shelf_number: 5.324
	},
	{
		title: "The Time Traveler's Wife",
		author: "Audrey Niffenegger",
		thumbnail: "img/books/book3.jpg",
		rating: 4,
		review_count: 5,
		stock: {
			available: 15,
			total: 40
		},
		pages_count: 270,
		isbn: "9785454896326",
		year: 2013,
		shelf_number: 2.43
	},
	{
		title: "Fortune's Rocks",
		author: "Anita Shreve",
		thumbnail: "img/books/book4.jpg",
		rating: 4,
		review_count: 5,
		stock: {
			available: 15,
			total: 40
		},
		pages_count: 270,
		isbn: "9785454896326",
		year: 2013,
		shelf_number: 8.23
	}
	];

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
controll.controller('BukuController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info("Buku Controller");

	$scope.id = $state.params.id;
	$scope.book = $scope.books[$scope.id - 1];
	$scope.isFavorit = false;

	$scope.rating = 0;
	$scope.setRating = function(n) {
		$scope.rating = n;
	};
}]);
controll.controller('FavoritController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('FavoritController');

	$ionicHistory.clearHistory();

}]);
controll.controller('SendFeedbackController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('SendFeedbackController');

	$ionicHistory.clearHistory();

}]);
controll.controller('KoleksiController', ['$scope', '$state', '$ionicHistory', '$ionicLoading', 'user', function($scope, $state, $ionicHistory, $ionicLoading, user) {
	console.info("Koleksi Controller");

	$scope.openBook = function(n) {
		$state.go("app.buku", {id: n});
	};

	$ionicHistory.clearHistory();

	$scope.doRefresh = function() {
		$ionicLoading.show({
				template: 'Mengambil Buku'
			});
		window.setTimeout(function() {
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		}, 2000);

	};

}]);
controll.controller('LoginController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('LoginController');

	$ionicHistory.clearHistory();


	$scope.doLogin = function() {
		$state.go("app.koleksi");
	};

}]);
controll.controller('PemberitahuanController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info("PemberitahuanController");

	$ionicHistory.clearHistory();

}]);
controll.controller('PengaturanController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('PengaturanController');

	$ionicHistory.clearHistory();


	$scope.doLogout = function() {
		$state.go("app.login");
	};

}]);
controll.controller('PesanController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('PesanController');

	$ionicHistory.clearHistory();

}]);
controll.controller('PinjamanController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('PinjamanController');

	$ionicHistory.clearHistory();

}]);
controll.controller('ProfilController', ['$scope', '$state', '$ionicHistory', 'user', function($scope, $state, $ionicHistory, user) {
	console.info('ProfilController');

	$ionicHistory.clearHistory();

}]);