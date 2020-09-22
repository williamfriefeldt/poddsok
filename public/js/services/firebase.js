poddsokApp.factory( 'Firebase', ( $q ) => {

	/**
	 * @description - Firebase setup 
	 */
	var config = {
        apiKey:            "AIzaSyC3Jx94GLlQlmMd36cFYonw2MrfTXf4YPE",
        authDomain:        "poddsok.firebaseapp.com",
        databaseURL:       "https://poddsok.firebaseio.com",
        projectId:         "poddsok",
        storageBucket:     "poddsok.appspot.com",
        messagingSenderId: "621533942583",
        appId:             "1:621533942583:web:f4b8822a1fdb41470e00b2",
        measurementId:     "G-L7RKMPYTB6"
	};

	/**
	 * @description - Initialize Firebase ang Google Analytics
	 */
	firebase.initializeApp( config );
	var analytics = firebase.analytics();	

	/**
	 * @description - Get episodes from Firebase for given podcast
	 * @param { string } - Title of given podcast
	 * @return { promise } - A promise that resolves in the episodes
	 */
	this.getEpisodes = ( pod ) => {
		var def = $q.defer();
		firebase.database().ref( '/' + pod + '/' ).once( 'value' ).then( ( snapshot ) => {
			def.resolve( snapshot.val() );
		});
		return def.promise;
	};

	/**
	 * @description - Get all podcasts from Firebase
	 * @param { string } - Title of given podcast
	 * @return { promise } - A promise that resolves in the episodes
	 */
	this.getPodcasts = () => {
		var def = $q.defer();
		firebase.database().ref( '/' ).once( 'value' ).then( ( snapshot ) => {
			def.resolve( snapshot.val() );
		});
		return def.promise;
	};

	/**
	 * @description - Add text and minute for given episode to Firebase 
	 * @param { object } - 
	 */
	this.setEpInfo = ( data ) => {
	  	var updates = {};
	  	updates['/' + data.podcast + '/ep' + data.episode + '/minutes/'] = data.minutes;
	  	return firebase.database().ref().update( updates );
	};

	/**
	 * @description - Updates delete info on given episode - if value == 3, delete episode info 
	 * @param { object } - Info about podcast and episode that should be updated with delete info
	 * @returns { promise } - Promise that resolves in updated info
	 */
	this.setDeleteVal = ( data ) => {
		var def = $q.defer();
		var refQuery = '/' + data.pod + '/ep' + data.ep.nr + '/minutes/min' + data.min.nr + '/';
		firebase.database().ref(  ).once( 'value' ).then( ( snapshot ) => {
			var res = snapshot.val();
			var updates = {};
			if( res.deleteVal ) {
				deleteStatus = res.deleteVal + 1;
			} else {
				deleteStatus = 1;
			}
			if( deleteStatus == 3 ) {
				updates['/' + data.pod + '/ep' + data.ep.nr + '/minutes/min' + data.min.nr + '/'] = { nr: data.min.nr, text: "" };
			} else {
				var addDeleteVal = { nr: res.nr, text: res.text, deleteVal: deleteStatus };
	  			updates['/' + data.pod + '/ep' + data.ep.nr + '/minutes/min' + data.min.nr + '/'] = addDeleteVal;
	  		}
	  		firebase.database().ref().update( updates );
	  		def.resolve( 'sent' );
		});
		return def.promise;
	};

	/**
	 * @description - Send info to Google Analytics about podcast 
	 * @param { string } - Name of podcast
	 */
	this.trackPod = ( podcast ) => {
		analytics.logEvent( podcast );
	}

	/**
	 * @description - Send info to Google Analytics about user navigation
	 * @param { string } - Name of page event
	 */
	this.trackEvent = ( event ) => {
		analytics.logEvent( event );
	}

	return this;
	
});