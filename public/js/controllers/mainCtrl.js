poddsokApp.controller('MainCtrl', function ($scope, Model, Firebase) {

	/* Set local variables */
	var podcast;
	var deleteInfo;

	/* Scopes - variables accessable from HTML */
	$scope.allPods=Model.getPods(); /* Get all podcasts from Model */
	$scope.podShow = false;
	$scope.sent = false;
	$scope.sortEps = true;

	/* Show/hide podcasts to show/hide episodes */
	$scope.showPod = function(){
		$scope.searchpodd='';
		$scope.podShow = !$scope.podShow;
	};

	/* Change order on displaying episodes*/
	$scope.changeSort = function(){
		$scope.sortEps=!$scope.sortEps;
	};

	/* Get episodes for given podcast (from firebase, through Model) */
	$scope.getEpisodes = function(pod){
		$scope.loading=true;
		$scope.searchep='';
		Model.getEpisodes(pod).then(function(){
			$scope.episodes=Model.getEps();
			$scope.pod=pod;
			podcast=pod;
			$scope.loading=false;
		});
	};

	/* Makes search word bold */
	$scope.boldSearch = function(text,search){
		var boldSearch = text.match(new RegExp(search,'i'))[0];
		text = text.replace(boldSearch,"<div class='search-word inline'><strong>"+boldSearch+'</strong></div>');
		return text;
	};

	/* Set object with delete info */
	$scope.setDeleteInfo = function(min,ep){
		$scope.sent=false;
		deleteInfo={
			pod:podcast,
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
  	
});