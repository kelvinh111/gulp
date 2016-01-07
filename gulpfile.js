var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');

var css = __dirname + '/css/'
var js = __dirname + '/js/'

var src = '';
var dev = '';
var prod = '';

var cssSrcFile = 'kel.less';
var cssDevFile = 'kel.css';
var cssProdFile = 'kel.min.css';
var cssSrc = css + src;
var cssDev = css + dev;
var cssProd = css + prod;

var jsSrcFile = 'kel.js';
var jsDevFile = 'kel.js';
var jsProdFile = 'kel.min.js';
var jsSrc = js + src;
var jsDev = js + dev;
var jsProd = js + prod;

// http://www.browsersync.io/docs/options/#option-proxy
// ie. yousite.com
var proxyUrl= 'localhost';

gulp.task('browser-sync', function() {
    browserSync({
        proxy: proxyUrl,
        ws: true
    });
});

gulp.task('build-css', function() {
    return gulp.src([cssSrc + cssSrcFile])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(less())
    .on('error', function(err) {
        gutil.log(err);
        this.emit('end');
    })
    .pipe(sourcemaps.write())
    .pipe(rename(cssDevFile))
    .pipe(gulp.dest(cssDev))
    .on('error', gutil.log)
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('build-css-prod', function() {
    return gulp.src([cssSrc + cssSrcFile])
    .pipe(less())
    .pipe(minifyCss())
    .pipe(rename(cssProdFile))
    .pipe(gulp.dest(cssProd));
});

gulp.task('watch-css', function() {
    return gulp.watch(cssSrc + cssSrcFile, ['build-css']);
});

gulp.task('build-js', function() {
    return gulp.src([jsSrc + jsSrcFile])
    // .pipe(rename(jsDevFile))
    // .pipe(gulp.dest(jsDev))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('build-js-prod', function() {
    return gulp.src([jsSrc + jsSrcFile])
    .pipe(uglify())
    .pipe(rename(jsProdFile))
    .pipe(gulp.dest(jsProd));
});

gulp.task('watch-js', function() {
    return gulp.watch(jsSrc + jsSrcFile, ['build-js']);
});

gulp.task('default', ['browser-sync', 'build-css', 'watch-css', 'build-js', 'watch-js']);
gulp.task('prod', ['build-css-prod', 'build-js-prod']);
