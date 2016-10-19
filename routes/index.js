var sm = require('sitemap');
var request = require('request');

function indexRoutes (app, router, sitemap) {

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('index', { title: 'Index' });
  });

  /* Get sitemap */
  router.get('/sitemap.xml', function (req, res, next){
    sitemap.hostname = app.get('siteUrl') + '/#!';
    sitemap.toXML(function(err, xml){
        if(err){
          console.log("error: " + err);
          return res.status(500).end();
        }
        console.log("ok");
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    });
  });

  return router;
}

module.exports = indexRoutes;