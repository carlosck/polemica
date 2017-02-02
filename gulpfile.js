var gulp = require('gulp');
var watch = require('gulp-watch');
var shell = require('gulp-shell')

var sass = require('gulp-sass');
var plumber  = require('gulp-plumber');

var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json']

	,
	'sass': {
		all: './app/sass/**/*.sass',
		output: './public/styles/'
	},
	'vendor': {
		all: './app/scss/vendor.scss',
		output: './public/styles/'
	}

};


gulp.task('watch:sass', function () {
	gulp.watch(paths.sass.all, ['sass']);
});

gulp.task('vendor', function(){
	return gulp.src(paths.vendor.all)
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.vendor.output));
});

gulp.task('sass', function(){
	return gulp.src(paths.sass.all)
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.sass.output));
});


gulp.task('runKeystone', shell.task('node keystone.js'));
gulp.task('watch', [
  'watch:sass',

]);

gulp.task('default', ['vendor','sass','runKeystone']);
gulp.task('dev', ['vendor','sass','watch']);
