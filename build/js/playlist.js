(function($,root){
	var $scope = $(document.body);
	var curinder;
	function activeListItem(index){
		
		if(curinder != index){
			$scope.find(".song-item").eq(curinder).removeClass('active')
		}
		$scope.find(".song-item").eq(index).addClass('active')
		curinder = index;
	}
	function renderPlayList(src,index){
		var html = '';
		src.forEach(function(ele,index){
			html = html + "<li class='song-item' index="+ index +">"+ele.song +" - "+ ele.singer+"</li>"
		})
		$scope.find('.songlist').html(html)
		curinder = index;
		activeListItem(curinder);
	}
	root.playlist = {
		renderPlayList:renderPlayList,
		activeListItem:activeListItem
	}

})(window.Zepto, window.player||(window.player={}))