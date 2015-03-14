var app = angular.module('CAHApp', ['ngRoute']);
var socket;

var angularSioResolver = ['$q', '$timeout', '$route', angularSio];
function angularSio($q, $timeout, $route){
  var delay = $q.defer();
  console.log('angularXhr', $route);
  socket.emit('routeChange', 'bla');

/*
  $http.get(getXhrUrl($route)).
    success(function(data, status, headers, config) {
      console.log('angularXhr success', data, status, headers, config);
      delay.resolve(data);
    }).
    error(function(data, status, headers, config) {
      console.log('angularXhr error', data, status, headers, config);
      delay.resolve({});
    });
*/
  setTimeout(function(){
    delay.resolve({});
  }, 100);
  return delay.promise;
}

function initScopeFromRouteResult($scope, $route){
  console.log('route.current', $route);
  if($route.current['locals'] !== void(0) && $route.current.locals['sio'] !== void(0)){
    for(var i in $route.current.locals.sio){
      $scope[i] = $route.current.locals.sio[i];
    }
  }
}

app
  .controller('MainController', 
          ['$scope', '$route', '$routeParams', '$location', '$timeout', '$sce', '$window', 
   function($scope,   $route,   $routeParams,   $location,   $timeout,   $sce,   $window) {

    console.log("A l'intérieur du MainController");

    socket = io.connect();
    $scope.currPage = 'index';
    $scope.loading  = true;


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


    $scope.onLoadQueue  = [];
    //$scope.current_user = current_user;
    $scope.$sce         = $sce;

    $scope.setPageTitle = function(newTitle){
      $scope.$parent.$root.pageTitle = newTitle;
    }

    $scope.$on('$viewContentLoaded', function(){
      $timeout(function(){
        $scope.onLoadQueue.forEach(function(elem, index, arr){
          elem();
        });
        $scope.onLoadQueue.splice(0, $scope.onLoadQueue.length);
      }, 0, false);
    });

    $scope.$on("$routeChangeStart", function(event, next, current){
      if(next)
        $scope.toto = next.controller;
      else{
        document.location.href = $location.url();
      }
    });
    $scope.$on("$routeChangeSuccess", function(event, next, current){

    });
  }])
.controller('CAHIndex', ['$scope', '$interval', '$route', function($scope, $interval, $route){
  console.log('CAHIndex init');
  if($route.current)
    initScopeFromRouteResult($scope, $route);
}])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  
  $routeProvider
    .when('/', {
       controller: 'CAHIndex',
       templateUrl: 'partials/index.html',
       resolve: {
          sio: angularSioResolver
       }
     })
  ;

}]);