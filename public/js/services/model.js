poddsokApp.factory('Model',function($q,Firebase){

	/* Get all podcasts */
	this.getPods = function(){
		return podcasts;
	};

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
				episodes[i].minutes=Object.values(episodes[i].minutes);
				episodes[i]['showMin']=false;
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
	var podcasts = [
		{
			title:'alexochsigge',
			name:'Alex och Sigges podcast'
		},
		{

			title:'aliceochbianca',
			name:'Alice & Bianca - Har du sagt A får du säga B'
		},
		{
			title:'en-varg',
			name:'En varg söker sin pod'
		},
		{
			title:'fredagspodden',
			name:'Fredagspodden'
		},
		{
			title:'livet-pa-laktaren',
			name:'Livet på läktaren'
		},
		{
			title:'mellan-himmel-jord',
			name:'Mellan Himmel och Jord'
		},
		{
			title:'mordpodden',
			name:'Mordpodden'
		},
		{
			title:'skaringerochmannheimer',
			name:'Skäringer & Mannheimer'
		},
		{
			title:'tom-och-petter',
			name:"Tom och Petter"
		},
		{
			title:'wahlgrenochwistam',
			name:'Wahlgren & Wistam'
		}
	];

	return this;
});