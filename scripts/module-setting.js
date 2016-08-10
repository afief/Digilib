var settingModule = angular.module("SettingModule", []);

settingModule.factory("setting", ["$rootScope", "$q", function($root, $q) {

	return {
		set: function(key, data) {
			if (!window.localStorage)
				return false;

			if (typeof data == "object") {
				data = JSON.stringify(data);
			}	

			/*if (!data || (data == "null"))
			console.info("remove local data ", key, data);*/

			window.localStorage[key] = data;
			return true;
		},
		get: function(key) {
			if (window.localStorage) {
				var str = window.localStorage[key];
				//console.log(key, str);
				if (str) {
					
					try {
						var data = JSON.parse(str);
						/*console.log("get local data", key, data);*/
						return data;
					} catch(e) {
						if (str == "undefined") {	
							return undefined;
						}
						if (str == "false") {	
							return false;
						}
						return str;
					}
					
				}
				if (str == "undefined") {	
					return undefined;
				}
				if (str == "false") {	
					return false;
				}
				/*console.log("local data", str);*/
				return str;
			}
			return false;
		},

		resolveOnlineImage: function(url) {
			var that = this;

			if (window.resolveLocalFileSystemURL) {
				var defer = $q.defer();

				var filename = url.split('/').lastValue;

				if (!filename)
					return $q.when(url);

				try {
					window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory + filename, function(entry) {
						/* get data from local */
						console.log("get local image : " + cordova.file.applicationStorageDirectory + filename);

						var localUrl = entry.toURL();						
						defer.resolve(localUrl);

					}, function() {
						/* save image to local */

						if (FileTransfer) {
							var ft = new FileTransfer();
							ft.download(
								url, cordova.file.applicationStorageDirectory + filename,
								function(entry) {
									console.log("save online image : " + cordova.file.applicationStorageDirectory + filename);

									var localUrl = entry.toURL();
									defer.resolve(localUrl);

								},
								function(error) {
									console.log("failed save online image");

									defer.resolve(url);
								},
								true,
								{
								}
								);

						} else {
							console.log('FileTransfer not supported');
							defer.resolve(url);

						}
					});
				} catch (e) {
					return $q.when(url);
				}

				return defer.promise;
			} else {
				
				console.log('resolveLocalFileSystemURL not supported');
				return $q.when(url);
			}
		}
	};

}]);

settingModule.run(["$rootScope", "setting", function($root, setting) {

	$root.setting = setting;
}]);