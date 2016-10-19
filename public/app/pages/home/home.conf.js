(function () {
    'use strict';
    angular.module('evenApp')
        .config(homeConfig);

    function homeConfig($stateProvider) {
        $stateProvider
            .state('Main.Home', {
                abstract: true,
                templateUrl: 'app/pages/home/templates/home.html'
            })
            .state('Main.Home.Event', {
                url: '/',
                views: {
                   'searchView': {
                        templateUrl: 'app/pages/home/templates/search-event.html',
                        controller: 'SearchEventController'
                    },
                    'eventView': {
                        templateUrl: 'app/pages/home/templates/event.html',
                        controller: 'EventController'
                    },
                    'carouselView': {
                        templateUrl: 'app/pages/home/templates/carousel.html',
                        controller: 'CarouselController'
                    },
                    'businessView': {
                        templateUrl: 'app/pages/home/templates/business.html',
                        controller: 'BusinessController'
                    },
                    'newsLetterView': {
                        templateUrl: 'app/pages/home/templates/news-letter.html',
                        controller: 'NewsLetterController'
                    }                     
                },
                meta: {
                    title: 'Even3 - home',
                    description: 'FIND THE BEST EVENTS IN YOUR TOWN!' + 
                                'See and visit interesting places.Share experiences with your friends. Simply!'
                }
            })
            .state('Main.HowItWorks', {
                url: '/howItWorks',
                templateUrl: 'app/pages/home/templates/how-it-works.html',
                controller: 'HowItWorksController',
                meta: {
                    title: 'Even3 - How It Works',
                    description: 'FIND THE BEST EVENTS IN YOUR TOWN!' + 
                                'See and visit interesting places.Share experiences with your friends. Simply!'
                }
            })
            .state('Main.Search', {
                url: '/search',
                templateUrl: 'app/pages/home/templates/search.html',
                controller: 'SearchController',
                meta: {
                     title: 'Even3 - Search',
                    description: 'FIND THE BEST EVENTS IN YOUR TOWN!' + 
                                'See and visit interesting places.Share experiences with your friends. Simply!'
                }
            })
            .state('Main.Signup', {
                url: '/signup',
                templateUrl: 'app/pages/home/templates/sign-up.html',
                controller: 'SignUpController',
                meta: {
                     title: 'Even3 - Sign Up',
                    description: 'FIND THE BEST EVENTS IN YOUR TOWN!' + 
                                'See and visit interesting places.Share experiences with your friends. Simply!'
                }
            })
            .state('Main.Login', {
                url: '/login',
                templateUrl: 'app/pages/home/templates/login.html',
                controller: 'LoginModalController',
                meta: {
                     title: 'Even3 - Login',
                    description: 'FIND THE BEST EVENTS IN YOUR TOWN!' + 
                                'See and visit interesting places.Share experiences with your friends. Simply!'
                }
            })
            .state('Main.Signup.Success', {
                url: '/success',
                views:{
                    "@":{
                           templateUrl: 'app/pages/home/templates/sign-up-success.html',
                           controller: 'SignUpSuccessController',
                    }
                },
                meta: {
                     title: 'Even3 - SignUp',
                    description: 'FIND THE BEST EVENTS IN YOUR TOWN!' + 
                                'See and visit interesting places.Share experiences with your friends. Simply!'
                }
            })
            .state('Main.ForgotPassword', { //without header and footer
                url: '/forgotPassword',
                templateUrl: 'app/pages/common/templates/forgot-password.html',
                controller: 'ForgotPasswordController',
                meta: {
                     title: 'Even3 - Forgot Password',
                    description: 'FIND THE BEST EVENTS IN YOUR TOWN!' + 
                                'See and visit interesting places.Share experiences with your friends. Simply!'
                }
            })
            .state('Main.ErrorPage', {
                url: '/error-page',
                templateUrl: 'app/pages/common/templates/error-page.html'
            })
    }

})();