var gulp = require('gulp'),
    moment = require('moment'),
    lazypipe = require('lazypipe'),
    rename = require('gulp-rename'),
    liveReload = require('gulp-livereload'),
    inject = require('gulp-inject'),
    series = require('stream-series'),
    watch = require('gulp-watch'),
    notify = require("gulp-notify"),
    minifyCSS = require('gulp-minify-css'),
    less = require("gulp-less"),
    merge = require('merge-stream'),
    ngAnnotate = require('gulp-ng-annotate'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    gif = require('gulp-if'),
    gulpUtil = require('gulp-util'),
    copy = require('gulp-copy'),
    bundle = require('gulp-bundle-assets'),
    // del = require('del'),
    bower = require('gulp-bower'),
    imageOptimization = require('gulp-imagemin');

require('gulp-help')(gulp, {
    description: 'Help listing.'
});

var config = {
    bootstrapDir: './bower_components/bootstrap',
    fontawesomeDir: './bower_components/font-awesome',
    publicDir: './public',
    buildDir: '/build',
    bowerDir: './bower_components'
};

gulp.task('bower', 'Runs and install bower components', function () {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('optimize-images', function (done) {
    gulp.src('public/images/**/*')
        .pipe(imageOptimization())
        .pipe(gulp.dest('public/dist/images'))
        .pipe(gulp.dest('public/images'));
});

gulp.task('font', function () {
    gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(changed('./public/fonts'))
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('bundle', ['font'], function () {
    return gulp.src('./bundle.config.js')
        .pipe(bundle())
        .pipe(bundle.results('./')) // arg is dest of bundle.result.json
        .pipe(gulp.dest('./public'));
});

gulp.task('compile-less')

gulp.task('minify-js', function () {
    return gulp.src([
        './public/app.js',
        './public/vendor.js'
    ])
    .pipe(ngAnnotate())
    .pipe(concat('bundle.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify().on('error', gulpUtil.log))
    .pipe(gulp.dest('./public/prod/'));
});

gulp.task('minify-css', function() {
    return gulp.src([
        './public/app.css',
        './public/vendor.css'
    ])
    .pipe(concat('bundle.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({processImport: false}))
    .pipe(gulp.dest('./public/prod/'));
});

// gulp.task('production', ['bower', 'bundle', 'optimize-images', 'minify-css', 'minify-js'], function() {
//     var target = gulp.src('./views/layout.vash');
//     var sources = gulp.src(['./public/prod/bundle.*']);
//     return target
//         .pipe(inject(series(sources), {
//             transform: function(filepath, file, i, length) {
//                 return inject.transform.apply(inject.transform, arguments);
//             }
//         }));
// })

// gulp.task('build', 'Builds and moves all the resources.', function () {
//     var compileLess = gulp.src(['./public/less/app.less', './public/less/reset.less'])
//             .pipe(less())
//             .on('error', notify.onError("Error: <%= error.message %>"))
//             .pipe(gulp.dest(config.buildDir + '/styles'))
//             .pipe(cleanCSS())
//             .pipe(rename({extname: '.min.css'}))
//             .pipe(gulp.dest(config.buildDir + '/styles'))
//     //.pipe(notify('Compiled less (' + moment().format('MMM Do h:mm:ss A') + ')'))
//         ;

//     var bundleVenderJs = gulp.src([])

//     // var minCompiledCSS = gulp.src('./public/css/*.css')
//     //     .pipe(cleanCSS())
//     //     .pipe(gulp.dest('dist'))

//     var font = gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
//         .pipe(changed('./public/fonts'))
//         .pipe(gulp.dest('./public/fonts'));

//     return merge(font, compileLess);
// });

gulp.task('watch', function () {
    gulp.watch(['./public/less/**/*.less',
        './public/app/**/*.js',
        './public/scripts/**/*.js',
        './bundle.config.js'],
        ['bundle']);
});

gulp.task('default', ['bower', 'bundle']);

