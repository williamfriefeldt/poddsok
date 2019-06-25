poddsokApp.factory('Firebase', function ($q) {

	/* Poddsök firebase setup */
	var config = {
	  apiKey: "AIzaSyC3Jx94GLlQlmMd36cFYonw2MrfTXf4YPE",
	  authDomain: "poddsok.firebaseapp.com",
	  databaseURL: "https://poddsok.firebaseio.com"
	};

	firebase.initializeApp(config);

	/* Get episodes from firebase for given pod*/
	this.getEpisodes = function(pod){
		var def = $q.defer();
		firebase.database().ref('/'+pod+'/').once('value').then(function(snapshot) {
			console.log("Success! Data from database");
			def.resolve(snapshot.val());
		});
		return def.promise;
	};

	/* Add new episode info to firebase */
	this.setEpInfo = function(data){
	  	var updates = {};
	  	updates['/'+data.podcast+'/ep'+data.episode+'/minutes/'] = data.minutes;
	  	console.log('Info tillagd i '+data.podcast+' avsnitt '+data.episode);
	  	return firebase.database().ref().update(updates);
	};

	/* Updates delete info on given episode - in value == 3, delete episode info */
	this.setDeleteVal = function(data){
		var def = $q.defer();
		firebase.database().ref('/'+data.pod+'/ep'+data.ep.nr+'/minutes/min'+data.min.nr+'/').once('value').then(function(snapshot) {
			var res = snapshot.val();
			var updates = {};
			if(res.deleteVal){
				deleteStatus=res.deleteVal+1;
			}else{
				deleteStatus=1;
			}
			if(deleteStatus == 3){
				updates['/'+data.pod+'/ep'+data.ep.nr+'/minutes/min'+data.min.nr+'/'] = {nr:data.min.nr,text:""};
			}else{
				var addDeleteVal = {nr:res.nr,text:res.text,deleteVal:deleteStatus};
	  			updates['/'+data.pod+'/ep'+data.ep.nr+'/minutes/min'+data.min.nr+'/'] = addDeleteVal;
	  		}
	  		console.log(updates);
	  		firebase.database().ref().update(updates);
	  		def.resolve('sent');
		});
		return def.promise;
	};

	return this;
});