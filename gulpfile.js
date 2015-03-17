var gulp = require('gulp'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    browserSync = require('browser-sync');

var clientDir = "client";

gulp.task('jade', function () {
    gulp.src('src/jade/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(clientDir))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('stylus', function () {
    gulp.src('src/stylus/*.styl')
        .pipe(stylus())
        .pipe(minify())
        .pipe(gulp.dest(clientDir +'/css/'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
    // index.js need to display top
    gulp.src(['src/js/index.js', 'src/js/*.js'])
        .pipe(concat('application.js'))
//        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(clientDir + '/scripts/'))
        .pipe(browserSync.reload({stream: true}));
})

gulp.task('watch', function () {
    gulp.watch(['src/jade/**/*.jade'], ['jade']);
    gulp.watch(['src/stylus/*.styl'], ['stylus']);
    gulp.watch(['src/js/*.js'], ['js']);
});

// TODO 動くが、ポートが変わるのでログインできなくなる
gulp.task('sync', function () {
    browserSync({
        proxy: "http://localhost:3000",
        port: 8888
    });
});

gulp.task('express', function () {
    var debug = require('debug')('ec2-signal');
    var app = require('./server/app');

    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function () {
        debug('Express server listening on port ' + server.address().port);
    });
});

//gulp.task('default', ['jade', 'stylus', 'js', 'watch', 'sync']);
gulp.task('default', ['jade', 'stylus', 'js', 'watch', 'express', 'sync']);
