poddsokApp.controller('AddInfoCtrl', function ($scope, Model) {

	//Variables and scopes
	var podcast = {title:''};
	var pods = Model.getPods();
	$scope.allPods=pods;
	var episode;
	var min;
	var maxMin;

	$scope.podcastText='';
	$scope.sendText='Lägg till';
	
	$scope.sent=false;
	
	$scope.input={
		ep:false,
		min:false,
		text:false,
		send:false
	};

	$scope.episodes;
	$scope.loadSend=false;

	//Functions
	$scope.showDrop = function(show){
		$('.'+show).show();
	};
	$scope.hideDrop = function(hide){
		$('.'+hide).hide();
	}

	var time = function(){
		var array=[];
		for(var i=1;i<=maxMin;i++){
			array.push(i);
		}
		$scope.minText='';
		$scope.input.min= true;
		$scope.time=array;
	};

	$scope.choosePod = function(pod){
		$scope.podcastText=pod.name;
		podcast=pod;
	};

	$scope.chooseEp = function(length,nr,text){
		$scope.episodeText=text;
		maxMin = length;
		episode=nr;
		time();
	};

	$scope.chooseTime = function(i){
		$scope.minText=i+" minuter";
		$scope.input.text=true;
		min=i;
	};

	$scope.getEps = function(pod){
		$scope.podTitle=pod.title;
		$scope.episodeText ='Laddar avsnitt...';
		Model.getEpisodes(pod.title).then(function(data){
			episodes=Model.getEps();
			for(var i=0; i<episodes.length;i++){
				episodes[i].text=episodes[i].nr+'.'+episodes[i].name;
			}
			$scope.input.ep = true;
			$scope.episodes=episodes;
			$scope.episodeText='';
		});
	};

	$scope.send = function(overwrite){
		if($scope.sent==false || overwrite){
			$scope.minInfo={status:false};
			$scope.sent=true;
			$scope.sendText="Lägg till mer";
			$scope.loadSend=true;
			var minutes = {};
			for(var i=0; i<episodes.length; i++){
				if(episodes[i].nr==episode){
					var epname = episodes[i].name;
					for(var j=0; j<episodes[i].minutes.length; j++){
						minutes['min'+episodes[i].minutes[j].nr]=episodes[i].minutes[j];
					}
				}
			}
			if(minutes['min'+min] && overwrite != true && minutes['min'+min].text != ''){
				$scope.minInfo={
					status:true,
					ep:epname,
					min:min,
					mintext:minutes['min'+min].text,
					btnText:"Lägg till ändå"
				};
				$scope.sendText="Avbryt"
				$scope.loadSend=false;
			}else{
				minutes['min'+min]={nr:min,text:$scope.text};
				Model.addEpInfo(podcast,episode,minutes).then(function(){
					$scope.minInfo={status:false};
					$scope.loadSend=false;
				});
			}
		}else{
			$scope.sent=false;
			clear();
		}

	};

	var clear = function(){
		overwrite=false;
		$scope.minInfo={status:false};
		$scope.podcastText='';
		$scope.episodeText='';
		$scope.minText='';
		$scope.text='';
		$scope.input={
			ep:false,
			min:false,
			text:false,
			send:false
		};
		$scope.sendText='Lägg till';
	};
	
});