poddsokApp.factory( 'Model', function( $q, Firebase ) {

	/**
	 * @description - Set intial values of variables
	 */
	var episodes = [];
	var podcasts = [];

	/**
	 * @description - Get all podcasts 
	 * @return { array } - All podcasts
	 */
	this.getPods = () => {
		return podcasts;
	};

	/**
	 * @description - Get all podcasts from Firebase
	 * @return { promise } - Promise that resolves in all podcasts
	 */
	this.getPodcasts = () => {
		var def = $q.defer();
		if( podcasts.length === 0 ) {
			Firebase.getPodcasts().then( ( data ) => {
				var titles = Object.keys( data );
				var eps = Object.values( data );
				titles.forEach( ( title, index ) => {
					if( eps[index].info !== undefined ) {
						var info = eps[index].info;
					}
					podcasts.push( { 
                        title: title,
                        name:  info.name,
                        info:  info
					} );
				})
				def.resolve();
			});
		} else {
			def.resolve();
		}
		return def.promise;
	}

	/**
	 * @description - Get all episodes 
	 * @return { array } - All episodes for current podcast
	 */
	this.getEps = () => {
		return episodes;
	}

	/**
	 * @description - Get episode from given podcast frome Firebase 
	 * @param { string } - Title for given podcast
	 * @return { promise } - Promise that resolves in episodes
	 */
	this.getEpisodes = ( pod ) => {
		var def = $q.defer();
		Firebase.getEpisodes( pod ).then( ( data ) => {
			episodes = Object.values( data );
			for( var i = 0; i < episodes.length; i++ ) {
				if( episodes[i].minutes !== undefined ) { 
					episodes[i].minutes = Object.values( episodes[i].minutes );
					var epsWithTxt = episodes[i].minutes.find( ( ep ) => {
						if( ep.text !== '' ) return true;
					});
					if( epsWithTxt ) {
						episodes[i]['epTxt'] = true;
					} else {
						episodes[i]['epTxt'] = false;
					}
					episodes[i]['showMin'] = false;
				}else{
					episodes.pop();
				}
			}
			def.resolve(); 
		});
		return def.promise;
	};

	/**
	 * @description - Set text-info for given episode at specified minute
	 * @param { object } - Given podcast
	 * @param { string } - Number of episode
	 * @param { object } - All minutes and texts for given episode 
	 * @return { promise } - Promise that resolves in episodes
	 */
	this.addEpInfo = ( pod, ep, minutes ) => {
		var def = $q.defer();
		var data = {
			podcast: pod.title,
			episode: ep,
			minutes: minutes
		}
		Firebase.setEpInfo( data ).then( () => {
			def.resolve();
		});
		return def.promise;
	};

	return this;
	
});