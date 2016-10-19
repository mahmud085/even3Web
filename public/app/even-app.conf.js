(function () {
    'use strict';
    angular.module('evenApp')
        .config(evenAppConfig)
        .value('envData', { apiUrl: '', environment: '' })
        .run(evenRun)
        ;


    function evenAppConfig($urlRouterProvider, $locationProvider, $stateProvider, envServiceProvider, ngMetaProvider) {

        $stateProvider
            .state('Main', {
                abstract: true,
                views: {
                    header: {
                        templateUrl: 'app/pages/common/templates/header.html',
                        controller: 'HeaderController'
                    },
                    '': {
                        template: '<ui-view />'
                    },
                    footer: {
                        templateUrl: 'app/pages/common/templates/footer.html'
                    }
                }
            })
            
        ngMetaProvider.setDefaultTitle('Even3');
        ngMetaProvider.setDefaultTag('description', 'Default Description');
        ngMetaProvider.setDefaultTag('image', '/images/events.png');

        envServiceProvider.config({
            domains: {
                development: ['localhost','even3.herokuapp.com'],
                production: [ 'even3app.com']
            },
            vars: {
                development: {
                    apiUrl: 'http://dev.even3.co/api/'
                },
                production: {
                    apiUrl: 'http://api.even3app.com/api/'
                }
            }
        });
        envServiceProvider.check();
        $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode(false).hashPrefix('!');

        
    }

    function evenRun($rootScope, $location, $window, envData, envService, ngMeta) {
        ngMeta.init();
        envData.apiUrl = envService.read('apiUrl');
        envData.environment = envService.get();

        if ($location.host() !== 'localhost') {
            $window.ga('create', 'UA-81616378-1', 'auto');

            $rootScope.$on('$stateChangeSuccess', function (event) {
                $window.ga('send', 'pageview', $location.path());
            });
        }
    }
})();