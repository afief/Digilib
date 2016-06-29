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
//	user.cek();
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