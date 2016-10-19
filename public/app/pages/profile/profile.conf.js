(function () {
    'use strict';
    angular.module('evenApp')
        .config(profileConfig);

    function profileConfig($stateProvider) {
        $stateProvider
            .state('Main.Profile', {
                url: '/profile',
                template: '<ui-view />',
                abstract: true
            })
            .state('Main.Profile.Info', {
                url: '/',
                templateUrl: 'app/pages/profile/templates/profile.html',
                controller: 'ProfileController'
            })
            .state('Main.Profile.Event', {
                url: '/event',
                templateUrl: 'app/pages/profile/templates/profile-event.html',
                controller: 'ProfileEventController'
            })
            .state('Main.Profile.History', {
                url: '/history',
                templateUrl: 'app/pages/profile/templates/profile-history.html',
                controller: 'ProfileHistoryController'
            })
            .state('Main.Profile.Interest', {
                url: '/interest',
                templateUrl: 'app/pages/profile/templates/profile-interest.html',
                controller: 'ProfileInterestController'
            })
            .state('Main.Profile.PaymentMethod', {
                url: '/paymentMethod',
                templateUrl: 'app/pages/profile/templates/profile-payment-method.html',
                controller: 'ProfilePaymentMethodController'
            })
            .state('Main.Profile.Service', {
                url: '/service',
                templateUrl: 'app/pages/profile/templates/profile-service.html',
                controller: 'ProfileServiceController'
            })
            .state('Main.Profile.Ticket', {
                url: '/ticket',
                templateUrl: 'app/pages/profile/templates/profile-ticket.html',
                controller: 'ProfileTicketController'
            })
    }

})();