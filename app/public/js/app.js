var app = angular.module('CAHApp', []);

app.controller('CAHIndex', ['$scope', '$interval', function($scope, $interval){
	console.log('CAHIndex init');

	$scope.currPage = 'index';
	$scope.loading  = true;


	var socket = io.connect(server_url);
	socket.on('connect', function(){
		console.log('Connected.');
		$scope.loading  = false;
		$scope.$apply();
	});
	socket.on('error', function(err){
		console.error('socket error', err);
	});
	socket.on('custom_event', function(data){
		console.log('custom_event', data);
	});

	console.log(server_url);

}])