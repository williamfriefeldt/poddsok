poddsokApp.controller( 'AddInfoCtrl', function( $scope, Model ) {

	/**
	 * @description - Set intial values of variables
	 */
    var podcast = { title: '' };
    var pods    = Model.getPods();
	var episode;
	var min;
	var maxMin;

	/**
	 * @description - Set intial values of scopes (variables accessable from HTML)
	 */
    $scope.allPods     = pods;
    $scope.podcastText = '';
    $scope.sendText    = 'Lägg till';
    $scope.sent        = false;
	$scope.episodes;
    $scope.loadSend = false;
    $scope.input    = {
        ep:   false,
        min:  false,
        text: false,
        send: false
	};

	/**
	 * @description - Show dropdown when user focus input
	 * @param { string } - Dropdown class
	 */
	$scope.showDrop = ( show ) => {
		$( '.' + show ).show();
	};

	/**
	 * @description - Hide dropdown when user focus input
	 * @param { string } - Dropdown class
	 */
	$scope.hideDrop = ( hide ) => {
		$( '.' + hide ).hide();
	};

	/**
	 * @description - Create time array with all minutes from 1 to maxMin ( = episode length )
	 */
	var time = () => {
		var array = [];
		for( var i = 1; i <= maxMin; i++ ) {
			array.push( i );
		}
		$scope.minText = '';
		$scope.input.min = true;
		$scope.time = array;
	};

	/**
	 * @description - Set choosen podcast
	 * @param { object } - Object with info about podcast
	 */
	$scope.choosePod = ( pod ) => {
		$scope.podcastText = pod.name;
		podcast = pod;
	};

	/**
	 * @description - Set choosen episode by episode title, length and number, and set time array
	 * @param { number } - Length of episode
	 * @param { number } - Episode number
	 * @param { string } - Episode title
	 */
	$scope.chooseEp = ( length, nr, text ) => {
		$scope.episodeText = text;
		maxMin = length;
		episode = nr;
		time();
	};

	/**
	 * @description - Set choosen time by given number
	 * @param { string } - Choosen minute
	 */
	$scope.chooseTime = ( i ) => {
		if( i === 1 ) {
			$scope.minText = "1 minut";
		} else {
			$scope.minText = i + " minuter";		
		}
		$scope.input.text = true;
		min = i;
	};
	/**
	 * @description - Remove string 'minuter' from minute input
	 * @param { string } - Choosen minute
	 * @return { string } - Striped minute if an input was given
	 */
	$scope.stripMin = ( min ) => {
		if( min ) return min.replace( /[^0-9]+/, '' );			
	}

	/**
	 * @description - Get episodes for given podcast 
	 * @param { object } - Object with info about podcast
	 */
	$scope.getEps = ( pod ) => {
		$scope.podTitle = pod;
		$scope.episodeText = 'Laddar avsnitt...';
		Model.getEpisodes( pod.title ).then( ( data ) => {
			episodes = Model.getEps();
			for( var i=0; i < episodes.length; i++ ) {
				if( episodes[i].minutes !== undefined) {
					episodes[i].text = episodes[i].nr + '.' + episodes[i].name;
				}
			}
			$scope.input.ep = true;
			$scope.episodes = episodes;
			$scope.episodeText = '';
		});
	};

	/**
	 * @description - Sends users input to Firebase and updates the episode info. If text already exists at minute, ask user to continue or not
	 * @param { boolean } - If text exists at minute or not
	 */ 
	$scope.send = ( overwrite ) => {
		if( $scope.sent === false || overwrite ) {
            $scope.minInfo  = { status: false };
            $scope.sent     = true;
            $scope.sendText = "Lägg till mer";
            $scope.loadSend = true;
            var minutes     = {};
			for( var i=0; i < episodes.length; i++ ) {
				if( episodes[i].nr == episode ){
					var epname = episodes[i].name;
					for( var j=0; j < episodes[i].minutes.length; j++ ) {
						minutes['min' + episodes[i].minutes[j].nr] = episodes[i].minutes[j];
					}
				}
			}
			if( minutes['min' + min] && overwrite != true && minutes['min' + min].text != '' ) {
				$scope.minInfo = {
                    status:  true,
                    ep:      epname,
                    min:     min,
                    mintext: minutes['min' + min].text,
                    btnText: "Lägg till ändå"
				};
				$scope.sendText = "Avbryt"
				$scope.loadSend = false;
			} else {
				minutes['min'+min] = { nr: min, text: $scope.text };
				Model.addEpInfo( podcast, episode, minutes ).then( () => {
					$scope.minInfo = { status: false };
					$scope.loadSend = false;
				});
			}
		} else {
			$scope.sent = false;
			clear();
		}

	};

	/**
	 * @description - Reset scopes and variables 
	 */
	var clear = () => {
        overwrite          = false;
        $scope.minInfo     = { status: false };
        $scope.podcastText = '';
        $scope.episodeText = '';
        $scope.minText     = '';
        $scope.text        = '';
        $scope.input       = {
            ep:   false,
            min:  false,
            text: false,
            send: false
		};
		$scope.sendText = 'Lägg till';
	};
	
});