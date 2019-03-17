var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var index = 0;
var songData =[];
var playOrder = '';//播放顺序扩展中
var audio = new root.audioControl();

function bindEvent(){
		$scope.on("play:change",function(e,index){
			audio.getAudio(songData[index].audioUrl)
			audio.audio.addEventListener('ended',function(){
				$scope.trigger("play:change", index+1);
			})
			root.process.renderTimer(songData[index].duration)
			root.process.updateTime(0);
			root.render(songData[index]);
			if(audio.status =="play"){
				audio.play();
				root.process.start();
			}
		})
		$scope.on("click",".prev-btn",function(){
			var index = controlManager.prev()
			$scope.trigger("play:change", index);
			root.process.stop('prev');
			if($scope.find(".songlist-wrapper").css('display') == 'block'){
				root.playlist.activeListItem(index);
			}
		})
		$scope.on("click",".next-btn",function(){
			var index = controlManager.next()
			root.process.stop('next');
			$scope.trigger("play:change", index);
			if($scope.find(".songlist-wrapper").css('display') == 'block'){
				root.playlist.activeListItem(index);
			}
		})
		$scope.on("click",".play-btn",function(){
			if(audio.status == "play"){
				audio.pause();
				root.process.stop();
			}else{
				audio.play()
				root.process.start();
			}
			$(this).toggleClass("pause")
		})
		$scope.on("click",".list-btn",function(){
			var index = controlManager.index;
			if($scope.find(".songlist-wrapper").css('display') == 'none'){
				$scope.find(".songlist-wrapper").addClass("show");
				root.playlist.renderPlayList(songData,index);
				$scope.on("click",".song-item",function(){
					var index = $(this).attr('index');
					root.playlist.activeListItem(index);
					$scope.trigger("play:change", index);
				})
			}else{
				$scope.find(".songlist-wrapper").removeClass("show");
			}
		})
		$scope.on("click",".blankarea",function(){
			if($scope.find(".songlist-wrapper").css('display') == 'block'){
				$scope.find(".songlist-wrapper").removeClass("show");
			}
		})
	}

function bindTouch(){
	var $slider = $scope.find('.slider-pointer');
	var offset = $scope.find('.pro-wrapper').offset();
	var left = offset.left;
	var width = offset.width;
	$slider.on('touchstart', function(e){
		var x = e.changedTouches[0].clientX;
		var per = (x - left)/width;
		audio.pause();
		var curDuration = songData[controlManager.index].duration*per
		$scope.find('.play-btn').addClass("pause")
		root.process.stop();
		});
	$slider.on('touchmove', function(e){
		var x = e.changedTouches[0].clientX;
		var per = (x - left)/width;
		if(per <0 ){
			per = 0;
		}
		if(per >1){
			per = 1;
		}
		root.process.updateTime(per);
		console.log('moving')
	});
	$slider.on('touchend', function(e){
		var x = e.changedTouches[0].clientX;
		var per = (x - left)/width;
		if(per <0 ){
			per = 0;
		}
		if(per >1){
			per = 1;
		}
		var curDuration = songData[controlManager.index].duration
		var curTime = per * curDuration;
		audio.playTo(curTime);
		root.process.start(curTime);
		$scope.find('.play-btn').removeClass('pause')

		console.log(curTime)
	})
}

function getData(url){
	$.ajax({
		type:"GET",
		url:url,
		success:function(data){
			songData = data;
			root.render(data[0]);
			root.process.renderTimer(data[0].duration)
			bindEvent()
			bindTouch()
			controlManager = new root.controlManager(data.length);
			$scope.trigger("play:change", 0);
		},
		error:function(error){
			console.log('error');
		},
	})
}

getData("../mock/data.json")
