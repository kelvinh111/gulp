var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var babel = require('gulp-babel');
var es2015 = require('babel-preset-es2015');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var javascriptObfuscator = require('gulp-javascript-obfuscator');

var css = __dirname + '/css/';
var js = __dirname + '/js/';

var onError = function (err) {
    gutil.log(gutil.colors.red("ERROR", "less"), err);
    this.emit("end", new gutil.PluginError("less", err, { showStack: true }));
};

// http://www.browsersync.io/docs/options/#option-proxy
// ie. yousite.com
var proxyUrl= 'localhost';

gulp.task('browser-sync', function() {
    browserSync({
        proxy: proxyUrl,
        ws: true,
        // port: 5000
    });
});

gulp.task('build-css', function() {
    return gulp.src([css + 'src/**/*.less', '!' + css + '**/_*.less'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(less().on('error', onError))
    .pipe(rename(function(path) {
        path.extname = '.css';
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(css))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('build-css-prod', function() {
    return gulp.src([css + 'src/**/*.less', '!' + css + '**/_*.less'])
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(rename(function(path) {
        path.extname = '.min.css';
    }))
    .pipe(gulp.dest(css));
});

gulp.task('watch-css', function() {
    return gulp.watch(css + '**/*.less', ['build-css']);
});

gulp.task('build-js', function() {
    return gulp.src([js + 'src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: [es2015]
    }))
    .on('error', onError)
    //.pipe(rename(function(path) {
        //path.basename += '';
    //))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(js))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('build-js-prod', function() {
    return gulp.src([js + 'src/**/*.js'])
    .pipe(babel({
        presets: [es2015]
    }))
    .on('error', onError)
    .pipe(concat('app.js'))
    .pipe(uglify({compress:true}))
    .pipe(javascriptObfuscator({
        compact:true
    }))
    .pipe(rename(function(path) {
        path.extname = '.min.js';
    }))
    .pipe(gulp.dest(js));
});

gulp.task('watch-js', function() {
    return gulp.watch(js + 'src/**/*.js', ['build-js']);
});

gulp.task('default', ['browser-sync', 'build-css', 'watch-css', 'build-js', 'watch-js']);
gulp.task('prod', ['build-css-prod', 'build-js-prod']);
