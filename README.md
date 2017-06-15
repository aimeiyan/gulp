# gulp

gulp学习笔记
参考网址：http://www.cnblogs.com/2050/p/4198792.html

1、查看是否安装npm
npm -v

如果你安装的是旧版本的 npm，可以通过 npm 命令来升级，命令如下：
$ sudo npm install npm -g

如果是 Window 系统使用以下命令即可：
npm install npm -g

2、生成package.json文件
$npm init 

3、全局安装 gulp：
$npm install --global gulp
或
$npm install -g gulp

查看gulp版本
gulp -v

全局安装gulp后，还需要在每个要使用gulp的项目中都单独安装一次。把目录切换到你的项目文件夹中，然后在命令行中执行：
npm install gulp

4、作为项目的开发依赖（devDependencies）安装：
$ npm install --save-dev gulp

5、 在项目根目录下创建一个名为 gulpfile.js 的文件：
var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});

目录结构是这样子的：
├── gulpfile.js
├── node_modules
│ └── gulp
└── package.json

6、sass的编译css
sass使用gulp-sass,安装：npm install --save-dev gulp-sass

var gulp = require('gulp'),
    sass = require("gulp-sass");
 
// 编译sass
// 在命令行输入 gulp sass 启动此任务
gulp.task('sass', function() {
    gulp.src('dist/sass/*.scss')  //被编译的文件路径
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))  //编译后自动保存的路径
});

gulp.task('default', ['sass']);

6、css压缩
安装：npm install --save-dev gulp-rename
var gulp = require('gulp');
var rename = require("gulp-rename");

var minifyCss = require("gulp-minify-css");

gulp.task('minify-css', function () {
    gulp.src('dist/css/*.css') // 要压缩的css文件
    .pipe(minifyCss()) //压缩css
    .pipe(rename(function(path){
            path.basename +='.min';
            path.extname = ".css";
    }))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('default', ['sass','minify-css']);

7、html文件压缩
使用gulp-minify-html
安装：npm install --save-dev gulp-minify-html  用来压缩html文件
var gulp = require('gulp');
var rename = require("gulp-rename");
var minifyHtml = require("gulp-minify-html");

gulp.task('minify-html', function () {
    gulp.src('dist/html/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(rename(function(path){
            path.basename +='.min';
            path.extname = ".html";
    }))
    .pipe(gulp.dest('dist/html'));
});

gulp.task('default', ['sass','minify-css', 'minify-html']);

8、 js文件压缩
使用gulp-uglify
安装：npm install --save-dev gulp-uglify
用来压缩js文件，使用的是uglify引擎
var gulp = require('gulp');
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

gulp.task('minify-js', function () {
    gulp.src('dist/js/*.js') // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(rename(function(path){
            path.basename +='.min';
            path.extname = ".js";
    }))
    .pipe(gulp.dest('dist/js')); //压缩后的路径
});

gulp.task('default', ['sass','minify-css', 'minify-html','minify-js']);


9、 js代码检查
var gulp = require('gulp');
var jsLint = require("gulp-jshint");
gulp.task('jsLint', function () {
    gulp.src('dist/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter()); // 输出检查结果
});
gulp.task('default', ['sass','minify-css', 'minify-html','minify-js','jsLint']);

运行gulp jsLint时，可能会出现下面的问题

Gulp Error: Cannot find module 'jshint/src/cli'

问题原因：
插件安装不完全，新版本gulp做了一些调整好像。。。。


解决方法：
使用npm install --save-dev jshint gulp-jshint
而不是npm install --save-dev gulp-jshint

10、合并css
// css文件合并
使用gulp-concat
安装：npm install --save-dev gulp-concat
用来把多个文件合并为一个文件,我们可以用它来合并js或css文件等，这样就能减少页面的http请求数了

var gulp = require('gulp');
var concat = require("gulp-concat");
var order = require("gulp-order");

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
gulp.task('default', ['sass','minify-css', 'minify-html','minify-js','jsLint','concat-css']);

11、合并js
 // js文件合并
使用gulp-concat
安装：npm install --save-dev gulp-concat
用来把多个文件合并为一个文件,我们可以用它来合并js或css文件等，这样就能减少页面的http请求数了

var gulp = require('gulp');
var concat = require("gulp-concat");
var order = require("gulp-order");

gulp.task('concat-js', function () {
    gulp.src('dist/js/*.js')  //要合并的文件
    .pipe(order([   //此处文件不用加路径
        "viewHistory.js",
        "gallery.js"
      ]))
    .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
    .pipe(gulp.dest('dist/js/concat'));
});
gulp.task('default', ['sass','minify-css', 'minify-html','minify-js','jsLint','concat-css','concat-js']);

12、图片压缩
npm install --save-dev gulp-imagemin
npm install --save-dev imagemin-pngquant

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); //png图片压缩插件

gulp.task('minify-img', function () {
    return gulp.src('dist/images/original/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('dist/images/min'));
});
gulp.task('default', ['sass','minify-css', 'minify-html','minify-js','jsLint','concat-js','concat-css','minify-img']);

13、自动刷新
使用gulp-livereload插件，安装:npm install --save-dev gulp-livereload。
当代码变化时，它可以帮我们自动刷新页面
该插件最好配合谷歌浏览器来使用，且要安装livereload chrome extension扩展插件,不能下载的请自行FQ。
// 在命令行输入 gulp watch 启动此任务
可以用idea见http服务器，点击为实心就可以自动刷新了
// 自动刷新
// refresh-sass和watch，chrome浏览器安装
gulp.task('refresh-sass', function() {
  gulp.src('dist/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

// 在命令行输入 gulp watch 启动此任务
gulp.task('watch', function() {
  livereload.listen(); //要在这里调用listen()方法
  gulp.watch('dist/sass/*.scss', ['refresh-sass']);
});

gulp.task('default', ['sass','minify-css', 'minify-html','minify-js','jsLint','concat-js','concat-css','minify-img','refresh-sass','watch']);

14、监听sass编译任务
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行此任务
    gulp.watch('dist/sass/*.scss', ['sass']);
});

gulp.task('default', ['sass','minify-css', 'minify-html','minify-js','jsLint','concat-js','concat-css','minify-img','refresh-sass','watch','auto']);
