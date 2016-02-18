// Generated on 2015-07-13 using generator-nwjs-material v0.0.0
var builder = require('nw-builder'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    zip = require('gulp-zip'),
    colors = require('colors'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin'),
    fs = require('fs'),
    pkg = require('./package.json');

gulp.task('copy-fonts', function() {
    gulp.src('app/vendor/fonts/*.*')
        .pipe(gulp.dest('minified/vendor/fonts'));
});

gulp.task('copy-favicon', function() {
    gulp.src('app/favicon.png')
        .pipe(gulp.dest('minified'));
});

gulp.task('copy-package', function() {
    gulp.src('app/package.json')
        .pipe(gulp.dest('minified'));
});


gulp.task('html', function () {
    var assets = useref.assets();

    return gulp.src('app/**/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('minified'));
});

gulp.task('minify', ['html', 'copy-fonts', 'copy-favicon', 'copy-package']);

gulp.task('install', function () {
    if (!fs.existsSync('minified/node_modules')) {
        require('child_process').exec('npm install --production', {cwd: './minified'});
    }
});

gulp.task('nw-linux64', ['minify', 'install'], function () {

    var nw = new builder({
        files: ['./minified/**/**', '!./minified/vendor/css/*.css0'],
        platforms: ['linux64'],
        version: '0.12.3',
        appName: pkg.productName,
        appVersion: pkg.version,
        buildType: function () {return pkg.name;}
    });

    nw.on('log', function (msg) {
        gutil.log('\'' + 'node-webkit-builder'.cyan + '\':', msg);
    });

    return nw.build().catch(function (err) {
        gutil.log('\'' + 'node-webkit-builder'.cyan + '\':', err);
    });
});

gulp.task('nw', ['minify', 'install'], function () {

    var nw = new builder({
        files: ['./minified/**/**', '!./minified/vendor/css/*.css0'],
        platforms: ['linux32', 'osx32', 'osx64'],
        version: '0.12.3',
        appName: pkg.productName,
        appVersion: pkg.version,
        buildType: function () {return pkg.name;}
    });

    nw.on('log', function (msg) {
        gutil.log('\'' + 'node-webkit-builder'.cyan + '\':', msg);
    });

    return nw.build().catch(function (err) {
        gutil.log('\'' + 'node-webkit-builder'.cyan + '\':', err);
    });
});

gulp.task('nw-win', ['minify', 'install'], function () {

    var nw = new builder({
        files: ['./minified/**/**', '!./minified/vendor/css/*.css0'],
        platforms: ['win32'],
        winIco: './favicon.ico',
        version: '0.12.3',
        appName: pkg.productName,
        appVersion: pkg.version,
        buildType: function () {return pkg.name;}
    });

    nw.on('log', function (msg) {
        gutil.log('\'' + 'node-webkit-builder'.cyan + '\':', msg);
    });

    return nw.build().catch(function (err) {
        gutil.log('\'' + 'node-webkit-builder'.cyan + '\':', err);
    });
});


gulp.task('dist-win', ['nw-win'], function () {
    return gulp.src('build/start-pifm/win32/**/**')
        .pipe(zip('Windows.zip'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist-osx32', ['nw'], function () {
    return gulp.src('build/start-pifm/osx32/**/**')
        .pipe(zip('OSX32.zip'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist-osx64', ['nw'], function () {
    return gulp.src('build/start-pifm/osx64/**/**')
        .pipe(zip('OSX64.zip'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist-linux32', ['nw'], function () {
    return gulp.src('build/start-pifm/linux32/**/**')
        .pipe(zip('Linux32.zip'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist-linux64', ['nw-linux64'], function () {
    return gulp.src('build/start-pifm/linux64/**/**')
        .pipe(zip('Linux64.zip'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['dist-osx64', 'dist-osx32', 'dist-linux64', 'dist-linux32']);
