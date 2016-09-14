var userModule = angular.module("UserModule", [], ["$httpProvider", function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);

userModule.factory("user", ["$http","$q", "$rootScope", "Upload", "setting", "pushNotif", function($http, $q, $root, Upload, setting, pushNotif) {

	window.f = $http;
	
	var key = window.localStorage["digilib-upi"] || "";
	var isLogin = false;
	var withCookie = false;
	var localProfile = setting.get("profile") || {};

	$http.defaults.headers.common.token = key;

	function changeKey(newKey) {
		key = newKey;
		$http.defaults.headers.common.token = key;
		window.localStorage["digilib-upi"] = key;
		console.log("change key", key);
	}
	serialize = function(obj, prefix) {
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
	function createGetRequest(uri, saveCall) {
		var defer  = $q.defer();

		if (uri.indexOf('?') >= 0) {
			uri += '&buzzdata=' + (new Date()).getTime().toString();
		} else {
			uri += '?buzzdata=' + (new Date()).getTime().toString();
		}

		var promise = $http.get(apiUrl + uri).
		success(function(data) {
			if (data.status) {
				defer.resolve(data.data);
			} else {
				defer.reject(data.message);
			}
		}).
		catch(function(err) {
			defer.reject(err);
		});

		return defer.promise;
	}
	function createPostRequest(uri, params) {
		var defer  = $q.defer();

		if (uri.indexOf('?') >= 0) {
			uri += '&buzzdata=' + (new Date()).getTime().toString();
		} else {
			uri += '?buzzdata=' + (new Date()).getTime().toString();
		}

		var promise = $http.post(apiUrl + uri, serialize(params)).
		success(function(data) {
			if (data.status) {
				defer.resolve(data.data);
			} else {
				defer.reject(data.message);
			}
		}).
		catch(function(err) {
			defer.reject(err);
		});

		return defer.promise;
	}
	function createUploadRequest(uri, file, data) {
		var defer = $q.defer();

		Upload.upload({
			url: apiUrl + uri,
			method: 'POST',
			file: file,
			sendFieldsAs: 'form',
			fields: data
		}).progress(function (evt) {
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			defer.notify(progressPercentage);
		}).success(function (data, status, headers, config) {
			if (data.status) {
				defer.resolve(data.data);
			} else {
				defer.reject(data.message);
			}
		}).error(function (data, status, headers, config) {
			defer.reject("connection_failed");
		});

		return defer.promise;
	}

	return {
		get profile() {
			return localProfile;
		},
		set profile(val) {
			localProfile = val;
		},
		getKey: function() {
			return key;
		},
		setKey: function(key) {
			changeKey(key);

			if (key)
				isLogin = true;
			this.cek();
		},
		isLogin: function() {
			lgi("isLogin", isLogin);
			return isLogin;
		},
		isLoginLocal: function() {
			return (key !== "");
		},
		login: function(email, password) {
			var defer = $q.defer();
			var ini = this;

			var credential = {email: email, password: password};

			$http.post(apiUrl + "auth/login", serialize(credential)).
			success(function(data) {
				if (data.status) {
					if (data.data && data.data.token) {
						changeKey(data.data.token);

						isLogin = true;
						ini.cek();

						if (pushNotif.regId) {
							ini.updateRegId(pushNotif.regId);
						}

						defer.resolve(true);
					} else {
						defer.reject("Gagal mengambil token login.");
					}
				} else {
					if (data.message && (typeof data.detail == "string")) {
						defer.reject(data.detail);
					} else {
						defer.reject("Username / Password salah");
					}
				}
			}).
			catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		},
		register: function(registerData) {
			var defer = $q.defer();
			var ini = this;

			$http.post(apiUrl + "auth/register", serialize(registerData)).
			success(function(data) {
				if (data.status) {
					if (data.data && data.data.token) {
						changeKey(data.data.token);

						isLogin = true;		
						ini.cek();

						if (pushNotif.regId) {
							ini.updateRegId(pushNotif.regId);
						}
						
						defer.resolve(true);
					} else {
						defer.reject("Gagal mengambil token login.");
					}
				} else {
					if (data.message && (typeof data.message == "string")) {
						defer.reject(data.message);
					} else {
						defer.reject("Username / Password salah");
					}
				}
			}).
			catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		},
		changeAvatar: function(file) {
			var defer = $q.defer();

			Upload.upload({
				url: apiUrl + "user/avatar",
				method: 'POST',
				file: file,
				sendFieldsAs: 'form',
				fields: {
				}
			}).progress(function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				defer.notify(progressPercentage);
			}).success(function (data, status, headers, config) {
				console.log(data);
				if (data.status)
					defer.resolve(data.data);
				else
					defer.reject(false);
			}).error(function (data, status, headers, config) {
				console.log(data);
				defer.reject(false);
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
				return $q.when({status: false});
			}

			$http.get(apiUrl + "user").
			success(function(data, status) {
				lgi("cek login", data.status, data.data);
				if (data.status) {
					isLogin = true;


					ini.profile = data.data;
					if (!ini.profile.member_image) {
						ini.profile.member_image = "img/default-user-image.png";
					} else {
						setting.resolveOnlineImage(ini.profile.member_image).then(function(url) {
							ini.profile.member_image = url;
						});
					}
					setting.set("profile", ini.profile);

					defer.resolve(data.data);

					$root.$broadcast("onuser", ini.profile);

				} else if (data.hasOwnProperty("status") && (data.message == "forbidden")) {
					changeKey("");
					defer.reject(data);
				} else if (data.hasOwnProperty('message')) {
					defer.reject(data.message);
				} else {
					defer.reject(JSON.stringify(data));
				}
			}).
			catch(function(err) {
				defer.reject(JSON.stringify(err));
			});

			return defer.promise;
		},
		changeKey: changeKey,
		logout: function() {
			var defer  = $q.defer();
			var promise = $http.get(apiUrl + "logout").
			success(function(data) {
				isLogin = false;
				changeKey("");
				defer.resolve(true);
			}).
			catch(function(err) {
				isLogin = false;
				changeKey("");
				defer.resolve(true);
			});

			return defer.promise;
		},
		saveBio: function(bio) {
			return createPostRequest('user', bio);
		},

		updateUserSetting: function(setting) {
			return createPostRequest('user/setting', setting);
		},

		getBooks: function (params) {
			var str = "";
			if (params) {
				str = '?' + serialize(params);
			}
			return createGetRequest('books' + str);
		},
		getBook: function (biblio_id) {
			 return createGetRequest('book/' + biblio_id);
		},
		getBookRate: function (biblio_id) {
			 return createGetRequest('book/' + biblio_id + '/rate');
		},
		setBookRate: function (biblio_id, rate) {
			 return createPostRequest('book/' + biblio_id + '/rate', {rate: rate});
		},
		getBookComments: function (biblio_id) {
			 return createGetRequest('book/' + biblio_id + '/comments');
		},
		setBookComments: function (biblio_id, text) {
			 return createPostRequest('book/' + biblio_id + '/comment', {text: text});
		},
		setBookFav: function (biblio_id) {
			 return createPostRequest('book/' + biblio_id + '/favorit');
		},
		unsetBookFav: function (biblio_id) {
			 return createPostRequest('book/' + biblio_id + '/unfavorit');
		},

		getBookLoans: function () {
			 return createGetRequest('user/books');
		},
		getBookReserve: function() {
			return createGetRequest('books/reserve');
		},
		setBookReserve: function(biblio_id) {
			return createPostRequest('books/reserve', {biblio_id: biblio_id});
		},
		unsetBookReserve: function(biblio_id) {
			return createPostRequest('books/unset-reserve', {biblio_id: biblio_id});
		},

		getMessageList: function() {
			return createGetRequest('messages');
		},
		getMessageTexts: function(member_id) {
			return createGetRequest('message/' + member_id);
		},
		postMessage: function(member_id, text) {
			return createPostRequest('message', {
				member_id: member_id,
				text: text
			});
		},

		getTopics: function() {
			return createGetRequest('books/topics');
		},

		getNotif: function() {
			return createGetRequest('notif');
		},
		postNotifRead: function(ids) {
			return createPostRequest('notif/read', {
				notif_id: ids
			});
		},

		getVersion: function(v) {
			return createGetRequest('check-version/' + v);
		},

		getUserByMemberId: function(memberId) {
			return createGetRequest('user/id/' + memberId);
		},

		sendReport: function(text) {
			return createPostRequest('report', {text: text});
		},

		updateRegId: function(regId) {
			return createPostRequest('user/reg-id', {reg_id: regId});
		}
	};

}]);

userModule.run(["user", "$rootScope", "$http", "$ionicPlatform", "$location", "pushNotif", function(user, $rootScope, $http, $ionicPlatform, $location, pushNotif) {
	$ionicPlatform.ready(function() {
		console.log("Ionic Ready");
		$rootScope.user = user;
		user.cek().then(function() {

		}, function() {
			$location.path('/login');
		});
	});

	$rootScope.$on("push-registered", function() {
		console.log("push-registered");
		if (user.isLoginLocal()) {
			if (pushNotif.regId) {
				user.updateRegId(pushNotif.regId);
			}
		}
	});
}]);
