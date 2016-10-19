var sm = require('sitemap');
var request = require('request');
var async = require('async');

function generateSitemap(app){
  
    var apiUrl = app.get('apiUrl');
    var sitemap = sm.createSitemap({
        cacheTime : 600000
      });

      sitemap.add({url:'/'});
      sitemap.add({url:'/howItWorks'});

      async.parallel([
          getEvents,
          getBusinesses,
      ], function(err, results){
          if(err) {
              console.log(err.message);
          }else{
            addUrls(sitemap, "event", results[0][1]);
            addUrls(sitemap, "business", results[1][1]);
          }
      });

    return sitemap;
    
    function getEvents(callback){
        request({url: apiUrl + '/events', json: true}, callback);
    }
    
    function getBusinesses(callback){
        request({url: apiUrl + '/businesses', json: true}, callback);
    }

    function addUrls(sitemap, type, data){
        data.forEach(function(item){
              sitemap.add({ 
                  url: '/'+ type +'/' + item.id + '/'
              });
        });
    }
}

module.exports = generateSitemap;