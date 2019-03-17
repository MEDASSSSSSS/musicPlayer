(function ($,root){
	function controlManager(len){
		this.index = index;
		this.len = len;
		this.playOrder = playOrder;//播放顺序扩展中
	}
	controlManager.prototype = {
		prev: function(){
			return this.getIndex(-1)
		},
		next: function () {
			return this.getIndex(1)
		},
		getIndex: function(val){
			var index = this.index;
			var len = this.len;
			var curIndex = (index + len + val)%len;
			this.index = curIndex;
			return curIndex;
		}
	}
	root.controlManager = controlManager
})(window.Zepto, window.player||(window.player={}))//一定要为window.player声明个空对象声以防window.player未被定义而报错