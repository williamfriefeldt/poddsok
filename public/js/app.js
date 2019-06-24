var poddsokApp = angular.module('poddsokApp',['ngRoute','ngAnimate','ngResource','ngSanitize','firebase']);

poddsokApp.config(['$routeProvider',function($routeProvider){

	$routeProvider.
		when('/',{
			templateUrl: "views/main.html",
			controller:  "MainCtrl",
		}).
		when('/om',{
			templateUrl: "views/about.html"
		}).
		otherwise({
			redirectTo: "/"
		});
}]);

