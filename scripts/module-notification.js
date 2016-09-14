var pushModule = angular.module("PushModule", []);

pushModule.factory("pushNotif", ["$http","$q", "$rootScope", function($http, $q, $root) {

	var _regId = "";
	return {
		get regId() {
			return _regId;
		},
		set regId(val) {
			_regId = val;

			$root.$broadcast("push-registered");
		}
	};

}]);

pushModule.run(["pushNotif", "$rootScope", "$ionicPlatform", "$location", "$timeout", function(pushNotif, $root, $ionicPlatform, $location, $timeout) {
	var SENDER_ID = '247698159584';

	$ionicPlatform.ready(function() {
		if (window.hasOwnProperty('PushNotification')) {

			/* Push Notification */
			var push = PushNotification.init({
				android: {
					senderID: SENDER_ID,
					forceShow: false,
					badge: true
				},
				ios: {
					alert: "true",
					badge: true,
					sound: 'true'
				},
				windows: {}
			});

			push.on('registration', function(data) {
				//alert(JSON.stringify(data));
				pushNotif.regId = data.registrationId;
			});

			push.on('notification', function(data) {
				//alert(JSON.stringify(data));
			    //alert(data.message+ ':' + data.title+ ':' + data.count+ ':' + data.sound+ ':' + data.image + ':' + data.additionalData);
			    console.log(data);
			    if (data.hasOwnProperty('additionalData')) {
			    	var addData = data.additionalData;
			    	$root.$broadcast("notification", addData);
			    }
			});

			push.on('error', function(e) {
				console.log(e.message);
			    //alert(e.message);
			});

			/*push.setApplicationIconBadgeNumber(function() {
			    alert('success');
			}, function() {
			    alert('error');
			}, 2);*/

			//alert("Push Notification Set");

		} else {
			//alert("PUSH NOTIFICATION NOT INSTALLED");
		}
	});
}]);