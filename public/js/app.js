/**
 * @description - Initialize app with all necessary libraries
 */
var poddsokApp = angular.module( 'poddsokApp', [ 'ngRoute', 'ngAnimate', 'ngResource', 'ngSanitize', 'ngCookies', 'firebase' ]);

/**
 * @description - Handle routing
 */
poddsokApp.config( [ '$routeProvider', function( $routeProvider ) {
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

/**
 * @description - Accept 
 */
poddsokApp.config( ( $compileProvider ) => {
	$compileProvider.aHrefSanitizationWhitelist( /^\s*(https?|ftp|mailto|chrome-extension|spotify):/ );
});