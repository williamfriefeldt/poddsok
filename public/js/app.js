/* Create instance of app */
var poddsokApp = angular.module('poddsokApp',['ngRoute','ngAnimate','ngResource','ngSanitize','firebase']);

poddsokApp.config(['$routeProvider',function($routeProvider){
	/* Handle routes */
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


/* Make spotify uri safe */
poddsokApp.config(function ($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|spotify):/);
});