var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var newer = require("gulp-newer");
var htmlclean = require("gulp-htmlclean");
var uglify =  require("gulp-uglify");
var stripDebug = require("gulp-strip-debug");//去掉js中的调试语句
var concat = require("gulp-concat");//整合所有js文件
var less = require("gulp-less");
var postcss = require("gulp-postcss");//整合css
var autopre = require("autoprefixer");//添加兼容前綴
var cssnano = require("cssnano");//壓縮css代碼
var connect = require("gulp-connect");

var devMode = process.env.NODE_ENV == "development";

var folder = {
	src:"./src/",
	build:"./build/"
}

//流读取文件
gulp.task("img",function(){
	gulp.src(folder.src + "img/*")
		.pipe(newer(folder.build + "img"))
		.pipe(imagemin())
		.pipe(gulp.dest(folder.build + "img"))
})
gulp.task("html",function(){
	var page = gulp.src(folder.src + "html/*")
		.pipe(connect.reload())
	if(!devMode){
		page.pipe(htmlclean())
	}
		page.pipe(gulp.dest(folder.build + "html"))
})
gulp.task("js",function(){
	var page = gulp.src(folder.src + "js/*")
		.pipe(connect.reload())
	if(!devMode){
		page.pipe(stripDebug()) 
		.pipe(uglify())
	}
		page.pipe(gulp.dest(folder.build + "js"))
})
gulp.task("css",function(){
	var options = [autopre(),cssnano()]
	var page = gulp.src(folder.src + "css/*")
		.pipe(less())
		.pipe(connect.reload())
		if(!devMode){
			page.pipe(postcss(options))
		}
		page.pipe(gulp.dest(folder.build + "css"))
})
gulp.task("watch",function(){
	gulp.watch(folder.src + "html/*", ["html"]);
	gulp.watch(folder.src + "css/*",["css"]);
	gulp.watch(folder.src + "js/*",["js"]);
	gulp.watch(folder.src + "img/*", ["img"]);
})
gulp.task("server",function(){
	connect.server({
		port:"8090",
		livereload: true//开启浏览器自动刷新
	});

})
gulp.task("default",["img","html","js","css","watch","server"],function(){

})