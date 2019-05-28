var gulp = require('gulp'),
	del = require('del'),
	changed = require('gulp-changed'),
	gulpif = require('gulp-if'),
	debug = require('gulp-debug'),
	amdOptimize = require('gulp-requirejs-optimize'),
	// rename = require('gulp-rename'),
	// concat = require('gulp-concat'), //合并插件
	babel = require('gulp-babel'), //es6转义
	uglify = require('gulp-uglify'), //js压缩插件
	cssnano = require('gulp-cssnano'), //css压缩插件
	sass = require('gulp-sass'), //sass文件编译
	postcss = require('gulp-postcss'), //postcss
	autoprefixer = require('autoprefixer'), //浏览器前缀
	postcssImp = require('postcss-import'), //@import内容注入
	htmlmin = require('gulp-htmlmin'), //html压缩插件
	imagemin = require('gulp-imagemin'), //image压缩插件
	rev = require('gulp-rev'), //清除缓存
	revcollector = require('gulp-rev-collector'),
	sequence = require('gulp-sequence'), // 顺序执行
	connect = require('gulp-connect'), // 本地服务器
	proxy = require('http-proxy-middleware'), // 代理
	sourcemaps = require('gulp-sourcemaps') // sourcemap
	// gutil = require('gulp-util')

var isPro = process.env.NODE_ENV === 'development' ? false : true

//删除wx目录下文件
gulp.task('clean', function(cb) {
	return del(['./wx/*'], cb)
})

//操作js文件
gulp.task('mjs', function() {
	return gulp
		.src('./src/common/**/*.js') //需要操作的源文件
		.pipe(debug({title: 'minjs编译:'}))
		.pipe(gulp.dest('./wx/common')) //把操作好的文件放到wx/js目录下
})

gulp.task('rjs', function() {
	return (
		gulp
			.src(['./src/**/*.js', '!./src/common/**/*.js'])
			.pipe(gulpif(!isPro, sourcemaps.init()))
			.pipe(changed('./wx', {extension: '.js'}))
			.pipe(
				babel({
					presets: ['@babel/env']
				})
			)
			.pipe(gulp.dest('./wx'))
			.pipe(
				amdOptimize({
					mainConfigFile: './src/common/js/config.js'
				})
			)
			.pipe(gulpif(!isPro, sourcemaps.write()))
			.pipe(gulpif(isPro,uglify())) //压缩js文件
			.pipe(gulpif(isPro, rev()))
			.pipe(gulp.dest('./wx')) //把操作好的文件放到wx/js目录下
			.pipe(gulpif(isPro, rev.manifest()))
			.pipe(gulpif(isPro, gulp.dest('./wx/rev/js')))
			.pipe(connect.reload())
	) //文件有更新自动执行
})
//操作css文件
var postcssPlugins = [autoprefixer({browsers: ['>0%']}), postcssImp]
gulp.task('css', function() {
	gulp
		.src('./src/**/*.min.css') //需要操作的源文件
		.pipe(gulp.dest('./wx')) //把操作好的文件放到wx/js目录下
	gulp
		.src('./src/**/*.css')
		.pipe(changed('./wx', {extension: '.css'}))
		.pipe(postcss(postcssPlugins))
		.pipe(gulpif(isPro, cssnano())) //css压缩
		.pipe(gulp.dest('./wx'))
		.pipe(connect.reload())
})
//操作scss文件
gulp.task('scss', function() {
	gulp
		.src('./src/**/*.scss')
		.pipe(changed('./wx', {extension: '.css'}))
		.pipe(sass()) //编译less文件
		.pipe(postcss(postcssPlugins))
		.pipe(gulpif(isPro, cssnano())) //css压缩
		.pipe(gulpif(isPro, rev()))
		.pipe(gulp.dest('./wx'))
		.pipe(gulpif(isPro, rev.manifest()))
		.pipe(gulpif(isPro, gulp.dest('./wx/rev/css')))
		.pipe(connect.reload())
})

//图片压缩插件
gulp.task('image', function() {
	return gulp
		.src('./src/**/*.{png,jpg,jpeg,gif,ico}')
		.pipe(changed('./wx', {extension: '.{png,jpg,jpeg,gif,ico}'}))
		.pipe(gulpif(isPro, imagemin()))
		.pipe(gulp.dest('./wx'))
		.pipe(debug({title: 'img编译结束:'}))
		.pipe(connect.reload())
})

//html压缩插件
gulp.task('html', function() {
	let htmlSrc = './src/**/*.html'
	if (isPro) htmlSrc = ['./wx/rev/**/*.json', './src/**/*.html']
	gulp
		.src(htmlSrc)
		.pipe(changed('./wx', {extension: '.html'}))
		.pipe(gulpif(isPro, revcollector()))
		.pipe(
			gulpif(
				isPro,
				htmlmin({
					collapseWhitespace: true, //压缩html
					collapseBooleanAttributes: true, //省略布尔属性的值
					removeComments: true, //清除html注释
					removeEmptyAttributes: true, //删除所有空格作为属性值
					removeScriptTypeAttributes: true, //删除type=text/javascript
					removeStyleLinkTypeAttributes: true, //删除type=text/css
					minifyJS: true, //压缩页面js
					minifyCSS: true //压缩页面css
				})
			)
		)
		.pipe(gulp.dest('./wx'))
		.pipe(connect.reload())
})

gulp.task('serve', ['build'], function() {
	connect.server({
		root: './',
		livereload: true,
		host: '0.0.0.0',
		port: 9000,
		middleware: function(connect, opt) {
			return [
				proxy('/backstage/agent', {
					target: 'http://maptest-xwzx.xinxindai.com',
					changeOrigin: true
				})
			]
		}
	})
	gulp.watch('./src/**/*.js', ['rjs']) //监控文件变化，自动更新
	gulp.watch('./src/**/*.scss', ['scss'])
	gulp.watch('./src/**/*.{png,jpg,jpeg,gif}', ['image'])
	gulp.watch('./src/**/*.html', ['html'])
})

gulp.task('build', function(cb) {
	sequence('css', 'scss', 'mjs', 'rjs', 'image', 'html')(cb)
})
gulp.task('default', ['clean'], function() {
	if (isPro) {
		gulp.start('build')
	} else {
		gulp.start('serve')
	}
})
