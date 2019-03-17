(function($,root){
	var $scope = $(document.body);
	var curDuration, frameID;
	var stopTime = 0;
	var playedTime = 0;
	var origStartTime = 0;
	//处理时间格式 秒-> 分：秒
	function formatTime(duration){
		duration = Math.round(duration);
		var minute = Math.floor(duration/60),
			second = duration%60;
		if(minute < 10){
			minute = '0' + minute;
		}
		if(second < 10){
			second = '0' + second;
		}
		return minute + ':' + second;
	}
	//渲染歌曲时间
	function renderTimer(duration){
		origStartTime = 0;
		playedTime = 0;
		stopTime = 0;
		curDuration = duration;
		var allTime = formatTime(duration);
		$scope.find('.all-time').html(allTime);
		$scope.find('.cur-time').html('00:00');
		$scope.find('.pro-top').css({'transform':'translateX(-100%)'});
	}
	//更新已播放时间
	function updateTime(percent){
		var curTime = percent*curDuration;
		var per = (percent - 1) * 100;
		curTime = formatTime(curTime);
		$scope.find('.cur-time').html(curTime);
		// if(percent > 0.97){
	 //    $scope.find('.pro-top').css({'transform':'translateX(-2.5%)'})
		// 	return
		// }
	    $scope.find('.pro-top').css({'transform':'translateX('+ per +'%)'})
		
	}
	function start(targetTime){
		origStartTime = new Date().getTime();
		//var startTime = new Date().getTime();
		function frame(){
		var curTime = new Date().getTime();
		if(targetTime){playedTime = targetTime * 1000}
		var percent = (curTime-origStartTime + playedTime)/(curDuration*1000);
		if(percent<1){
			frameID = requestAnimationFrame(frame);
			updateTime(percent);

		}else{
			stopTime = 0;
			origStartTime = 0;
			updateTime(0)
			cancelAnimationFrame(frameID);
			}
		}
		frame();
	}
	function stop(flag){
		if(!flag){
			stopTime = new Date().getTime();
			playedTime = stopTime - origStartTime + playedTime;
			console.log('stop and now played '+playedTime)
		}
		cancelAnimationFrame(frameID);
			
	}
	root.process = {
		renderTimer: renderTimer,
		updateTime:updateTime,
		start:start,
		stop:stop,
	}
})(window.Zepto,window.player||(window.player={}))