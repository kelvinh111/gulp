let gulp = require('gulp')
let plumber = require('gulp-plumber')
let rename = require("gulp-rename")
let less = require('gulp-less')
let sourcemaps = require('gulp-sourcemaps')
let cleanCSS = require('gulp-clean-css')
let babel = require('gulp-babel')
let concat = require('gulp-concat')
let uglify = require('gulp-uglify')
let browserSync = require('browser-sync')
let logger = require('gulplog');

// change this
let themePath = __dirname + '/'
let css = themePath + '/css/'
let js = themePath + '/js/'

function onError(err) {
    logger.error(err)
}

// change the localhost to your url
// ie. yousite.com
// http://www.browsersync.io/docs/options/#option-proxy
let proxyUrl = 'lab.kelvinh.studio/xenyo_site/static'

gulp.task('browser-sync', () => {
    browserSync({
        proxy: proxyUrl,
        ws: true,
        // port: 5000
    })
})

gulp.task('build-css', () => {
    return gulp.src([css + 'src/**/*.less', '!' + css + '**/_*.less'])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(less().on('error', onError))
        .pipe(rename(path => {
            path.extname = '.css'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(css))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('build-css-prod', () => {
    return gulp.src([css + 'src/**/*.less', '!' + css + '**/_*.less'])
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename(path => {
            path.extname = '.min.css'
        }))
        .pipe(gulp.dest(css))
})

gulp.task('watch-css', () => {
    return gulp.watch(css + '**/*.less', ['build-css'])
})

gulp.task('build-js', () => {
    return gulp.src([js + 'src/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["env"]
        }))
        .on('error', onError)
        //.pipe(rename(function(path) {
        //path.basename += ''
        //))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(js))
        .pipe(browserSync.reload({
            stream: true,
            once: true
        }))
})

gulp.task('build-js-prod', () => {
    return gulp.src([js + 'src/**/*.js'])
        .pipe(babel({
            presets: ["env"]
        }))
        .on('error', onError)
        .pipe(concat('app.js'))
        .pipe(uglify({
            compress: true
        }))
        .pipe(rename(path => {
            path.extname = '.min.js'
        }))
        .pipe(gulp.dest(js))
})

gulp.task('watch-js', () => {
    return gulp.watch(js + 'src/**/*.js', ['build-js'])
})

gulp.task('default', ['browser-sync', 'build-css', 'watch-css', 'build-js', 'watch-js'])
gulp.task('prod', ['build-css-prod', 'build-js-prod'])
