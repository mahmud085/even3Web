(function() {
    new SmartBanner({
          daysHidden: 15,
          daysReminder: 90,
          appStoreLanguage: 'us',
          title: 'Even3',
          author: 'Official App',
          button: 'Get it',
          store: {
              android: 'Google Play',
          },
          price: {
              android: 'FREE',
          }
          , theme: 'android'
          , icon: 'images/logo-bunner.png'
        //    , force: 'android'
      });
})();