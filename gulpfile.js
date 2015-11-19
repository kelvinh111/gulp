var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync');

var css = __dirname + '/css/'
var src = 'src/';
var dev = 'dev/';
var prod = 'prod/';

var cssSrc = css + src;
var cssDev = css + dev;
var cssProd = css + prod;

// http://www.browsersync.io/docs/options/#option-proxy
// ie. yousite.com
var proxyUrl= 'kelvin_test.xenyo.net';

gulp.task('browser-sync', function() {
    browserSync({
        proxy: proxyUrl,
        ws: true
    });
});

gulp.task('build-css', function() {
    return gulp.src([cssSrc + '**/*.less', '!' + cssSrc + '**/_*.less'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(less())
    .on('error', function(err) {
        gutil.log(err);
        this.emit('end');
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDev))
    .on('error', gutil.log)
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('build-css-prod', function() {
    return gulp.src([cssSrc + '**/*.less', '!' + cssSrc + '**/_*.less'])
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest(cssProd));
});

gulp.task('watch-css', function() {
    return gulp.watch(cssSrc + '**/*.less', ['build-css']);
});

gulp.task('default', ['browser-sync', 'build-css', 'watch-css']);
gulp.task('prod', ['build-css-prod']);
