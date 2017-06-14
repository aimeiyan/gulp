// 获取 gulp
var gulp = require('gulp');
var rename = require("gulp-rename");

var minifyCss = require("gulp-minify-css");

var minifyHtml = require("gulp-minify-html");

var uglify = require("gulp-uglify");

var jsLint = require("gulp-jshint");

// 文件合并
var concat = require("gulp-concat");

//合并文件的顺序
var order = require("gulp-order");

// 获取 gulp-ruby-sass 模块
var sass = require('gulp-sass');

// 图片压缩
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); //png图片压缩插件

// 自动刷新
var livereload = require('gulp-livereload');

// 编译sass
// 在命令行输入 gulp sass 启动此任务
gulp.task('sass', function() {
    gulp.src('dist/sass/*.scss')  //被编译的文件路径
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))  //编译后自动保存的路径
});

// css压缩
// 在命令行输入 gulp minify-css 启动此任务
gulp.task('minify-css', function () {
    gulp.src('dist/css/*.css') // 要压缩的css文件
    .pipe(minifyCss()) //压缩css
    .pipe(rename(function(path){
            path.basename +='.min';
            path.extname = ".css";
    }))
    .pipe(gulp.dest('dist/css/min'));
});

// html压缩
// 在命令行输入 gulp minify-html 启动此任务
gulp.task('minify-html', function () {
    gulp.src('dist/html/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(rename(function(path){
            path.basename +='.min';
            path.extname = ".html";
    }))
    .pipe(gulp.dest('dist/html'));
});

 // js代码压缩
// 在命令行输入 gulp minify-js 启动此任务
gulp.task('minify-js', function () {
    gulp.src('dist/js/*.js') // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(rename(function(path){
            path.basename +='.min';
            path.extname = ".js";
    }))
    .pipe(gulp.dest('dist/js/min')); //压缩后的路径
});

// js代码检查
// 在命令行输入 gulp jsLint 启动此任务
gulp.task('jsLint', function () {
    gulp.src('dist/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter()); // 输出检查结果
});


 // js文件合并
// 在命令行输入 gulp concat-js 启动此任务
gulp.task('concat-js', function () {
    gulp.src('dist/js/*.js')  //要合并的文件
    .pipe(order([   //此处文件不用加路径
    	"viewHistory.js",
	    "gallery.js"
  	]))
    .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
    .pipe(gulp.dest('dist/js/concat'));
});

 // css文件合并
 // 在命令行输入 gulp concat-css 启动此任务
gulp.task('concat-css', function () {
    gulp.src('dist/css/*.css')  //要合并的文件
    .pipe(order([   //此处文件不用加路径
    	"import.css",
    	"viewHistory.css",
	    "a.css"
  	]))
    .pipe(concat('all.css'))  // 合并匹配到的js文件并命名为 "all.js"
    .pipe(gulp.dest('dist/css/concat'));
});

// 图片压缩
gulp.task('minify-img', function () {
    return gulp.src('dist/images/original/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('dist/images/min'));
});


// 自动刷新
gulp.task('refresh-sass', function() {
  gulp.src('dist/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen(); //要在这里调用listen()方法
  gulp.watch('dist/sass/*.scss', ['refresh-sass']);
});

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch('dist/sass/*.scss', ['sass']);
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 sass 任务和 auto 任务
gulp.task('default', ['sass','minify-css', 'minify-html','minify-js','jsLint','concat-js','concat-css','minify-img','refresh-sass','watch','auto']);