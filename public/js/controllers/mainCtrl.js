poddsokApp.controller( 'MainCtrl', ( $location, $window, $scope, $cookies, Model, Firebase ) => {

	/**
	 * @description - If not devMode => redirect user to secure URL (https)
	 */
	var devMode = true; 

	if( devMode === false ) {
		if ($location.protocol() !== 'https') {
	        $window.location.href = $location.absUrl().replace('http', 'https');
	    }
	}

	/**
	 * @description - Declare variables
	 */
	var podcast;
	var deleteInfo;

	/**
	 * @description - Set intial values of scopes (variables accessable from HTML)
	 */
    $scope.loading  = true;
    $scope.podShow  = false;
    $scope.sent     = false;
    $scope.sortEps  = true;
    $scope.infoText = 'Välj en podcast';

	/**
	 * @description - When controller is loaded => get all podcasts from Model
	 */
	Model.getPodcasts().then( () => { 
		$scope.allPods = Model.getPods();
		$scope.loading = false;
	}); 

	/**
	 * @description - Show/hide podcasts to show/hide episodes. Change info text and save cookie
	 */
	$scope.showPod = () => {
		if( $scope.infoText === 'Sök efter ord eller mening' ) {
			$scope.infoText = false;
			$cookies.put( 'podcastInfo', true );
		}
		$scope.searchpodd = '';
		$scope.podShow = !$scope.podShow;
	};

	/**
	 * @description - Change order on episodes. Defaults: lowest => highest
	 */
	$scope.changeSort = () => {
		$scope.sortEps = !$scope.sortEps;
	};

	/**
	 * @description - Get episodes for given podcast (from Firebase, through Model). Track event to analytics
	 * @param { object } - The choosen podcast
	 */
	$scope.getEpisodes = ( pod ) => {
		if( $scope.infoText === 'Välj en podcast' ) {
			$scope.infoText = 'Sök efter ord eller mening';
		} else {
			$scope.infoText = false;
			$cookies.put( 'podcastInfo', true );
		}
		$scope.loading = true;
		$scope.searchep = '';
		Firebase.trackPod( pod.info.name );
		Model.getEpisodes( pod.title ).then( () => {
            $scope.episodes = Model.getEps();
            $scope.pod      = pod;
            podcast         = pod;
            $scope.loading  = false;
		});
	};

	/**
	 * @description - Bold the search text in search results
	 * @param { string } - Text result from episode
	 * @param { string } - 
	 */
	$scope.boldSearch = ( text, search ) => {
		var splitext = search.split( /\s+/ );
		for( var i = 0; i < splitext.length; i++ ){
			var bold = text.match( RegExp( splitext[i], 'i' ) );
			if( !text.match( /<+[^<]+>/ ) || !text.match( /<+[^<]+>/ )[0].includes( bold ) ) {
				text = text.replace( bold, '<strong>' + bold + '</strong>' )
			}
		}
		return text;
	};

	/**
	 * @description Set info about text that should be deleted in that episode 
	 * @param { object } - Text and minute (number) that should be removed
	 * @param { object } - Episode where the text and minute occurs
	 */
	$scope.setDeleteInfo = ( min, ep ) => {
		$scope.sent = false;
		deleteInfo = {
			pod: podcast.title,
			ep: {
                nr:   ep.nr,
                name: ep.name,
			},
			min: {
                nr:   min.nr,
                text: min.text
			} 
		};
		$scope.deleteInfo = deleteInfo;
	};

	/**
	 * @description - Send delete info to firebase 
	 * @param { info } - Scope 'deleteInfo' with info about text in episode that should be deleted
	 */
	$scope.sendDeleteInfo = ( info ) => {
		$scope.sent = true;
		$scope.loadingDel = true;
		Firebase.setDeleteVal( info ).then( () => {
			$scope.loadingDel = false;
		});
	};

	/**
	 * @description - Show/hide all info about an episode 
	 * @param { object } - Episode to be shown/hidden
	 */
	$scope.showMinText = ( ep ) => {
		ep.showMin = !ep.showMin;
	};

	/**
	 * @description - Determine users operating system to ask for app (currently only iOS) - 
	 * @ return { string } - Name of OS
	 * @link - https://stackoverflow.com/questions/21741841/detecting-ios-android-operating-system 
	 */
	var getMobileOperatingSystem = () => {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Windows Phone must come first because its UA also contains "Android"
    if( /windows phone/i.test( userAgent ) ) {
        return 'Windows Phone';
    }
    if( /android/i.test( userAgent ) ) {
        return 'Android';
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if( /iPad|iPhone|iPod/.test( userAgent ) && !window.MSStream ) {
    	setTimeout( () => {
    		$( '#showAppInfo' ).modal( 'show' );
    	}, 500 );
    	$cookies.put( 'hideAppInfo', true );
      return;
    }
    return;
	}

	/**
	 * @description - Handle cookies (show modal depending on state)
	 */
	$scope.podcastInfo = $cookies.get( 'podcastInfo' );

	if( $cookies.get( 'hideAppInfo' ) !== 'true' ) {
		getMobileOperatingSystem();
	}

	if( $cookies.get( 'cookieInfo' ) !== 'true' ) {
		setTimeout( () => {
			$( '#showCookieInfo' ).modal();
			$( '.modal-backdrop' ).css( 'background-color', 'transparent' );
			$cookies.put( 'cookieInfo', true );
		}, 500 );
	}
  	
	/**
	 * @description - Track events in Google Analytics
	 */	
	$scope.trackEvent = ( event ) => {
		Firebase.trackEvent( event );  	
	};

});