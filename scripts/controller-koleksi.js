controll.controller('KoleksiController', ['$scope', '$state', '$ionicHistory', '$ionicLoading', 'user', function($scope, $state, $ionicHistory, $ionicLoading, user) {
	console.info("Koleksi Controller");

	var offset = 0;
	var limit = 10;
	var param = {
		offset: offset,
		limit: limit
	};

	$scope.books = [];
	$scope.total = 0;
	$scope.search = {
		text: ''
	};
	$scope.topics = [];
	user.getTopics().then(function(res) {
		$scope.topics = res;
	});

	$scope.openBook = function(n) {
		$state.go("app.buku", {id: n});
	};

	$ionicHistory.clearHistory();

	$scope.doRefresh = function(reset) {
		$ionicLoading.show({template: 'Mengambil Buku'});
		user.getBooks(param).then(function(res) {
			if (reset) {
				$scope.books = res.results;
			} else {
				$scope.books = $scope.books.concat(res.results);
			}
			$scope.total = res.params.total;
			$ionicLoading.hide();
		}, function () {
			 $ionicLoading.hide();
		});
	};
	$scope.doRefresh();

	$scope.doLoadMore = function () {
		offset += limit;
		param.limit = limit;
		param.offset = offset;
		$scope.doRefresh();	 
	};

	$scope.canLoadMore = function() {
		//console.log(offset, $scope.total);
		return (offset + limit) < $scope.total;
	};

	$scope.doSearch = function() {
		//console.log("search " + $scope.searchText);
		offset = 0;
		limit = 10;
		param = {
			offset: offset,
			limit: limit,
			title: $scope.search.text
		};
		$scope.doRefresh(true);
	};

	$scope.$on('refresh', function() {
		offset = 0;
		limit = 10;
		param = {
			offset: offset,
			limit: limit
		};
		$scope.doRefresh(true);
	});


	$scope.getBG = function(id) {
		var colors = ['#daedf2', '#a5f7b3', '#f7f1a5', '#f7a5a5', '#c9bbf3', '#f3bbe2'];
		return colors[id % colors.length];
	};

}]);