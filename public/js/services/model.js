poddsokApp.factory('Model',function($q,Firebase){

	/* Get all podcasts */
	this.getPods = function(){
		return podcasts;
	};

	this.getPodcasts = function() {
		var def = $q.defer();
		if( podcasts.length === 0 ) {
			Firebase.getPodcasts().then(function(data){
				var titles = Object.keys(data);
				var eps = Object.values(data);
				titles.forEach(function( title, index ) {
					if( eps[index].info !== undefined ) {
						var info = eps[index].info;
					}
					podcasts.push( { 
						title: title, 
						name: info.name, 
						info: info
					} );
				})
				def.resolve();
			});
		} else {
			def.resolve();
		}
		return def.promise;
	}

	/* Get all podcasts */
	this.getEps = function(){
		return episodes;
	}

	/* Get episode from given podcast frome firebase - store in var episodes */
	this.getEpisodes=function(pod){
		var def = $q.defer();
		Firebase.getEpisodes(pod).then(function(data){
			episodes=Object.values(data);
			for(var i=0;i<episodes.length;i++){
				if( episodes[i].minutes !== undefined) { 
					episodes[i].minutes=Object.values(episodes[i].minutes);
					var epsWithTxt = episodes[i].minutes.find(function(ep) {
						if( ep.text !== '' ) return true;
					});
					if( epsWithTxt ) {
						episodes[i]['epTxt'] = true;
					} else {
						episodes[i]['epTxt'] = false;
					}
					episodes[i]['showMin']=false;
				}else{
					episodes.pop();
				}
			}
			def.resolve(); 
		});
		return def.promise;
	};

	/* Set new episode info to firebase through firebase service */
	this.addEpInfo=function(pod,ep,minutes){
		var def = $q.defer();
		var data ={
			podcast:pod.title,
			episode:ep,
			minutes:minutes
		}
		Firebase.setEpInfo(data).then(function(){
			def.resolve();
		});
		return def.promise;
	};

	/* Local variables for episodes and podcasts */
	var episodes= [];
	var podcasts = [];

	return this;
});