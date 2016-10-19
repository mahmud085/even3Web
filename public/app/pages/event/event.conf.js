(function () {
    'use strict';
    angular.module('evenApp')
        .config(eventConfig);

    function eventConfig($stateProvider) {
        $stateProvider
            .state('Main.Event', {
                abstract: true,
                url: '/event',
                template: '<ui-view />',
                controller: 'EventController'
            })
            .state('Main.Event.Create', {
                url: '/create',
                templateUrl: 'app/pages/event/templates/create-event.html',
                controller: 'CreateEventController'
            })
            .state('Main.Event.Detail', {
                abstract: true,
                url: '/:id',
                template: '<ui-view />'
            })
            .state('Main.Event.Detail.Info', {
                templateUrl: 'app/pages/event/templates/event-detail.html',
                url: '/',
                controller: 'EventDetailController',
                resolve: {
                    data: function (ngMeta, httpService, $stateParams, envData) {
                        var id = $stateParams.id;
                        var baseurl = envData.apiUrl;
                        var filter = "?filter[where][id]=" + id + "&filter[include]=account" + "&filter[include]=tickets";
                        var eventDetailPromise = httpService.getData('Events', filter)
                            .then(function (res) {
                                var eventDetail = res[0];
                                var imagePath = baseurl + eventDetail.EventPicture;
                                var title = 'Even3 - event: ' + eventDetail.Name;
                                var description = eventDetail.Description;

                                ngMeta.setTitle(title);
                                ngMeta.setTag('description', description);
                                ngMeta.setTag('image', imagePath);
                            }, function (err) {
                                console.log(err);
                            })
                    }
                },
                meta: {
                    disableUpdate: true
                }
            })
            .state('Main.Event.Detail.Edit', {
                url: '/edit',
                templateUrl: 'app/pages/event/templates/edit-event.html',
                controller: 'EditEventController'
            })
            .state('Main.Event.Detail.Cart', {
                url: '/cart',
                templateUrl: 'app/pages/common/templates/cart.html',
                controller: 'CartController',
                meta: {
                    title: 'Even3',
                    description: 'FIND THE BEST EVENTS IN YOUR TOWN!' + 
                                'See and visit interesting places.Share experiences with your friends. Simply!'
                }
            })
    }

})();