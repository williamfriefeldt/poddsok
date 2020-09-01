poddsokApp.controller('MainCtrl', function ($location, $window, $scope, $cookies, Model, Firebase) {

	var devMode = true; 

	if( devMode === false ) {
		if ($location.protocol() !== 'https') {
	        $window.location.href = $location.absUrl().replace('http', 'https');
	    }
	}

	/* Set local variables */
	var podcast;
	var deleteInfo;

	/* Scopes - variables accessable from HTML */
	$scope.loading=true;
	/* Get all podcasts from Model */
	Model.getPodcasts().then( function() { 
		$scope.allPods= Model.getPods();
		$scope.loading=false;
	}); 
	$scope.podShow = false;
	$scope.sent = false;
	$scope.sortEps = true;
	$scope.infoText = 'Välj en podcast';

	/* Show/hide podcasts to show/hide episodes */
	$scope.showPod = function(){
		if( $scope.infoText === 'Sök efter ord eller mening' ) {
			$scope.infoText = false;
			$cookies.put( 'podcastInfo', true );
		}
		$scope.searchpodd='';
		$scope.podShow = !$scope.podShow;
	};

	/* Change order on displaying episodes*/
	$scope.changeSort = function(){
		$scope.sortEps=!$scope.sortEps;
	};

	/* Get episodes for given podcast (from firebase, through Model) */
	$scope.getEpisodes = function(pod){
		if( $scope.infoText === 'Välj en podcast' ) {
			$scope.infoText = 'Sök efter ord eller mening';
		} else {
			$scope.infoText = false;
			$cookies.put( 'podcastInfo', true );
		}
		$scope.loading=true;
		$scope.searchep='';
		Firebase.trackPod( pod.title );
		Model.getEpisodes(pod.title).then(function(){
			$scope.episodes=Model.getEps();
			$scope.pod=pod;
			podcast=pod;
			$scope.loading=false;
		});
	};

	/* Makes search word bold */
	$scope.boldSearch = function(text,search){
		var splitext = search.split(/\s+/);
		for(var i = 0; i < splitext.length; i++){
			var bold = text.match(RegExp(splitext[i], 'i'));
			if( !text.match(/<+[^<]+>/) || !text.match(/<+[^<]+>/)[0].includes(bold) )
			text = text.replace( bold, '<strong>'+bold+'</strong>')
		}
		return text;
	};

	/* Set object with delete info */
	$scope.setDeleteInfo = function(min,ep){
		$scope.sent=false;
		deleteInfo={
			pod:podcast.title,
			ep:{
				nr:ep.nr,
				name:ep.name,
			},
			min:{
				nr: min.nr,
				text: min.text
			} 
		};
		$scope.deleteInfo=deleteInfo;
	};

	/* Send delete info to firebase */
	$scope.sendDeleteInfo = function(info){
		$scope.sent=true;
		$scope.loadingDel=true;
		Firebase.setDeleteVal(info).then(function(){
			$scope.loadingDel=false;
		});
	};

	/* Show/hide all info about an episode */
	$scope.showMinText = function(ep){
		ep.showMin = !ep.showMin;
	};

	/* Check OS to ask for app - https://stackoverflow.com/questions/21741841/detecting-ios-android-operating-system */
	var getMobileOperatingSystem = function() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	    // Windows Phone must come first because its UA also contains "Android"
	    if(/windows phone/i.test(userAgent)) {
	        return "Windows Phone";
	    }

	    if(/android/i.test(userAgent)) {
	        return "Android";
	    }

	    // iOS detection from: http://stackoverflow.com/a/9039885/177710
	    if(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
	    	setTimeout(function() {
	    		$("#showAppInfo").modal("show");
	    	}, 500);
	    	$cookies.put( 'hideAppInfo', true );
	        return;
	    }

	    return;
	}

	/* Handle cookies*/

	$scope.podcastInfo = $cookies.get( 'podcastInfo' );

	if( $cookies.get( 'hideAppInfo' ) !== "true" ) {
		getMobileOperatingSystem();
	}

	if( $cookies.get( 'cookieInfo' ) !== "true" ) {
		setTimeout( function() {
			$("#showCookieInfo").modal();
			$(".modal-backdrop").css("background-color", "transparent");
			$cookies.put( 'cookieInfo', true );
		}, 500);
	}
  	
});