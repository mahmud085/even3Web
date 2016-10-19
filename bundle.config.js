var lazypipe = require('lazypipe');
var less = require('gulp-less');
var gif = require('gulp-if');
var extend = require('util')._extend;


function stringEndsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// only run transforms against certain file types.
// This is only necessary if your bundle has a mix of file types in it
function isLessFile(file) {
    return stringEndsWith(file.relative, 'less');
}


// pipe as many transforms together as you like
var styleTransforms = lazypipe()
    .pipe(function () {
        // when using lazy pipe you need to call gulp-if from within an anonymous func
        // https://github.com/robrich/gulp-if#works-great-inside-lazypipe
        return gif(isLessFile, less());
    });

var prodLikeEnvs = ['production', 'staging']; // when NODE_ENV=staging or NODE_ENV=production
var envOptions = {
    uglify: prodLikeEnvs,
    minCSS: prodLikeEnvs,
    rev: false,
    transforms: {
        styles: styleTransforms
    }
};


module.exports = {
    bundle: {
        app: {
            scripts: [
                './public/scripts/*.js',
                './public/app/**/*.js'
            ],
            styles: './public/less/app.less',
            options: Object.assign({}, envOptions, {
                order: {
                    scripts: [
                        '**/app.js',
                        '**/main.js',
                        '**/app/**/*.mod.js',
                        '**/app/**/*.conf.js',
                        '**/app/**/*.js',
                        '**/scripts/*.js'
                        
                    ]
                }
            })
        },
        vendor: {
            scripts: [
                './bower_components/angular/angular.js',
                './bower_components/angular-animate/angular-animate.js',
                './bower_components/ngMeta/dist/ngMeta.js',
                './bower_components/angular-environment/src/angular-environment.js',
                './bower_components/angular-aria/angular-aria.js',
                './bower_components/angular-cookies/angular-cookies.js',
                './bower_components/angular-messages/angular-messages.js',
                './bower_components/angular-resource/angular-resource.js',
                './bower_components/angular-route/angular-route.js',
                './bower_components/angular-sanitize/angular-sanitize.js',
                './bower_components/angular-touch/angular-touch.js',
                './bower_components/angular-ui-router/release/angular-ui-router.js',
                './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                './bower_components/oclazyload/dist/ocLazyLoad.min.js',
                './bower_components/angular-busy/dist/angular-busy.min.js',
                './bower_components/angular-material/angular-material.js',
                './bower_components/mdPickers/dist/mdPickers.js',
                './bower_components/angularjs-datepicker/dist/angular-datepicker.min.js',
                './bower_components/angular-stripe/release/angular-stripe.js',
                './bower_components/angular-credit-cards/release/angular-credit-cards.js',
                './bower_components/angular-qrcode/angular-qrcode.js',
                './bower_components/angular-directive.g-signin/google-plus-signin.js',
                './bower_components/ng-file-upload/ng-file-upload.js',
                './bower_components/angular-google-maps/dist/angular-google-maps.js',
                './bower_components/angular-simple-logger/dist/angular-simple-logger.js',
                './bower_components/angular-route/angular-route.js',
                './bower_components/angular-cropper/angular-cropper.js',
                './bower_components/angular-file-reader/angular-file-reader.js',
                './bower_components/angular-socialshare/dist/angular-socialshare.js',
                './bower_components/ngstorage/ngstorage.js',
                './bower_components/lodash/dist/lodash.js',
                './bower_components/moment/min/moment-with-locales.js',
                './bower_components/angular-owl-carousel/src/angular-owl-carousel.js',
                './bower_components/ng-img-crop-full-extended/compile/minified/ng-img-crop.js'
            ],
            styles: [
                './bower_components/angular-busy/dist/angular-busy.min.css',
                './bower_components/angularjs-datepicker/dist/angular-datepicker.min.css',
                './bower_components/mdPickers/dist/mdPickers.css',
                './bower_components/angular-material/angular-material.css',
                './bower_components/bootstrap-social/bootstrap-social.css',
                './bower_components/ng-img-crop-full-extended/compile/minified/ng-img-crop.css'
            ],
            options: envOptions
        }
    },
    copy: {
        src: './bower_components/bootstrap/dist/fonts/**/*.*',
        base: './bower_components/bootstrap/'
    }
};