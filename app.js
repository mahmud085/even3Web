const express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  vash = require('vash'),
  prerender = require('prerender-node');


const app = express();
const routes = express.Router(); 

app.set('port', process.env.PORT || 3001);  
app.set('prerenderToken','sUQW6WFkgIN1BiiyrgIg');
app.set('prerenderRecacheUrl', 'http://api.prerender.io/recache');
app.set('apiUrl', 'http://api.even3app.com/api');
app.set('siteUrl', 'http://even3app.com');
/*
if (app.get('env') === 'development') {
    app.set('apiUrl', 'http://139.59.163.121/api');
    app.set('siteUrl', 'http://even3.herokuapp.com');
}
*/

const sitemap = require('./libs/sitemap')(app);

require('./routes/index')(app, routes, sitemap);
require('./routes/prerender')(app, routes);


var bundles = require('./bundle.result.json') //todo: create and inject env specific configurations
vash.helpers.bundles = bundles;
// bundleUp(app, assets, {
//   staticRoot: path.join(__dirname, '/'),
//   staticUrlRoot: '/',
//   bundle: true, //app.get('env') === 'production',
//   minifyCss: true,
//   minifyJs: true, 
//   asyncJs: false,
//   complete: console.log.bind(console, "Bundle-up: static files are minified/ready")
// });

// vash.helpers.renderStyles = app.locals.renderStyles;
// vash.helpers.renderJs = app.locals.renderJs;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

app.use(prerender.set(app.get('prerenderToken')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(compress({
  filter: (req, res) => (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type')),
  level: 9
}));

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/images/popular-category', express.static(path.join(__dirname, 'public/images/popular-category')));
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/bower_components',  express.static( path.join(__dirname, '/bower_components')));
app.use('/views', express.static(path.join(__dirname, 'public/app/views')));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




var server = app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;
