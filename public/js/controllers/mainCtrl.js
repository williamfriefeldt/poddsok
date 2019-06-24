poddsokApp.controller('MainCtrl', function ($scope, Model, Firebase) {

	$scope.allPods=Model.getPods();
	var podcast;
	var deleteInfo;
	$scope.podShow = false;
	$scope.sent = false;

	$scope.showPod = function(){
		$scope.searchpodd='';
		$scope.podShow = !$scope.podShow;
	};

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

	$scope.boldSearch = function(text,search){
		var boldSearch = text.match(new RegExp(search,'i'))[0];
		text = text.replace(boldSearch,"<div class='search-word inline'><strong>"+boldSearch+'</strong></div>');
		return text;
	};

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

	$scope.sendDeleteInfo = function(info){
		$scope.sent=true;
		$scope.loadingDel=true;
		Firebase.setDeleteVal(info).then(function(){
			$scope.loadingDel=false;
		});
	};

	$scope.showMinText = function(ep){
		ep.showMin = !ep.showMin;
	};
  	
});