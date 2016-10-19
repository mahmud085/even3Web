var request = require('request');

/**
 * Updates Prerendar data.
 */
function prerenderRouter (app, router){
    router.get('/recache', function (req, res, next) {
        //if (app.get('env') !== 'development') {
          if (req.query.id && req.query.type && (req.query.type === 'event' || req.query.type === 'business')) {

            var recacheUrl =  app.get('siteUrl') + '/#!/' + req.query.type + '/' + req.query.id;
            var sendOptions  ={
              url : app.get('prerenderRecacheUrl'),
              form: {
                prerenderToken: app.get('prerenderToken'),
                url: recacheUrl
              } 
            };

            request.post(sendOptions, function(err, response, body){
                res.send('ok');
            });
        
          }
        //}else{
         //   res.end();
       // }
    })

    return router;
}

module.exports = prerenderRouter;