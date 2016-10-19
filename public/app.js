(function () {
    'use strict';
    angular.module('evenApp', [
        'ngMaterial',
        'ngAnimate',
        'ngMeta',
        'mdPickers',
        '720kb.datepicker',
        'angular-stripe',
        'credit-cards',
        'monospaced.qrcode',
        'directive.g+signin',
        'cgBusy',
        'ngFileUpload',
        'uiGmapgoogle-maps',
        'ui.router',
        'ui.bootstrap',
        'oc.lazyLoad',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'tw.directives.cropper',
        '720kb.socialshare',
        'ngStorage',
        'ngImgCrop'
    ]);
})();
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
(function () {
    'use strict';
    angular.module('evenApp')
        .config(businessConfig);

    function businessConfig($stateProvider) {
        $stateProvider
            .state('Main.Business', {
                abstract: true,
                url: '/business',
                template: '<ui-view />',
                controller: 'BusinessController'
            })
            .state('Main.Business.Create', {
                url: '/create',
                templateUrl: 'app/pages/business/templates/create-business.html',
                controller: 'CreateBusinessController'
            })
            .state('Main.Business.Detail', {
                abstract: true,
                url: '/:id',
                template: '<ui-view />'
            })
            .state('Main.Business.Detail.Info', {
                url: '/',
                templateUrl: 'app/pages/business/templates/business-detail.html',
                controller: 'BusinessDetailController',
                resolve: {
                    data: function (ngMeta, httpService, $stateParams, envData) {
                        var id = $stateParams.id;
                        var baseurl = envData.apiUrl;
                        var filter = "?filter[where][id]=" + id + "&filter[include]=account";
                        var businessDetailPromise = httpService.getData('Businesses', filter)
                            .then(function (res) {
                                var businessDetail = res[0];
                                var imagePath = baseurl + businessDetail.BusinessPicture;
                                var title = 'Even3 - service: ' + businessDetail.Name
                                var description = businessDetail.Description;

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
            .state('Main.Business.Detail.Edit', {
                url: '/edit',
                templateUrl: 'app/pages/business/templates/edit-business.html',
                controller: 'EditBusinessController'
            })
    }

})();
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
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('BusinessDetailController', ["$scope", "$state", "$stateParams", "httpService", "$http", "$interval", "$sce", "$uibModal", "$window", BusinessDetailController])

    function BusinessDetailController($scope, $state, $stateParams, httpService, $http, $interval, $sce, $uibModal, $window) {

        $scope.businessDetail = {};
        var geoUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCuPr_PsYccfO9CDnEflllkcFcbMurXRUg&q=";
        $scope.commentList = [];
        $scope.CommentBody = "";
        $scope.contact = "";
        $scope.hireEmail = "";
        var id = $stateParams.id;
        $scope.showSaveButton = $scope.loggedIn;
        $scope.buttonDisabled = false;
        $scope.buttonValue = "SAVE";
        $scope.showRate = false;
        $scope.ownBusiness = false;

        $scope.getBusinessDetail = function () {
            var filter = "?filter[where][id]=" + id + "&filter[include]=account";
            var d = new Date();
            $scope.businessDetailPromise = httpService.getData('Businesses', filter)
                .then(function (res) {
                    $scope.businessDetail = res[0];
                    //$scope.hire = "mailto:"+ $scope.businessDetail.email + "?subject= New Hiring proposal from Even3";
                    $scope.geoSrc = $sce.trustAsResourceUrl(geoUrl + $scope.businessDetail.Address);
                    //initialization of map
                    $scope.map = {
                        center: {
                            latitude: $scope.businessDetail.Location.lat,
                            longitude: $scope.businessDetail.Location.lng
                        },
                        zoom: 14
                    };
                    //initialization of map marker
                    $scope.marker = {
                        id: 0,
                        coords: {
                            latitude: $scope.businessDetail.Location.lat,
                            longitude: $scope.businessDetail.Location.lng
                        }
                    };
                    // loggeddIn na thakle rate korteparbe na,, but rate korte gele login modal show korbe
                    //save bussiness korte hole login thakte hobe
                    //own biz save kora jabe na, button disable show korbe
                    //ek baar save kora biz 2nd save korte parbe na
                    if ($scope.loggedIn) {
                        if ($scope.userInfo.userId === $scope.businessDetail.AccountId) {
                            $scope.businessDetail.ownBusiness = true;
                            $scope.showRate = false;
                            $scope.businessDetail.buttonDisabled = true;
                        } else {
                            $scope.showRate = true;
                            $scope.businessDetail.ownBusiness = false;
                        }

                    } else {
                        $scope.showRate = false;
                        $scope.businessDetail.ownBusiness = false;
                    }
                    if ($scope.businessDetail != undefined) {
                        if ($scope.businessDetail.email.length > 0) {
                            $scope.contact += $scope.businessDetail.email;
                        }
                        if ($scope.businessDetail.Phone !== undefined) {
                            if ($scope.contact.length > 0) {
                                $scope.contact += " / " + $scope.businessDetail.Phone;
                            } else {
                                $scope.contact += $scope.businessDetail.Phone;
                            }
                        }
                        if ($scope.businessDetail.Website !== undefined) {
                            if ($scope.contact.length > 0) {
                                $scope.contact += " / " + $scope.businessDetail.Website;
                            } else {
                                $scope.contact += $scope.businessDetail.Website;
                            }
                        }
                    }
                }
                , function (err) {
                    //console.log(err);
                })
        }
        $scope.getBusinessDetail();

        //hire service part
        $scope.hireMe = function () {
            if ($scope.loggedIn) {
                //var hire = "mailto:"+ $scope.business.account.email + "?subject= New%20Hiring%20proposal%20from%20Even3";
                $window.open("mailto:" + $scope.businessDetail.email + "?subject=New%20Hiring%20proposal%20from%20Even3");
                /*$uibModal.open({
                   animation: $scope.animationsEnabled,
                   templateUrl: 'views/hireModal.html',
                   controller: 'HireModalCtrl',
                   resolve: {
                       business: function () {
                           return $scope.businessDetail;
                       }
                   }
               });*/
            } else {
                $state.go('Main.Login');
            }
        }

        $scope.getBackgroundImage = function () {
            var imagePath = $scope.baseurl + $scope.businessDetail.BusinessPicture;
            return 'url(' + imagePath + ')';

        }
        //commnet GET part
        //2 sec por por new comment check korbe, $interval ei jonne use kora hoise
        function getComments() {
            var filter = "?filter[include]=account" + "&filter[where][BusinessId]=" + id;
            httpService.getData("EventComments", filter, "")
                .then(function (res) {
                    $scope.commentList = res;
                }
                , function (err) {
                    //console.log(err);
                })
        }

        function getNewComments() {
            var filter = "?filter[include]=account" + "&filter[where][BusinessId]=" + id;
            httpService.getData("EventComments", filter, "")
                .then(function (res) {
                    if (res.length !== $scope.commentList.length) {
                        $scope.commentList = res;
                    }
                }
                , function (err) {
                    //console.log(err);
                })
        }
        getComments();
        //new comment check
        var commentPromice = $interval(getNewComments, 2000);

        //interval destroy kora hoise state change kora matroi, otherwise puro shomoy $interval choltei thakbe
        $scope.$on("$destroy", function () {
            if (commentPromice) {
                $interval.cancel(commentPromice);
            }
        });

        //comment add function
        $scope.addComment = function (comment) {
            if (comment.length === 0) {
                alert('Can not post EMPTY Comment');
            }
            else {
                $scope.CommentBody = "";
                var obj = {};
                obj.Time = new Date().getTime();
                obj.CommentBody = comment;
                obj.BusinessId = id;
                obj.Id = $scope.userInfo.userId;
                httpService.postMultiData('EventComments/addcomment', obj, $scope.userInfo.id);
            }
        }

        //rate korar part, fullstar and empty star
        $scope.giveRate = 0;
        $scope.fullStar = 0;
        $scope.emptyStar = 5;
        $scope.fullStarRate = function (n) {
            $scope.giveRate = n;
            $scope.fullStar = n;
            $scope.emptyStar = 5 - n;
        }
        $scope.emptyStarRate = function (n) {
            $scope.giveRate = n;
            $scope.fullStar = n + $scope.fullStar;
            $scope.emptyStar = 5 - $scope.fullStar;
        }

        $scope.postRate = function () {
            var obj = {
                value: $scope.fullStar,
                AccountId: $scope.userInfo.userId,
                BusinessId: id
            }
            $scope.ratePromise = httpService.postData(obj, "ratings", "")
                .then(function (res) {
                    $scope.showRate = false;
                });

            $scope.getRatings();
        }

        function setRatings(arr) {
            if (arr === undefined || arr.length === 0) {
                $scope.ratingNum = 0;
                $scope.showRate = true;
            }
            else {
                if ($scope.loggedIn) {
                    if (!$scope.ownBusiness) {
                        var filter = "?filter[where][BusinessId]=" + id + "&filter[where][AccountId]=" + $scope.userInfo.userId
                        $scope.ratePromise = httpService.getData('ratings', filter, "")
                            .then(function (response) {
                                if (response.length === 0) {
                                    $scope.showRate = true;
                                } else {
                                    $scope.showRate = false;
                                }
                            })
                    }
                }
                var totalVal = arr.reduce(function (prev, curr) {
                    return prev + curr.value;
                }, 0);
                $scope.ratingNum = Math.floor(totalVal / (arr.length));
            }
        }

        $scope.items = [1, 2, 3, 4, 5]
        $scope.getRatings = function () {
            var filter = "?filter[where][BusinessId]=" + id;
            $scope.ratePromise = httpService.getData('ratings', filter, "")
                .then(function (data) {
                    $scope.ratingList = data;
                    setRatings($scope.ratingList);
                },
                function (err) {
                    console.log(err);
                });
        }
        $scope.getRatings();

        function getServices() {
            var filter = "?filter[where][BusinessId]=" + id;
            httpService.getData('services', filter, "")
                .then(function (data) {
                    $scope.serviceList = data;
                    for (var i = 0; i < $scope.serviceList.length; i++) {
                        $scope.serviceList[i].currencySymbol = $scope.currencySymbolList[$scope.serviceList[i].currency]
                    }
                },
                function (err) {
                    console.log(err);
                })
        }
        getServices();

        $scope.deleteService = function () {
            var cnfrm = confirm("Are you Sure to Delete your Service?");
            if (cnfrm) {
                httpService.deleteData('Businesses', $scope.userInfo.id, id)
                    .then(function (response) {
                        $scope.show(2);
                    }, function (err) {
                        console.log(err);
                    })
            }
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CreateBusinessController', ["$scope", "httpService", "$http", "$uibModal", "$state", "prerenderService", CreateBusinessController])

    function CreateBusinessController($scope, httpService, $http, $uibModal, $state, prerenderService) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        $scope.business = {
            Name: '',
            BusinessCategoryId: '',
            Description: '',
            priceType: 'free',
            tickets: [],
            email: ''
        };
        $scope.alert = false;
        $scope.Address = '';
        $scope.addressList = [];
        $scope.businessCategoryList = [];
        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (response) {
                    $scope.addressList = response.data.results;
                });
        });

        // get all business category
        $scope.getBusinessCategory = function () {
            httpService.getData('BusinessCategories', '')
                .then(function (res) {
                    $scope.businessCategoryList = res;
                }
                , function (err) {
                    console.log(err);
                });
        }
        $scope.getBusinessCategory();

        $scope.pic = null;
        $scope.business.file = null;
        $scope.cropedPic = '';
        $scope.cropMsg = false;
        $scope.cropMsg1 = " ";

        // remove the picture that is choosen
        $scope.removePic = function () {
            $scope.pic = null;
            $scope.business.file = '';
            $scope.cropMsg = false;
        }

        // crop the picture and save it in business.file
        $scope.convertUrl = function ($dataURI) {
            $scope.cropMsg1 = true;
            $scope.cropMsg = false;
            $scope.business.file = $dataURI;
        }

        // check the image size is greater than 1 mb or not
        $scope.checkPic = function (pic) {
            if ((pic.size / 1048576) > 1.00) {
                $scope.business.file = null;
                $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
            } else {
                $scope.picErrMsg = ""
            }
            $scope.cropMsg = false;
            $scope.cropMsg1 = false;
        }

        // validate the email with regular expression
        $scope.validateEmail = function (email) {
            var re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            if (!re.test(email)) {
                $scope.emailAlert = true;
                $scope.emailAlertMsg = "Not a valid Email";
            } else {
                $scope.emailAlert = false;
            }
        }

        /*  create a business first and then with the business ID from response
            create a service with price,name,currency and businessID.
            after successfull creation a success modal is open
        */
        $scope.createBusiness = function (business) {

            for (var key in business) {
                if (business[key] === '') {
                    $scope.alert = true;
                    $scope.err_msg = "Business " + key + " is not Defined";
                    return;
                }
            }
            if (business.tickets.length > 0) {
                for (var i = 0; i < business.tickets.length; i++) {
                    delete business.tickets[i].$$hashKey;
                    if ((business.tickets[i].price === undefined) || (business.tickets[i].name === undefined)) {
                        $scope.alert = true;
                        $scope.err_msg = "Service Price is not Defined Properly";
                        return;
                    } else {
                        $scope.alert = false;
                    }
                }
            }
            if (business.file !== null) {
                var byteString = atob(business.file.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                business.file = new Blob([ab], { type: 'image/png' });
            }
            if ($scope.cropMsg1 === false) {
                $scope.alert = true;
                $scope.err_msg = "Picture should be cropped properly";
                return;
            }
            if ($scope.Address !== '') {
                business.Address = $scope.addressList[0].formatted_address;
                business.LocationLat = $scope.addressList[0].geometry.location.lat;
                business.LocationLong = $scope.addressList[0].geometry.location.lng;
            } else {
                $scope.alert = true;
                $scope.err_msg = "Business Address is not Defined";
                return;
            }
            business.AccountId = $scope.userInfo.userId;
            $scope.createBizPromise = httpService.postMultiData('Businesses/newBusiness', business, $scope.userInfo.id)
                .then(function (response) {
                    if (business.priceType === 'paid') {
                        for (var i = 0; i < business.tickets.length; i++) {
                            (function (i) {
                                var obj = {
                                    Price: business.tickets[i].price,
                                    Name: business.tickets[i].name,
                                    currency: business.tickets[i].currency,
                                    BusinessId: response.id
                                }
                                $scope.createBizPromise = httpService.postData(obj, 'services', $scope.userInfo)
                                    .then(function (data) {
                                       
                                    }, function (err) {
                                        console.log(err);
                                    })
                            })(i);
                        }
                    }
                    $scope.show(2);
                    var businessId = response.id;
                    var url = "http://www.even3app.com/" + $state.href('Main.Business.Detail.Info', { id: businessId });
                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'app/pages/business/templates/service-success-modal.html',
                        controller: 'ServiceSuccessModalController',
                        size: 'sm',
                        resolve: {
                            eventUrl: function () {
                                return url;
                            }
                        }
                    });

                    prerenderService.recache(businessId, 'business');
                });
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EditBusinessController', ["$scope", "httpService", "$stateParams", "$http", "$state", "prerenderService", EditBusinessController])

    function EditBusinessController($scope, httpService, $stateParams, $http, $state, prerenderService) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

        var id = $stateParams.id;
        $scope.business = {};
        $scope.showImageInput = false;
        $scope.showImage = false;
        $scope.OwnBusiness = false;
        $scope.alert = false;

        /* get business detail that are going to be edited */
        $scope.getBusinessDetail = function () {
            var filter = "?filter[where][id]=" + id + "&filter[include]=account" + "&filter[include]=services";
            httpService.getData('Businesses', filter, '')
                .then(function (response) {
                    if (response[0].AccountId === $scope.userInfo.userId) {
                        $scope.OwnBusiness = true;
                        $scope.business = response[0];
                        if ($scope.business.BusinessPicture === undefined) {
                            $scope.showImageInput = true;
                            $scope.showImage = false;
                        } else {
                            $scope.showImageInput = false;
                            $scope.showImage = true;
                        }
                        $scope.Address = $scope.business.Address;
                        if ($scope.business.services.length === 0) {
                            $scope.business.priceType = 'free';
                        } else {
                            $scope.business.priceType = 'paid';
                        }
                    } else {
                        $scope.OwnBusiness = false;
                    }
                })
        }
        $scope.getBusinessDetail();

        // get business category list
        $scope.getBusinessCategory = function () {
            httpService.getData('BusinessCategories', '')
                .then(function (res) {
                    $scope.businessCategoryList = res;
                }
                , function (err) {
                    console.log(err);
                });
        }
        $scope.getBusinessCategory();

        // watch address variable always. when a change is made it will execute instantly
        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (responce) {
                    $scope.addressList = responce.data.results;
                });
        });

        $scope.pic = null;
        $scope.business.file = null;
        $scope.croppedPic = '';

        $scope.removeImage = function () {
            $scope.showImageInput = true;
            $scope.showImage = false;
            $scope.business.BusinessPicture = '';
        }

        $scope.removePic = function () {
            $scope.pic = null;
            $scope.business.file = '';
        }

        // crop the image
        $scope.convertUrl = function (dataURI) {
            $scope.business.file = dataURI;
        }

        //check the image size
        $scope.checkPic = function (pic) {
            if ((pic.size / 1048576) > 1.00) {
                $scope.picErr = true;
                $scope.pic = null;
                $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
            } else {
                $scope.picErr = false;
                $scope.picErrMsg = ""
            }
        }

        // edit the business and save it 
        $scope.editBusiness = function () {
            if ($scope.OwnBusiness) {
                for (var key in $scope.business) {

                    if( key === 'BusinessPicture' && $scope.croppedPic !== ''){
                        continue;
                    }

                    if ($scope.business[key] === '' || $scope.business[key] === undefined) {
                        $scope.alert = true;
                        $scope.err_msg = "Business " + key + " is not Defined";
                        return;
                    }
                }
                $scope.alert = false;
                if ($scope.business.file !== undefined) {
                    var byteString = atob($scope.business.file.split(',')[1]);
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    $scope.business.file = new Blob([ab], { type: 'image/png' });
                }
                $scope.business.Id = id;
                $scope.business.Address = $scope.addressList[0].formatted_address;
                $scope.business.LocationLat = $scope.addressList[0].geometry.location.lat;
                $scope.business.LocationLong = $scope.addressList[0].geometry.location.lng;
                $scope.business.AccountId = $scope.userInfo.userId;

                $scope.editBizPromise = httpService.postMultiData('Businesses/editbusiness', $scope.business, $scope.userInfo.id)
                    .then(function (response) {
                        prerenderService.recache(response.id, 'business');
                        $state.go('Main.Profile.Service');
                    });
            }
        }

        // save service option. if the service is paid
        $scope.saveService = function (service, index) {
            if ($scope.OwnBusiness) {
                if (service.id === undefined) {
                    service.BusinessId = id;
                    if ((service.Name === undefined) || (service.Price === undefined)) {
                        alert("Fill Up All The Fields");
                    } else {
                        $scope.editBizTicketPromise = httpService.postData(service, 'services', $scope.userInfo.id);
                    }
                } else {
                    if ((service.Name === '') || (service.Price === '')) {
                        alert("Fill Up All The Fields");
                    } else {
                        $scope.editBizTicketPromise = httpService.putData(service, 'services', $scope.userInfo.id, service.id);
                    }
                }
            }
        }

        // delete service option
        $scope.deleteService = function (service, index) {
            if ($scope.OwnBusiness) {
                if (service.id === undefined) {
                    $scope.business.services.splice(index, 1);
                } else {
                    var r = confirm("Do You Really Want to Delete This?");
                    if (r) {
                        $scope.editBizTicketPromise = $scope.editBizPromise = httpService.deleteData('services', $scope.userInfo.id, service.id)
                            .then(function (res) {
                                $scope.business.services.splice(index, 1);
                            });
                    }
                }
            }
        }

    }
})();


(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ServiceSuccessModalController', ["$scope", "eventUrl", "httpService", "$uibModal", "$uibModalInstance", "$state", ServiceSuccessModalController]);

    function ServiceSuccessModalController($scope, eventUrl, httpService, $uibModal, $uibModalInstance, $state) {
        $scope.share = false;
        $scope.eventUrl = eventUrl;
        $scope.invite = function () {
            $scope.share = true;
        };

        $scope.services = function () {
            $state.go('Main.Search');
            $uibModalInstance.dismiss('cancel');
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CartController', ["$scope", "httpService", "$stateParams", "stripe", "shareData", "$state", CartController])

    function CartController($scope, httpService, $stateParams, stripe, shareData, $state) {

        stripe.setPublishableKey(shareData.testPublishableKey);

        $scope.ticketList = [];
        $scope.buyTicket = [];
        $scope.selectedCard = null;
        $scope.totalPrice = 0;
        $scope.ticketPrice = 0;
        $scope.quantity = 0;
        $scope.showCardError = false;
        $scope.showErr = false;
        var id = $stateParams.id;
        $scope.selectedcardNumber = '';

        /* find the tickets of an event */
        function getEventTickets() {
            var filter = '?filter[where][EventId]=' + id;
            $scope.paymentPromise = httpService.getData('Tickets', filter, $scope.userInfo.id)
                .then(function (response) {
                    if (response.length > 0) {
                        $scope.ticketList = response;
                        $scope.currency = $scope.ticketList[0].currency;
                        $scope.buyTicket = response;
                        for (var i = 0; i < $scope.ticketList.length; i++) {
                            $scope.ticketList.quantity = 0;
                            $scope.ticketList.total = 0;
                        }
                    }
                }, function (err) {
                    console.log(err);
                })
        }
        getEventTickets();

        /* find RSVP if the user is going or not going */
        function getRsvp() {
            var filter = "?filter[where][EventId]=" + id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
            $scope.paymentPromise = httpService.getData('Participants', filter, $scope.userInfo.id)
                .then(function (response) {
                    if (response.length > 0) {
                        $scope.rsvp = 1;
                        $scope.rsvpId = response[0].id;
                    } else {
                        $scope.rsvp = 0;
                    }
                }, function (err) {
                    console.log(err);
                });
        }
        getRsvp();

        /* get card list of the user that he saved for payment use */
        function getCardList() {
            var filter = '?filter[where][AccountId]=' + $scope.userInfo.userId;
            $scope.paymentPromise = httpService.getData('cards', filter, $scope.userInfo.id)
                .then(function (response) {
                    if (response.length > 0) {
                        $scope.cardList = response;
                    }
                }, function (err) {
                    console.log(err);
                })
        }
        getCardList();

        // select payment card for paying the ticket price
        $scope.selectCard = function (cardId) {
            for (var i = 0; i < $scope.cardList.length; i++) {
                if ($scope.cardList[i].id === cardId) {
                    $scope.selectedCard = $scope.cardList[i];
                    var len = $scope.selectedCard.Number.length;
                    $scope.selectedCardNumber = "***********" + $scope.selectedCard.Number[len - 2] + $scope.selectedCard.Number[len - 1];
                    $scope.selectedCard.ExpiryDate = $scope.selectedCard.ExpiryMonth + "/" + $scope.selectedCard.ExpiryYear;
                }
            }
        }
        // calculate price for ticket
        $scope.calculatePrice = function (index, obj) {
            if ($scope.ticketList[index].quantity > -1) {
                $scope.showErr = false;
                $scope.ticketList[index].total = $scope.ticketList[index].quantity * $scope.ticketList[index].Price;
                for (var i = 0; i < $scope.ticketList.length; i++) {
                    $scope.totalPrice = ($scope.ticketList[i].quantity * $scope.ticketList[i].Price);
                }
            } else {
                $scope.ticketList[index].quantity = 0;
                $scope.showErr = true;
            }
        }

        // when delete button is clicked ticket quantity field will be zero
        $scope.deleteTicket = function (index) {
            $scope.ticketList[index].quantity = 0;
            $scope.calculatePrice(index);
        }

        // pay the price of ticket using card
        $scope.pay = function (selectedCard) {
            if (selectedCard === null) {
                $scope.showCardError = true;
                $scope.cardErrMsg = "Please Select A card";
            } else {
                $scope.showCardError = false;
                if ($scope.totalPrice === 0) {
                    $scope.showCardError = true;
                    $scope.cardErrMsg = "Set Total Amount"
                } else {
                    $scope.showCardError = false;
                    var tempCard = {
                        number: selectedCard.Number,
                        cvc: selectedCard.Ccv,
                        exp_month: selectedCard.ExpiryMonth,
                        exp_year: selectedCard.ExpiryYear
                    }
                    if ((stripe.card.validateExpiry(tempCard.exp_month, tempCard.exp_year))
                        && (stripe.card.validateCardNumber(tempCard.number))
                        && (stripe.card.validateCVC(tempCard.cvc))) {
                        stripe.card.createToken(tempCard)
                            .then(function (response) {
                                $scope.token = response.id;
                                var payment = {
                                    amount: $scope.totalPrice,
                                    currency: $scope.currency,
                                    description: "Payment for Tickets of EventId " + id,
                                    isTest: true,
                                    stripeToken: $scope.token
                                }
                                $scope.paymentPromise = httpService.postData(payment, 'Cards/stripepayment', $scope.userInfo.id)
                                    .then(function (response) {
                                        if (response.statusText === 'OK') {
                                            var TransacId = response.data.payment;
                                            var timeToPurchase = response.data.created;
                                            for (var i = 0; i < $scope.ticketList.length; i++) {
                                                (function (i) {
                                                    if ($scope.ticketList[i].quantity !== 0) {
                                                        var transaction = {
                                                            Purchased: $scope.ticketList[i].quantity,
                                                            TransactionId: TransacId,
                                                            TimeOfTicket: timeToPurchase,
                                                            AccountId: $scope.userInfo.userId,
                                                            TicketId: $scope.ticketList[i].id,
                                                            EventId: id
                                                        }
                                                        $scope.paymentPromise = httpService.postData(transaction, 'TicketPurchases', $scope.userInfo.id)
                                                            .then(function (response) {
                                                                if (response.statusText === 'OK') {
                                                                    if ($scope.rsvp > 0) {
                                                                        var obj = {
                                                                            Rsvp: 2,
                                                                            EventId: id,
                                                                            AccountId: $scope.userInfo.userId
                                                                        }
                                                                        $scope.paymentPromise = httpService.putData(obj, 'Participants', $scope.userInfo.id, $scope.rsvpId)
                                                                            .then(function () {
                                                                                $state.go('Main.Profile.Ticket');
                                                                            });
                                                                    } else {
                                                                        var obj1 = {
                                                                            Rsvp: 2,
                                                                            EventId: id,
                                                                            AccountId: $scope.userInfo.userId
                                                                        }
                                                                        $scope.paymentPromise = httpService.postData(obj1, 'Participants', $scope.userInfo.id)
                                                                            .then(function () {
                                                                                $state.go('Main.Profile.Ticket');
                                                                            });
                                                                    }

                                                                }
                                                            }, function (err) {
                                                                console.log(err);
                                                            })
                                                    }
                                                })(i);
                                            }
                                        }
                                    }, function (err) {
                                        console.log(err);
                                    })
                            })
                    } else {
                        $scope.showCardError = true;
                        $scope.cardErrMsg = "Selected Card is not Valid, Please Select or Add a Valid Card";
                    }
                }

            }
        }

    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CropPicModalController', ["$scope", "pic", CropPicModalController]);
        
    function CropPicModalController($scope, pic) {
        $scope.picture = pic;
    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ForgotPasswordController', ["$scope", "$rootScope", "httpService", ForgotPasswordController]);
    function ForgotPasswordController($scope, $rootScope, httpService) {
        $scope.user = {};

        $scope.err = false;
        $scope.show = false;

        // execute when enter is pressed
        $scope.keyUp = function (keyEvent) {
            if (keyEvent.keyCode === 13) {
                $scope.resetPassword($scope.user);
            }
        };

        // send reset password link to specified email
        $scope.resetPassword = function () {
            if ($scope.user.email === undefined) {
                $scope.err = true;
                $scope.show = false;
            } else {
                $scope.err = false;
                httpService.postData($scope.user, 'Accounts/sendemail', '')
                    .then(function (res) {
                        $scope.messge = res.data.message;
                        $scope.show = true;
                        $scope.user.email = "";
                    },
                    function (err) {
                        console.log(err)
                    })
            }
        }

        $rootScope.$emit('changeFooterClass', 'footer-fixed');

        $scope.$on('$destroy', function () {
            $rootScope.$emit('changeFooterClass', '');
        });
    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('HeaderController', ["$scope", "$uibModal", "shareData", "$rootScope", "$state", HeaderController]);

    function HeaderController($scope, $uibModal, shareData, $rootScope, $state) {

        $scope.$state = $state;
        $scope.search = '';

        $scope.$on('login', function () {
            $state.go('Main.Home.Event');
        });

        $scope.searchFn = function (search) {
            shareData.setMessage($scope.search);
        };

        $scope.status = {
            isopen: false
        };

        $scope.toggleDropdown = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };

        $scope.logout = function () {
            $rootScope.$emit('logout');
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $scope.showMenu = false;
        });
    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('HireModalController', ["$scope", "business", "$uibModalInstance", HireModalController]);

    function HireModalController($scope, business, $uibModalInstance) {
        $scope.business = business;
        //$scope.hire = "mailto:"+ $scope.business.account.email + "?subject= New%20Hiring%20proposal%20from%20Even3";
        $scope.email = $scope.business.account.email;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('LoginSignupPopupController', ["$scope", "$rootScope", "$uibModalInstance", "httpService", "$http", "shareData", "$uibModal", "$state", "$localStorage", "action", LoginSignupPopupController])

    function LoginSignupPopupController($scope, $rootScope, $uibModalInstance, httpService, $http, shareData, $uibModal, $state, $localStorage, action) {
        $scope.user = {};
        var googleUserInfo = {};
        var baseurl = httpService.baseurl;
        $scope.accessToken = "";
        $scope.user = {};
        $scope.err = false;
        $scope.title = action === 'Main.Event.Create'? 'Create Event Quickly with' : 'Add Your Business Quickly with';
        $scope.close = close;
        
        $scope.goToLogin = function () {
             $uibModalInstance.close();;
        };

        $scope.goToSignup = function () {
            $uibModalInstance.dismiss('signup');
        };

        function apiClientLoaded() {
            gapi.client.plus.people.get({ userId: 'me' }).execute(handleResponse);
        }

        function handleResponse(resp) {
            googleUserInfo = resp;
            $scope.user.FirstName = googleUserInfo.name.givenName;
            $scope.user.LastName = googleUserInfo.name.familyName;
            $scope.user.email = googleUserInfo.emails[0].value;
            $scope.user.Type = 'Google';
            $scope.user.Id = googleUserInfo.id;

            $scope.loginPromise = $http({
                method: 'POST',
                url: baseurl + 'Accounts/socialsignin',
                data: JSON.stringify($scope.user)
            })
                .success(function (data) {
                    var obj = {};
                    obj.id = data.accessToken;
                    obj.userId = data.id;
                    shareData.setAccessToken(obj);
                    $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                })
                .error(function (err) {
                    console.log(err);
                })
        }
        // google login
        $scope.GoogleLogin = function () {
            $scope.$on('event:google-plus-signin-success', function (event, authResult) {
                $scope.user.Token = authResult.access_token;
                gapi.client.load('plus', 'v1', apiClientLoaded)
            });


        }
        // facebook login
        $scope.FBLogin = function () {

            FB.login(function (response) {
                var accessToken = response.authResponse.accessToken;
                if (response.status === 'connected') {
                    FB.api('/me', function (response) {
                        var obj = {};
                        obj.Type = 'FB';
                        obj.FirstName = response.first_name;
                        obj.LastName = response.last_name;
                        obj.email = response.email;
                        obj.Token = accessToken;
                        obj.Id = response.id;
                        $scope.loginPromise = $http({
                            method: 'POST',
                            url: baseurl + 'Accounts/socialsignin',
                            data: JSON.stringify(obj)
                        })
                            .success(function (data) {
                                var obj1 = {};
                                obj1.id = data.accessToken;
                                obj1.userId = data.id;
                                shareData.setAccessToken(obj1);
                                $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                            })
                            .error(function (err) {
                                //console.log(err);
                            })
                    });
                }
            }, { scope: 'public_profile,email' });

        }

        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            console.log("Google Signin Failure");
        });

        window.fbAsyncInit = function () {
            FB.init({
                appId: '1598513400364558',
                xfbml: true,
                version: 'v2.3'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        } (document, 'script', 'facebook-jssdk'));

        function close(){
            $uibModalInstance.dismiss();
        }

    }
})();
(function () {
    'use strict';
    angular.module('evenApp')
        .controller('MainController', ["$scope", "shareData", "$cookies", "$rootScope", "$uibModal", "httpService", "$state", "$localStorage", 'envData', MainController])

    function MainController($scope, shareData, $cookies, $rootScope, $uibModal, httpService, $state, $localStorage, envData) {
        $rootScope.returnToState = 'Main.Home.Event';
        $rootScope.returnToStateParams = '';
        $scope.footerClass = '';
        $scope.userInfo = $cookies.getObject('userInfo');
        $scope.loggedIn = $cookies.get('loggedIn');
        $localStorage.loginStatus = $scope.loggedIn;
        $scope.loginStats = $localStorage.loginStatus;
        $scope.$state = $state;
        //todo: update the base API url to be injected and environment specific
        // $scope.baseurl = "http://api.even3app.com/api";
        $scope.baseurl = envData.apiUrl;
        $scope.weburl = "http://www.even3app.com/";
        $scope.showData = 1;
        $scope.currencySymbolList = {
            'USD': '$',
            'EURO': '€',
            'GBP': '£',
            'NGN': '₦'
        };

        //this is for search view
        $scope.show = function (id) {

            $scope.showData = id;
            if (id === 2) {
                $state.go('Main.Search');
            }
        };

        if ($scope.loggedIn) {
            getAccountInfo();
        }

        $rootScope.$on('changeFooterClass', function (event, data) {
            $scope.footerClass = data;
        });

        //url restriction, 

        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            if (['Main.Profile'].indexOf(fromState.name) === -1 && ['Main.Profile'].indexOf(toState.name) === -1) {
                event.preventDefault();
                window.scrollTo(0, 0);
            }
        });
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (!$scope.loggedIn) {
                if (['Main.Login', 'Main.Signup'].indexOf(toState.name) === -1) {
                    $rootScope.returnToState = toState.name;
                    $rootScope.returnToStateParams = toParams ? toParams : {};
                }
                if (['Main.Signup', 'Main.Login', 'Main.Home.Event', 'Main.Event.Detail.Info', 'Main.Business.Detail.Info', 'Main.Search', 'Main.Signup.Success', 'Main.ForgotPassword', 'Main.HowItWorks'].indexOf(toState.name) === -1 && ['Main.Event.Create', 'Main.Business.Create'].indexOf(toState.name) === -1) {
                    event.preventDefault();
                    $state.go('Main.Login');
                    $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                } else if (['Main.Event.Create', 'Main.Business.Create'].indexOf(toState.name) !== -1) {
                    event.preventDefault();
                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'app/pages/common/templates/login-or-signin.html',
                        controller: 'LoginSignupPopupController',
                        resolve: {
                            action : function () {
                                return toState.name;
                            }
                        }
                    }).result.then(function (selectedItem) {
                        $state.go('Main.Login');
                    }, function (value) {
                        if (value === 'signup') $state.go('Main.Signup');
                    });
                }

            }
            if (toState.name.indexOf('Main.Profile') === -1 && fromState.name.indexOf('Main.Profile') !== -1) {
                $rootScope.tab = 'Info';
            }
        });

        function getAccountInfo() {
            httpService.getData("Accounts" + "/" + $scope.userInfo.userId, "", $scope.userInfo.id)
                .then(function (res) {
                    $scope.userAccInfo = res;
                },
                function (err) {
                    console.log(err);
                });
        }

        //can not have 2 accounts on same browser
        $scope.$watch(function () {
            return $localStorage.loginStatus;
        }, function (newVal) {
            if ((!newVal) && (newVal != undefined)) {
                logingOut();
            }
            if ((newVal) && ($scope.loggedIn === undefined)) {
                location.reload();
            }
        });

        //listen for login broadcasted by rootscope
        $scope.$on('login', function () {
            $scope.userInfo = shareData.getAccessToken();
            $scope.loggedIn = true;
            $cookies.put('loggedIn', true);
            $cookies.putObject('userInfo', $scope.userInfo);
            $localStorage.loginStatus = true;
            $scope.loginStats = $localStorage.loginStatus;
            getAccountInfo();
            //location.reload();
            $state.go($state.$current, null, { reload: true });
        });

        //listen for logout broadcasted by rootscope
        $rootScope.$on('logout', logingOut);

        function logingOut() {
            $scope.userInfo = {};
            $scope.loggedIn = false;
            $scope.userAccInfo = {};
            $cookies.remove('loggedIn');
            $cookies.remove('userInfo');
            $localStorage.loginStatus = false;
            $scope.loginStats = $localStorage.loginStatus;
            $state.go('Main.Home.Event');
            //location.reload();
            $state.go($state.$current, null, { reload: true });
        }

        /*function checkLogIn () {
            if ($scope.loggedIn) {
                if ($cookies.get('loggedIn') == undefined) {
                    logingOut();
                    //location.reload();
                }
            }
        }
        
        $interval(checkLogIn, 2000);*/

        /*following have shareModal and rsvpModal */
        $scope.openShareModal = function (url, title) {
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/socialShare.html',
                controller: 'SocialShareController',
                size: 'sm',
                resolve: {
                    eventUrl: function () {
                        return url;
                    },
                    eventTitle: function () {
                        return title;
                    }
                }
            });
        };

        $scope.openRsvpModal = function (obj, id) {
            if ($scope.loggedIn) {
                $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'app/pages/common/templates/rsvp.html',
                    controller: 'RsvpModalController',
                    //size: 'lg',
                    resolve: {
                        event: function () {
                            return obj;
                        },
                        userInfo: function () {
                            return $scope.userInfo
                        }
                    }
                });
            } else {
                $state.go('Main.Login');
            }
        }

    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('MapController', ["$scope", MapController]);
        
    function MapController($scope) {
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('RsvpModalController', ["$scope", "event", "httpService", "$uibModalInstance", "userInfo", "shareData", "$state", RsvpModalController])

    function RsvpModalController($scope, event, httpService, $uibModalInstance, userInfo, shareData, $state) {
        $scope.event = event;
        $scope.rsvpList = [];
        $scope.showMsg = false;
        $scope.going = false;
        $scope.ignore = false;
        if ($scope.event.RsvpValue === "Ignore") {
            $scope.going = false;
            $scope.ignore = true;
            $scope.prevPost = true;
        } else if ($scope.event.RsvpValue === "Going") {
            $scope.going = true;
            $scope.ignore = false;
            $scope.prevPost = true;
        } else {
            $scope.prevPost = false;
        }

        $scope.setRSVP = function (state) {

            if (state === 1) {
                $scope.going = false;
                $scope.ignore = true;
            } else {
                $scope.going = true;
                $scope.ignore = false;
            }
            var obj = {};
            obj.Invited = false;
            obj.Rsvp = state;
            obj.EventId = $scope.event.id;
            obj.AccountId = userInfo.userId;
            if ($scope.event.tickets.length === 0) {
                if (!$scope.prevPost) {
                    $scope.rsvpPromise = httpService.postData(obj, 'Participants', userInfo.id)
                        .then(function () {
                            $scope.showMsg = true;
                        });
                } else {
                    $scope.rsvpPromise = httpService.putData(obj, 'Participants', userInfo.id, $scope.event.RsvpId)
                        .then(function () {
                            $scope.showMsg = true;
                        });
                }
            } else {
                if (state === 2) {
                    $uibModalInstance.dismiss('cancel');
                    $state.go('Main.Event.Detail.Cart', { id: $scope.event.id });
                } else {
                    if (!$scope.prevPost) {
                        $scope.rsvpPromise = httpService.postData(obj, 'Participants', userInfo.id)
                            .then(function () {
                                $scope.showMsg = true;
                            });
                    } else {
                        $scope.rsvpPromise = httpService.putData(obj, 'Participants', userInfo.id, $scope.event.RsvpId)
                            .then(function () {
                                $scope.showMsg = true;
                            });
                    }
                }
            }

        }

        $scope.cancel = function () {
            $state.go($state.$current, null, { reload: true });
            $uibModalInstance.dismiss('cancel');
        };

    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SocialShareController', ["$scope", "eventUrl", "eventTitle", "$uibModalInstance", SocialShareController])
        
    function SocialShareController($scope, eventUrl, eventTitle, $uibModalInstance) {
        $scope.eventUrl = eventUrl;

        $scope.title = eventTitle;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('errSrc', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('error', function () {
                        if (attrs.src != attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }
                    });
                    attrs.$observe('ngSrc', function (value) {
                        if (!value && attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }
                    });

                }
            };
        });
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function () {
                        scope.$apply(function () {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]);
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('mAppLoading', ['$animate', function ($animate) {
            return {
                restrict: 'C',
                link: function (scope, element, attrs) {
                    $animate.leave(element.children().eq(1)).then(
                        function cleanupAfterAnimation() {
                            element.remove();
                            scope = element = attrs = null;
                        }
                    );
                }
            };
        }]);
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('setHeight', ['$window', function ($window) {
            return {
                link: function (scope, element, attrs) {
                    scope.getElementDimensions = function () {
                        return {
                            'h': element[0].clientHeight,
                            'w': element[0].clientWidth
                        };
                    };

                    scope.$watch(scope.getElementDimensions, function (newValue, oldValue) {
                        scope.setStyle = function () {
                            return (newValue.w * 385 / 850) + 'px';
                        };

                    }, true);

                    element.bind('setHeight', function () {
                        scope.$apply();
                    });
                }
            };
        }]);
})();
(function () {
  'use strict';
  angular
    .module('evenApp')
    .directive('sideNav', function () {
      var controller = ["$scope", '$rootScope', "$state", function ($scope, $rootScope, $state) {
        if (!$rootScope.tab) {
          var tabName = $state.current.name.split('.');
          $rootScope.tab = tabName[2];
        }
        $scope.tabState = $rootScope.tab;
        $scope.isActive = function (viewLocation) {
          return $state.current.name === viewLocation;
        };
        $scope.goToState = function () {
          var stateName = 'Main.Profile.' + $scope.tabState;
          $rootScope.tab = $scope.tabState;
          $state.go('Main.Profile.' + $scope.tabState);
        }
      }];

      return {
        templateUrl: 'views/side-nav.html',
        restrict: 'E',
        controller: controller

      };
    });

})();

(function () {
    'use strict';
    angular.module('evenApp')
        .provider('envService', [function () {
            this.environment = 'development';
            this.data = {};

            this.config = function (config) {
                this.data = config;
            };

            this.set = function (environment) {
                this.environment = environment;
            };

            this.get = function () {
                return this.environment;
            };

            this.read = function (variable) {
                if (variable !== 'all') {
                    return this.data.vars[this.get()][variable];
                }

                return this.data.vars[this.get()];
            };

            this.is = function (environment) {
                return (environment === this.environment);
            };

            this.check = function () {
                var location = window.location.href,
                    self = this;

                angular.forEach(this.data.domains, function (v, k) {
                    angular.forEach(v, function (v) {
                        if (location.indexOf(v) >= 0) {
                            self.environment = k;
                        }
                    });
                });
            };

            this.$get = function () {
                return this;
            };

        }]);
})();

(function () {
    'use strict';
    angular.module('evenApp')
        .service('httpService', ["$http", "envData", function ($http, envData) {
            var http = {};
            var tempList = [];
            var baseurl = envData.apiUrl;
            //var baseurl = "http://localhost:3000/api/";
            http.baseurl = baseurl;
            http.getData = function (model, filter, auth) {
                return $http({
                    method: "GET",
                    url: baseurl + model + filter,
                    headers: {
                        'Authorization': auth
                    }
                }).then(function (responce) {
                    tempList = responce.data;
                    return tempList;
                }
                    , function (err) {
                        //console.log(err);
                    });
            };

            http.postData = function (obj, model, auth) {
                return $http({
                    method: "POST",
                    url: baseurl + model,
                    data: JSON.stringify(obj),
                    headers: {
                        'Authorization': auth
                    }
                }).then(function (response) {
                    return response;
                },
                    function (err) {
                        console.log(err);
                        return err;
                    });
            };

            http.postMultiData = function (Upurl, data, auth) {
                var fd = new FormData();
                for (var key in data) {
                    fd.append(key, data[key]);
                }
                var url = baseurl + Upurl;
                return $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': auth
                    }
                }).then(function (responce) {
                    return responce.data;
                },
                    function (err) {
                        console.log(err);
                    });
            };

            http.putData = function (obj, model, auth, filter) {
                return $http({
                    method: "PUT",
                    url: baseurl + model + "/" + filter,
                    data: JSON.stringify(obj),
                    headers: {
                        'Authorization': auth
                    }
                }).then(function (response) {
                    return response.data;
                }
                    , function (err) {
                        //console.log(err);
                        return err;
                    });
            };

            http.putMultiData = function (model, data, auth, id) {
                var fd = new FormData();
                for (var key in data) {
                    fd.append(key, data[key]);
                }
                var url = baseurl + model + "/" + id;
                return $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': auth
                    }
                }).then(function (responce) {
                    
                },
                    function (err) {
                        console.log(err);
                    });
            };

            http.deleteData = function (model, auth, id) {
                return $http({
                    method: "DELETE",
                    url: baseurl + model + "/" + id,
                    headers: {
                        'Authorization': auth
                    }
                }).then(function (data) {
                    return data;
                }
                    , function (err) {
                        return err;
                    })
            };

            return http;
        }]);
})();

(function () {
    'use strict';

    angular.module('evenApp')
        .service('prerenderService', prerenderService);

    prerenderService.$inject = ['$http', 'envData'];

    function prerenderService($http, envData) {
        var baseUrl = envData.apiUrl;
        var service = {
            recache : recache
        };

        return service;

        function recache (id, type){
        var sendData = {
            id: id,
            type: type
        };

        return $http.get('/recache', {params: sendData})
            .then(function(response){
                return response;
            })
        }
    }
})();
(function () {
    'use strict';
    angular.module('evenApp')
        .factory('shareData', ["$rootScope", function ($rootScope) {
            var data = {};
            data.userInfo = {};
            data.eventList = [];
            data.eventDetail = {};
            data.message = '';
            data.rsvpObj = {};

            data.testPublishableKey = "pk_test_P2jvqRsGBCekrhYItngejV3a";
            data.livePublishableKey = "pk_live_CQH2eIg98BWYBr8MXxUZgfZj";

            data.setRsvpObj = function (val) {
                data.rsvpObj = val;
                $rootScope.$broadcast('rsvpSet');
            };

            data.getRsvpObj = function () {
                return data.rsvpObj;
            };

            data.setMessage = function (val) {
                data.message = val;
                $rootScope.$broadcast('search_name');
            };

            data.getMessage = function () {
                return data.message;
            };

            data.setAccessToken = function (val) {
                for (var key in val) {
                    data.userInfo[key] = val[key];
                }
                $rootScope.$broadcast('login');
            };

            data.getAccessToken = function () {
                return data.userInfo;
            };

            data.setEvent = function (arr) {
                data.eventList = arr;
                $rootScope.$broadcast('search');
            };

            data.getEvent = function () {
                return data.eventList;
            };

            data.setUserInfo = function (obj) {
                data.userInfo = obj;
            };

            data.getUserInfo = function () {
                return data.userInfo;
            };

            return data;
        }]);
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CreateEventController', ["$scope", "httpService", "$http", "shareData", "$mdpTimePicker", "$uibModal", "$state", "prerenderService", CreateEventController])

    function CreateEventController($scope, httpService, $http, shareData, $mdpTimePicker, $uibModal, $state, prerenderService) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCuPr_PsYccfO9CDnEflllkcFcbMurXRUg&q=&address=';

        $scope.alert = false;
        $scope.err_msg = "";
        $scope.alertTime1 = false;
        $scope.alertTime2 = false;
        $scope.picErr = false;
        $scope.emailAlert = false;
        $scope.time_msg1 = "";
        $scope.time_msg2 = "";
        var dt = new Date();
        var currDate = dt.getDate();
        var currMonth = dt.getMonth();
        var currYear = dt.getFullYear();
        $scope.dateError1 = false;
        $scope.dateError2 = false;
        $scope.StartDate = '';
        $scope.EndDate = '';
        $scope.event = {
            priceType: 'free',
            tickets: [],
            status: 'public',
            StartDate: '',
            EndDate: '',
            Name: '',
            Description: '',
            EventCategoryId: '',
            email: '',
            Phone: '',
            Website: ''
        };
        $scope.Address = '';
        $scope.location = {};

        // get event categories 
        $scope.getEventCategory = function () {
            httpService.getData('EventCategories', '')
                .then(function (res) {
                    $scope.eventCategoryList = res;
                }
                , function (err) {
                    console.log(err);
                })
        }
        $scope.getEventCategory();

        // watch address variable always
        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (response) {
                    $scope.addressList = response.data.results;
                })
        })

        // check start date . if start date is previus then the current date show error
        $scope.checkDate1 = function (date) {
            var timeStamp = new Date(date).toISOString();
            $scope.event.StartDate = new Date(timeStamp).getTime();
            var eventDate = new Date($scope.event.StartDate).getDate();
            var eventMonth = new Date($scope.event.StartDate).getMonth();
            var eventYear = new Date($scope.event.StartDate).getFullYear();
            if (eventYear < currYear) {
                $scope.dateError1 = true;
                $scope.StartDate = '';
                return
            } else if (eventYear === currYear) {
                if (eventMonth < currMonth) {
                    $scope.dateError1 = true;
                    $scope.StartDate = '';
                    return
                } else if (eventMonth === currMonth) {
                    if (eventDate < currDate) {
                        $scope.dateError1 = true;
                        $scope.StartDate = '';
                        return
                    } else {
                        $scope.dateError1 = false;
                    }
                } else {
                    $scope.dateError1 = false;
                }
            } else {
                $scope.dateError1 = false;
            }
        }
        /* check finish date and show error when below condition is not satisfied*/
        $scope.checkDate2 = function (date) {
            var timeStamp = new Date(date).toISOString();
            $scope.event.EndDate = new Date(timeStamp).getTime();
            var eventDate = new Date($scope.event.StartDate).getDate();
            var eventMonth = new Date($scope.event.StartDate).getMonth();
            var eventYear = new Date($scope.event.StartDate).getFullYear();
            var endDate = new Date($scope.event.EndDate).getDate();
            var endMonth = new Date($scope.event.EndDate).getMonth();
            var endYear = new Date($scope.event.EndDate).getFullYear();
            if ($scope.StartDate === '') {
                $scope.dateError2 = true;
                $scope.date_err_msg = "Choose Event Start Date First";
                $scope.EndDate = '';
                return;
            }
            if (endYear < eventYear) {
                $scope.dateError2 = true;
                $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                $scope.EndDate = '';
                return;
            } else if (endYear === eventYear) {
                if (endMonth < eventMonth) {
                    $scope.dateError2 = true;
                    $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                    $scope.EndDate = '';
                    return;
                } else if (endMonth === eventMonth) {
                    if (endDate < eventDate) {
                        $scope.dateError2 = true;
                        $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                        $scope.EndDate = '';
                        return;
                    } else {
                        $scope.dateError2 = false;
                        return;
                    }
                } else {
                    $scope.dateError2 = false;
                    return;
                }
            } else {
                $scope.dateError2 = false;
                return;
            }
        }

        /* watch StartTime always if any change has occurred in startTime this will execute*/
        $scope.$watch('StartTime', function () {
            if ($scope.StartTime !== undefined) {
                if ($scope.StartDate !== '') {
                    $scope.event.StartDate += $scope.StartTime.getHours() * 3600 * 1000 + $scope.StartTime.getMinutes() * 60 * 1000 + $scope.StartTime.getSeconds() * 1000;
                    $scope.alertTime1 = false;
                    $scope.time_msg1 = "";
                } else {
                    $scope.alertTime1 = true;
                    $scope.time_msg1 = "Set Event Start Date First";
                    $scope.StartTime = "";
                }
            }
        })

        /* check finish time. if finish time is earlier then start time or start date
         show error
         */
        $scope.checkTime2 = function () {
            if ($scope.EndDate !== "") {
                if ($scope.StartTime !== undefined) {
                    var startHour = $scope.StartTime.getHours();
                    var startMinute = $scope.StartTime.getMinutes();
                    var endHour = $scope.EndTime.getHours();
                    var endMinute = $scope.EndTime.getMinutes();
                    if (endHour < startHour) {
                        $scope.alertTime2 = true;
                        $scope.time_msg2 = "Check Your Start Time and End Time";
                        $scope.EndTime = "";
                        return;
                    } else if (endHour === startHour) {
                        if (endMinute < startMinute) {
                            $scope.alertTime2 = true;
                            $scope.time_msg2 = "Check Your Start Time and End Time";
                            $scope.EndTime = "";
                            return;
                        } else {
                            $scope.alertTime2 = false;
                            $scope.event.EndDate += $scope.EndTime.getHours() * 3600 * 1000 + $scope.EndTime.getMinutes() * 60 * 1000 + $scope.EndTime.getSeconds() * 1000;
                            return;
                        }
                    } else {
                        $scope.event.EndDate += $scope.EndTime.getHours() * 3600 * 1000 + $scope.EndTime.getMinutes() * 60 * 1000 + $scope.EndTime.getSeconds() * 1000;
                        $scope.alertTime2 = false;
                        return;
                    }
                } else {
                    $scope.alertTime2 = true;
                    $scope.time_msg2 = "Set Event Start Time First";
                    $scope.EndTime = "";
                    return;
                }
            } else {
                $scope.alertTime2 = true;
                $scope.time_msg2 = "Set Event Finish Date First";
                $scope.EndTime = "";
                return;
            }
        }

        $scope.pic = null;
        $scope.croppedPic = null;
        $scope.crop = '';

        // remove the picture/image
        $scope.removePic = function () {
            $scope.pic = null;
            $scope.event.file = '';
        }

        // check image size
        $scope.checkPic = function (pic) {
            if ((pic.size / 1048576) > 1.00) {
                $scope.picErr = true;
                $scope.pic = null;
                $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
            } else {
                $scope.picErr = false;
                $scope.picErrMsg = ""
            }
        }

        // validate the email by using regular expression
        $scope.validateEmail = function (email) {
            var re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            if (!re.test(email)) {
                $scope.emailAlert = true;
                $scope.emailAlertMsg = "Not a valid Email";
            } else {
                $scope.emailAlert = false;
            }
        }

        /* create the event.check if any field is null or not. after successfull
         creation open a success modal from which event can be shared
         */
        $scope.createEvent = function (event) {
            for (var key in event) {
                if (event[key] === '') {
                    if ((key === 'Phone') || (key === 'Website') || (key === 'email')) {
                        continue;
                    } else {
                        $scope.alert = true;
                        $scope.err_msg = "Event " + key + " is not Defined";
                        return;
                    }
                }
            }

            if (event.tickets.length > 0) {
                for (var i = 0; i < event.tickets.length; i++) {
                    delete event.tickets[i].$$hashKey;
                    if ((event.tickets[i].price === undefined) || (event.tickets[i].currency === undefined) || (event.tickets[i].available === undefined)) {
                        $scope.alert = true;
                        $scope.err_msg = "Ticket is not Defined Properly";
                        return;
                    } else {
                        $scope.alert = false;
                    }
                }
            }
            if ($scope.croppedPic !== null) {
                var byteString = atob($scope.croppedPic.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                event.file = new Blob([ab], { type: 'image/png' });
            }
            event.AccountId = $scope.userInfo.userId;
            if ($scope.Address !== '') {
                event.Address = $scope.addressList[0].formatted_address;
                event.LocationLat = $scope.addressList[0].geometry.location.lat;
                event.LocationLong = $scope.addressList[0].geometry.location.lng;
            } else {
                $scope.alert = true;
                $scope.err_msg = "Event Address is not Defined";
                return;
            }
            
            $scope.createEventPromise = httpService.postMultiData('Events/newEvent', event, $scope.userInfo.id)
                .then(function (response) {
                    if (event.priceType === 'paid') {
                        for (var i = 0; i < event.tickets.length; i++) {
                            (function (i) {
                                var obj = {
                                    Price: event.tickets[i].price,
                                    currency: event.tickets[i].currency,
                                    Available: event.tickets[i].available,
                                    SoldTicket: 0,
                                    EventId: response.id
                                };
                                httpService.postData(obj, 'Tickets', $scope.userInfo)
                                    .then(function (data) {
                                        
                                    })
                            })(i);
                        }
                    }
                    $scope.show(2);
                    var eventId = response.id;
                    var url = "http://www.even3app.com/" + $state.href('Main.Event.Detail.Info', { id: eventId });

                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'app/pages/event/templates/event-success-modal.html',
                        controller: 'EventSuccessModalController',
                        size: 'sm',
                        resolve: {
                            eventUrl: function () {
                                return url;
                            }
                        }
                    });

                     prerenderService.recache(eventId, 'event');
                });
        }
                 
        
    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EditEventController', ["$scope", "$state", "httpService", "$stateParams", "$http", "prerenderService", EditEventController])

    function EditEventController($scope, $state, httpService, $stateParams, $http, prerenderService) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCuPr_PsYccfO9CDnEflllkcFcbMurXRUg&q=&address=';

        var id = $stateParams.id;
        $scope.event = {};
        var dt = new Date();
        var currDate = dt.getDate();
        var currMonth = dt.getMonth();
        var currYear = dt.getFullYear();
        $scope.showImageInput = false;
        $scope.showImage = false;
        $scope.OwnBusiness = false;

        // check startdate
        $scope.checkDate1 = function (date) {
            var timeStamp = new Date(date).toISOString();
            $scope.event.StartDate = new Date(timeStamp).getTime();
            var eventDate = new Date($scope.event.StartDate).getDate();
            var eventMonth = new Date($scope.event.StartDate).getMonth();
            var eventYear = new Date($scope.event.StartDate).getFullYear();
            if (eventYear < currYear) {
                $scope.dateError1 = true;
                $scope.StartDate = '';
                return
            } else if (eventYear === currYear) {
                if (eventMonth < currMonth) {
                    $scope.dateError1 = true;
                    $scope.StartDate = '';
                    return
                } else if (eventMonth === currMonth) {
                    if (eventDate < currDate) {
                        $scope.dateError1 = true;
                        $scope.StartDate = '';
                        return
                    } else {
                        $scope.dateError1 = false;
                    }
                } else {
                    $scope.dateError1 = false;
                }
            } else {
                $scope.dateError1 = false;
            }
        }

        // check finish date     
        $scope.checkDate2 = function (date) {
            var timeStamp = new Date(date).toISOString();
            $scope.event.EndDate = new Date(timeStamp).getTime();
            var eventDate = new Date($scope.event.StartDate).getDate();
            var eventMonth = new Date($scope.event.StartDate).getMonth();
            var eventYear = new Date($scope.event.StartDate).getFullYear();
            var endDate = new Date($scope.event.EndDate).getDate();
            var endMonth = new Date($scope.event.EndDate).getMonth();
            var endYear = new Date($scope.event.EndDate).getFullYear();
            if ($scope.StartDate === '') {
                $scope.dateError2 = true;
                $scope.date_err_msg = "Choose Event Start Date First";
                $scope.EndDate = '';
                return;
            }
            if (endYear < eventYear) {
                $scope.dateError2 = true;
                $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                $scope.EndDate = '';
                return;
            } else if (endYear === eventYear) {
                if (endMonth < eventMonth) {
                    $scope.dateError2 = true;
                    $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                    $scope.EndDate = '';
                    return;
                } else if (endMonth === eventMonth) {
                    if (endDate < eventDate) {
                        $scope.dateError2 = true;
                        $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                        $scope.EndDate = '';
                        return;
                    } else {
                        $scope.dateError2 = false;
                        return;
                    }
                } else {
                    $scope.dateError2 = false;
                    return;
                }
            } else {
                $scope.dateError2 = false;
                return;
            }
        }

        // check start time
        $scope.checkTime1 = function () {
            if ($scope.StartTime !== undefined) {
                if ($scope.StartDate !== '') {
                    $scope.event.StartDate += $scope.StartTime.getHours() * 3600 * 1000 + $scope.StartTime.getMinutes() * 60 * 1000 + $scope.StartTime.getSeconds() * 1000;
                    $scope.alertTime1 = false;
                    $scope.time_msg1 = "";
                } else {
                    $scope.alertTime1 = true;
                    $scope.time_msg1 = "Set Event Start Date First";
                    $scope.StartTime = "";
                }
            }
        }

        // check finish time
        $scope.checkTime2 = function () {
            if ($scope.EndDate !== "") {
                if ($scope.StartTime !== undefined) {
                    var startHour = $scope.StartTime.getHours();
                    var startMinute = $scope.StartTime.getMinutes();
                    var endHour = $scope.EndTime.getHours();
                    var endMinute = $scope.EndTime.getMinutes();
                    if (endHour < startHour) {
                        $scope.alertTime2 = true;
                        $scope.time_msg2 = "Check Your Start Time and End Time";
                        $scope.EndTime = "";
                        return;
                    } else if (endHour === startHour) {
                        if (endMinute < startMinute) {
                            $scope.alertTime2 = true;
                            $scope.time_msg2 = "Check Your Start Time and End Time";
                            $scope.EndTime = "";
                            return;
                        } else {
                            $scope.alertTime2 = false;
                            $scope.event.EndDate += $scope.EndTime.getHours() * 3600 * 1000 + $scope.EndTime.getMinutes() * 60 * 1000 + $scope.EndTime.getSeconds() * 1000;
                            return;
                        }
                    } else {
                        $scope.event.EndDate += $scope.EndTime.getHours() * 3600 * 1000 + $scope.EndTime.getMinutes() * 60 * 1000 + $scope.EndTime.getSeconds() * 1000;
                        $scope.alertTime2 = false;
                        return;
                    }
                } else {
                    $scope.alertTime2 = true;
                    $scope.time_msg2 = "Set Event Start Time First";
                    $scope.EndTime = "";
                    return;
                }
            } else {
                $scope.alertTime2 = true;
                $scope.time_msg2 = "Set Event Finish Date First";
                $scope.EndTime = "";
                return;
            }
        }

        $scope.pic = null;
        $scope.event.file = null;
        $scope.croppedPic = '';

        // remove image
        $scope.removeImage = function () {
            $scope.showImageInput = true;
            $scope.showImage = false;
            $scope.event.EventPicture = '';
        }

        // remove image
        $scope.removePic = function () {
            $scope.pic = null;
            $scope.croppedPic = '';
        }


        // check the image size
        $scope.checkPic = function (pic) {
            if ((pic.size / 1048576) > 1.00) {
                $scope.picErr = true;
                $scope.pic = null;
                $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
            } else {
                $scope.picErr = false;
                $scope.picErrMsg = ""
            }
        }

        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        function getDateTime(StartDate, EndDate) {
            StartDate = new Date(StartDate);
            EndDate = new Date(EndDate);
            var startDay = StartDate.getDate();
            var startMonth = StartDate.getMonth();
            var startYear = StartDate.getFullYear();
            var endDay = EndDate.getDate();
            var endMonth = EndDate.getMonth();
            var endYear = EndDate.getFullYear();
            $scope.StartDate = month[startMonth] + "-" + startDay + "-" + startYear;
            $scope.EndDate = month[endMonth] + "-" + endDay + "-" + endYear;
            $scope.StartTime = StartDate;
            $scope.EndTime = EndDate;
        }

        // get the event detail that are going to be edited
        $scope.getEventDetail = function () {
            var filter = "?filter[where][id]=" + id + "&filter[include]=tickets" + "&filter[include]=account";
            httpService.getData('Events', filter, '')
                .then(function (response) {
                    if (response[0].AccountId === $scope.userInfo.userId) {
                        $scope.OwnBusiness = true;
                        $scope.event = response[0];
                        if ($scope.event.EventPicture === undefined) {
                            $scope.showImageInput = true;
                            $scope.showImage = false;
                        } else {
                            $scope.showImageInput = false;
                            $scope.showImage = true;
                        }
                        getDateTime($scope.event.StartDate, $scope.event.EndDate);
                        $scope.Address = $scope.event.Address;
                        if ($scope.event.EventPicture !== undefined) {
                            //generateBlob($scope.baseurl + $scope.event.EventPicture);
                        }
                        if ($scope.event.tickets.length === 0) {
                            $scope.event.priceType = 'free';
                        } else {
                            $scope.event.priceType = 'paid';
                        }
                    } else {
                        $scope.OwnBusiness = false;
                    }
                },
                function (err) {
                    console.log(err);
                })
        }
        $scope.getEventDetail();

        // get event categories
        $scope.getEventCategory = function () {
            httpService.getData('EventCategories', '')
                .then(function (res) {
                    $scope.eventCategoryList = res;
                }
                , function (err) {
                    console.log(err);
                })
        }
        $scope.getEventCategory();

        // watch address variable always.if any change is made this will execute instantly
        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (responce) {
                    $scope.addressList = responce.data.results;
                })
        });

        // edit the event and save it
        $scope.editEvent = function () {
           // debugger;
            if ($scope.OwnBusiness) {
                $scope.event.Id = id;
                $scope.event.AccountId = $scope.userInfo.userId;
                if ($scope.Address !== '') {
                    $scope.event.Address = $scope.addressList[0].formatted_address;
                    $scope.event.LocationLat = $scope.addressList[0].geometry.location.lat;
                    $scope.event.LocationLong = $scope.addressList[0].geometry.location.lng;
                }
                else {
                    $scope.alert = true;
                    $scope.err_msg = "Event Address is not Defined";
                    return;
                }

                for (var key in $scope.event) {
                    if ($scope.event[key] === '') {
                        if ((key === 'Phone') || (key === 'Website') || (key === 'email') || ( key === 'file') || (key === 'EventPicture')) {
                            continue;
                        }
                        
                            $scope.alert = true;
                            $scope.err_msg = "Event " + key + " is not Defined";
                        
                        return;
                    }
                }
                delete $scope.event.$$hashKey;

                if ($scope.croppedPic !== '') {
                    var byteString = atob($scope.croppedPic.split(',')[1]);
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    $scope.event.file = new Blob([ab], { type: 'image/png' });
                }

                httpService.postMultiData('Events/editevent', $scope.event, $scope.userInfo.id)
                    .then(function (response) {
                        prerenderService.recache(response.id, 'event');
                        $state.go('Main.Profile.Event');
                    }, function (err) {
                        console.log(err);
                    });
            }
        }

        // save ticket price and availability
        $scope.saveTicket = function (ticket, index) {
            if ($scope.OwnBusiness) {
                if (ticket.id === undefined) {
                    ticket.EventId = id;
                    if ((ticket.Price === undefined) || (ticket.currency === undefined) || (ticket.Available === undefined)) {
                        alert("undefined Fill Up All The Fields");
                    } else {
                        delete ticket.$$hashKey;
                        httpService.postData(ticket, 'Tickets', $scope.userInfo.id);
                    }
                } else {
                    if ((ticket.Price === '') || (ticket.currency === '') || (ticket.Available === '')) {
                        alert("defined Fill Up All The Fields");
                    } else {
                        delete ticket.$$hashKey;
                        httpService.putData(ticket, 'Tickets', $scope.userInfo.id, ticket.id);
                    }
                }
            }
        }

        // delete ticket price and availability option
        $scope.deleteTicket = function (ticket, index) {
            if ($scope.OwnBusiness) {
                if (ticket.id === undefined) {
                    $scope.event.tickets.splice(index, 1);
                } else {
                    var r = confirm("Do You Really Want to Delete This?");
                    if (r) {
                        httpService.deleteData('Tickets', $scope.userInfo.id, ticket.id);
                        $scope.event.tickets.splice(index, 1);
                    }
                }
            }
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EventDetailController', ["$scope", "$stateParams", "httpService", "$interval", "$http", "$sce", "$state", "$uibModal", EventDetailController])

    function EventDetailController($scope, $stateParams, httpService, $interval, $http, $sce, $state, $uibModal) {
        var WEATHER_URL = "https://api.forecast.io/forecast/095db319e3486519e02c46e2b596cc81/";
        var geoUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCuPr_PsYccfO9CDnEflllkcFcbMurXRUg&q=";
        $scope.eventDetail = {};
        $scope.weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.commentList = [];
        $scope.CommentBody = "";
        $scope.user = {};
        $scope.weather = {};
        $scope.showRSVP = true;
        var d = new Date();
        var id = $stateParams.id;
        $scope.eventId = id;

        /* get event detail */
        $scope.getEventDetail = function () {
            var filter = "?filter[where][id]=" + id + "&filter[include]=account" + "&filter[include]=tickets";

            $scope.eventDetailPromise = httpService.getData('Events', filter)
                .then(function (res) {
                    $scope.eventDetail = res[0];
                    if ($scope.eventDetail.tickets.length > 0) {
                        for (var i = 0; i < $scope.eventDetail.tickets.length; i++) {
                            $scope.eventDetail.tickets[i].currencySymbol = $scope.currencySymbolList[$scope.eventDetail.tickets[i].currency];
                        }
                    }
                    $scope.geoSrc = $sce.trustAsResourceUrl(geoUrl + $scope.eventDetail.Address);
                    if ($scope.loggedIn) {
                        if ($scope.eventDetail.AccountId === $scope.userInfo.userId) {
                            $scope.showRSVP = false;
                            $scope.ownEvent = true;
                        } else {
                            $scope.ownEvent = false;
                            getRSVP();
                        }
                    }
                    if ($scope.eventDetail.StartDate < d.getTime()) {
                        $scope.showRSVP = false;
                    }
                    $scope.map = {
                        center: {
                            latitude: $scope.eventDetail.Location.lat,
                            longitude: $scope.eventDetail.Location.lng
                        },
                        zoom: 8
                    };
                    $scope.marker = {
                        id: 0,
                        coords: {
                            latitude: $scope.eventDetail.Location.lat,
                            longitude: $scope.eventDetail.Location.lng
                        }
                    };
                    var dd = Math.floor(d.getTime() / 1000);
                    $http({
                        method: "jsonp",
                        url: WEATHER_URL + $scope.eventDetail.Location.lat + "," + $scope.eventDetail.Location.lng + "," + dd,
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        },
                        params: {
                            format: 'jsonp',
                            callback: 'JSON_CALLBACK'
                        }
                    })
                        .then(function (res) {
                            $scope.weather = res.data;
                            $scope.weatherIcon = "images/weather/" + $scope.weather.currently.icon + ".jpg";
                            $scope.temperature = (($scope.weather.currently.temperature - 32) / 1.8);

                        },
                        function (err) {
                            console.log(err);
                        })
                }
                , function (err) {
                    console.log(err);
                })
        }
        $scope.getEventDetail();

        /* get all comments in the event */
        function getComments() {
            var filter = "?filter[include]=account" + "&filter[where][EventId]=" + id;
            httpService.getData("EventComments", filter, "")
                .then(function (res) {
                    $scope.commentList = res;
                }
                , function (err) {
                    console.log(err);
                })
        }

        /* get the new comment */
        function getNewComments() {
            var filter = "?filter[include]=account" + "&filter[where][EventId]=" + id;
            httpService.getData("EventComments", filter, "")
                .then(function (res) {
                    if (res.length !== $scope.commentList.length) {
                        $scope.commentList = res;
                    }
                }
                , function (err) {
                    console.log(err);
                })
        }
        getComments();
        var commentPromice = $interval(getNewComments, 2000);
        $scope.$on("$destroy", function () {
            if (commentPromice) {
                $interval.cancel(commentPromice);
            }
        });

        // add a comment
        $scope.addComment = function (comment) {
            if (comment.length === 0) {
                alert('Can not post EMPTY Comment');
            }
            else {
                $scope.CommentBody = "";
                var obj = {};
                obj.Time = new Date().getTime();
                obj.CommentBody = comment;
                obj.EventId = id;
                obj.Id = $scope.userInfo.userId;
                httpService.postMultiData('EventComments/addcomment', obj, $scope.userInfo.id);
            }
        }

        $scope.going = false;
        $scope.ignore = false;

        // get rsvp for participants
        function getRSVP() {
            $scope.showRSVP = true;
            var filter = "?filter[where][EventId]=" + id + "&filter[where][AccountId]=" + $scope.userInfo.userId;

            httpService.getData('Participants', filter, $scope.userInfo.id)
                .then(function (res) {
                    $scope.rsvpList = res;
                    if ($scope.rsvpList.length > 0) {
                        if ($scope.rsvpList[0].Rsvp === 1) {
                            $scope.going = false;
                            $scope.ignore = true;
                        }
                        else if ($scope.rsvpList[0].Rsvp === 2) {
                            $scope.going = true;
                            $scope.ignore = false;
                        }
                    }
                },
                function (err) {
                    console.log(err);
                })
        }

        // set rsvp for participants
        $scope.setRSVP = function (state) {
            if ($scope.loggedIn) {
                var filter = "?filter[where][EventId]=" + id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
                httpService.getData('Participants', filter, $scope.userInfo.id)
                    .then(function (res) {
                        $scope.rsvpList = res;
                    })
                if (state === 1) {
                    $scope.going = false;
                    $scope.ignore = true;
                } else {
                    $scope.going = true;
                    $scope.ignore = false;
                }
                var obj = {};
                obj.Invited = false;
                obj.Rsvp = state;
                obj.EventId = id;
                obj.AccountId = $scope.userAccInfo.id;
                if ($scope.eventDetail.tickets.length === 0) {
                    if ($scope.rsvpList.length === 0) {
                        $scope.rsvpPromise = httpService.postData(obj, 'Participants', $scope.userInfo.id);
                    } else {
                        $scope.rsvpPromise = httpService.putData(obj, 'Participants', $scope.userInfo.id, $scope.rsvpList[0].id);
                    }
                } else {
                    if (state === 2) {
                        $state.go('Main.Event.Detail.Cart', { id: id });
                    } else {
                        if ($scope.rsvpList.length === 0) {
                            $scope.rsvpPromise = httpService.postData(obj, 'Participants', $scope.userInfo.id);
                        } else {
                            $scope.rsvpPromise = httpService.putData(obj, 'Participants', $scope.userInfo.id, $scope.rsvpList[0].id)
                                .then(function (response) {
                                    
                                });
                        }
                    }
                }
            } else {
                $state.go('Main.Login');
            }
        }

        // delete the entire event
        $scope.deleteEvent = function () {
            var cnfrm = confirm("Are you Sure to Delete your Event?");
            if (cnfrm) {
                httpService.deleteData('Events', $scope.userInfo.id, id)
                    .then(function (response) {
                        $state.go('Main.Search');
                    }, function (err) {
                        console.log(err);
                    })
            }
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EventSuccessModalController', ["$scope", "eventUrl", "httpService", "$uibModal", "$uibModalInstance", "$state", EventSuccessModalController]);

    function EventSuccessModalController($scope, eventUrl, httpService, $uibModal, $uibModalInstance, $state) {
        $scope.share = false;
        $scope.eventUrl = eventUrl;
        $scope.invite = function () {
            $scope.share = true;
        };

        // go back to search 
        $scope.services = function () {
            $state.go('Main.Search');
            $uibModalInstance.dismiss('cancel');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('BusinessController', ["$scope", "$state", "httpService", "$uibModal", BusinessController])

    function BusinessController($scope, $state, httpService, $uibModal) {
        $scope.businessList = [];
        $scope.businessIdList = [];
        $scope.beg = 0;
        $scope.end = 4;
        $scope.items = [1, 2, 3, 4, 5];

        /* find rating of the services */
        function getRating(arr) {
            var filter = "?filter[where][BusinessId]=";
            for (var i = 0; i < arr.length; i++) {
                (function (i) {
                    $scope.businessPromise = httpService.getData('ratings', filter + arr[i], '')
                        .then(function (data) {
                            $scope.rateArr = data;
                            if ($scope.rateArr.length === 0 || $scope.rateArr === undefined) {
                                $scope.businessList[i].ratingNum = 0;
                            } else {
                                var total = $scope.rateArr.reduce(function (prev, curr) {
                                    return prev + curr.value;
                                }, 0);
                                $scope.businessList[i].ratingNum = Math.floor(total / ($scope.rateArr.length))
                            }
                        },
                        function (err) {
                            console.log(err);
                        })
                })(i)
            }
        }
        /* find saved business */
        function getSaveBusiness() {
            for (var i = 0; i < $scope.businessList.length; i++) {
                (function (i) {
                    var filter = "?filter[where][BusinessId]=" + $scope.businessList[i].id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
                    $scope.businessPromise = httpService.getData('savedBusinesses', filter, $scope.userInfo.id)
                        .then(function (data) {
                            if (data.length > 0) {
                                $scope.businessList[i].buttonValue = 'SAVED';
                                $scope.businessList[i].buttonDisabled = true;
                            }
                        },
                        function (err) {
                            //console.log(err);
                        });
                })(i)
            }
        }

        /* find all business */
        $scope.getBusinessList = function () {
            var date = new Date().getTime();
            var filter = "?filter[include]=account"
            $scope.businessPromise = httpService.getData("Businesses", filter)
                .then(function (data) {
                    $scope.businessList =  shuffleArray(data);
                    for (var i = 0; i < $scope.businessList.length; i++) {
                        $scope.businessList[i].buttonValue = 'SAVE';
                        $scope.businessList[i].buttonDisabled = false;
                        if ($scope.loggedIn) {
                            if ($scope.businessList[i].AccountId === $scope.userInfo.userId) {
                                $scope.businessList[i].ownBusiness = true;
                            } else {
                                $scope.businessList[i].ownBusiness = false;
                            }
                        }
                    }
                    $scope.businessIdList = $scope.businessList.map(function (obj) {
                        return obj.id;
                    });
                    getRating($scope.businessIdList);
                    if ($scope.loggedIn) {
                        getSaveBusiness();
                    }

                });
        }
        $scope.getBusinessList();

        /* save a business when save button is clicked */
        $scope.saveBussiness = function (id) {
            if (!$scope.loggedIn) {                         // logged in or not
                $state.go('Main.Login');
            } else {
                if (!$scope.businessList[id].ownBusiness) {
                    if (!$scope.businessList[id].buttonDisabled) {
                        var obj = {
                            BusinessId: $scope.businessList[id].id,
                            AccountId: $scope.userInfo.userId,
                        }

                        $scope.saveBusinessPromise = httpService.postData(obj, 'savedBusinesses', $scope.userInfo.id)
                            .then(function () {
                                $scope.businessList[id].buttonValue = "SAVED";
                                $scope.businessList[id].buttonDisabled = true;
                            });
                    }
                }
            }
        }

       function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CarouselController', ["$scope", "$rootScope", "$state", "$timeout", "httpService", CarouselController]);

    function CarouselController($scope, $rootScope, $state, $timeout, httpService) {
        $scope.goToCategory = goToCategory;
        $scope.slides;
        var _categories = [];
        httpService.getData('EventCategories', "")
            .then(function (categories) {
                _categories = categories;
                $scope.slides = [
                    {
                        image: "/images/popular-category/tile-2.png",
                        text: 'Bachelorette party',
                        id: getCategoryId('Bachelorette party')
                    },
                    {
                        image: "images/popular-category/tile-1.png",
                        text: 'Birthday Party',
                        id: getCategoryId('Birthday')
                    },
                    {
                        image: "images/popular-category/tile-6.png",
                        text: 'Family Reunion',
                        id: getCategoryId('Family reunion')
                    },
                    {
                        image: "images/popular-category/tile-5.png",
                        text: 'Wedding',
                        id: getCategoryId('Wedding')
                    },
                    {
                        image: "images/popular-category/tile-3.png",
                        text: 'Barbecue',
                        id: getCategoryId('BBQ')
                    },
                    {
                        image: "images/popular-category/tile-4.png",
                        text: 'Meetup',
                        id: getCategoryId('Meet up')
                    },
                    {
                        image: "images/event_category.png",
                        text: 'Other',
                        id: getCategoryId('Other')
                    }
                ];
            });


        function getCategoryId(text) {
            return _categories.find(function(value) {
                return value.Name.includes(text);
            }).id;
        }

        function goToCategory(category) {
            $timeout(function () {
                $rootScope.$emit('getCategory', category);
            }, 1000)
            $state.go('Main.Search');
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EventController', ["$scope", "$state", "httpService", "$route", "shareData", EventController]);

    function EventController($scope, $state, httpService, $route, shareData) {
        $scope.$state = $state;
        var eventData = [];
        var sortedEventData = [];
        var date = new Date().getTime();
        $scope.eventList = [];
        $scope.beg = 0;
        $scope.end = 4;

        // get RSVP list 
        function getRsvpList() {
            for (var i = 0; i < $scope.eventList.length; i++) {
                var filter = "?filter[where][EventId]=" + $scope.eventList[i].id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
                (function (i) {
                    $scope.eventPromise = httpService.getData('Participants', filter, $scope.userInfo.id)
                        .then(function (response) {
                            if (response.length > 0) {
                                var tempObj = response[0];
                                if (tempObj.Rsvp === 2) {
                                    $scope.eventList[i].RsvpValue = "Going";
                                    $scope.eventList[i].RsvpId = tempObj.id;
                                }
                                if (tempObj.Rsvp === 1) {
                                    $scope.eventList[i].RsvpValue = "Ignore";
                                    $scope.eventList[i].RsvpId = tempObj.id;
                                }
                            }
                        })
                })(i);
            }
        }
        // find all events
        $scope.getEventList = function (sort) {
            var filter = "?filter[include]=account" + "&filter[where][StartDate][gt]=" + date + "&filter[where][status]=public" + "&filter[include]=tickets";
            $scope.eventPromise = httpService.getData("Events", filter)
                .then(function (data) {
                    var currentData = data.filter(function(event, index) {
                        if (index < 4) return event;
                    });
                    if (sort) $scope.eventList =  currentData.sort(sortByDate);
                    else $scope.eventList =  currentData;

                    for (var i = 0; i < $scope.eventList.length; i++) {
                        $scope.eventList[i].RsvpValue = "RSVP";
                        if ($scope.eventList[i].tickets.length > 0) {
                            var currency = $scope.eventList[i].tickets[0].currency;
                            $scope.eventList[i].currencySymbol = $scope.currencySymbolList[currency];
                        }
                    }
                    if ($scope.loggedIn) {
                        getRsvpList();
                    }
                }
                , function (err) {
                    console.log(err);
                });
        }
        $scope.getEventList(true);

        // load more events when Load more button is clicked 
        $scope.$on('search', function () {
            $scope.eventList = [];
            $scope.eventList = shareData.getEvent();
            for (var i = 0; i < $scope.eventList.length; i++) {
                $scope.eventList[i].RsvpValue = "RSVP";
                if ($scope.eventList[i].tickets.length > 0) {
                    var currency = $scope.eventList[i].tickets[0].currency;
                    $scope.eventList[i].currencySymbol = $scope.currencySymbolList[currency];
                }
            }
            if ($scope.loggedIn) {
                getRsvpList();
            }
        });

        function sortByDate(a, b) {
            var aDate = a.StartDate - date;
            var bDate = b.StartDate - date;
            if (aDate < bDate) return -1;
            if (aDate > bDate) return 1;

            return 0;
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('HowItWorksController', ["$scope", "$rootScope", HowItWorksController]);

    function HowItWorksController($scope, $rootScope) {
    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('LoginModalController', ["$scope", "$rootScope", "httpService", "$http", "shareData", "$state", "$localStorage", LoginModalController])

    function LoginModalController($scope, $rootScope, httpService, $http, shareData, $state, $localStorage) {
        $scope.user = {};
        var googleUserInfo = {};
        var baseurl = httpService.baseurl;
        $scope.accessToken = "";
        $scope.user = {};
        $scope.err = false;

        $scope.keyUp = function (keyEvent) {
            if (keyEvent.keyCode === 13) {
                $scope.login($scope.user);
            }
        }

        $scope.goToLogin = function () {
            $uibModalInstance.close();
        };

        $scope.goToSignup = function () {
            $uibModalInstance.dismiss('signup');
        };

        // login user
        $scope.login = function (user) {
            $scope.err = false;
            $scope.loginPromise = $http({
                method: "POST",
                url: baseurl + "Accounts/login",
                data: JSON.stringify(user)
            })
                .success(function (data) {
                    shareData.setAccessToken(data);
                    $state.go($rootScope.returnToState, $rootScope.returnToStateParams);

                })
                .error(function (error) {
                    $scope.err = true;
                    $scope.errMsg = "Check Your Email and Password."
                })
        }


        $scope.goto = function (state) {
            $state.go(state);
        }

        function apiClientLoaded() {
            gapi.client.plus.people.get({ userId: 'me' }).execute(handleResponse);
        }

        function handleResponse(resp) {
            googleUserInfo = resp;
            $scope.user.FirstName = googleUserInfo.name.givenName;
            $scope.user.LastName = googleUserInfo.name.familyName;
            $scope.user.email = googleUserInfo.emails[0].value;
            $scope.user.Type = 'Google';
            $scope.user.Id = googleUserInfo.id;

            $scope.loginPromise = $http({
                method: 'POST',
                url: baseurl + 'Accounts/socialsignin',
                data: JSON.stringify($scope.user)
            })
                .success(function (data) {
                    var obj = {};
                    obj.id = data.accessToken;
                    obj.userId = data.id;
                    shareData.setAccessToken(obj);
                    $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                })
                .error(function (err) {
                    console.log(err);
                })
        }
        // google login
        $scope.GoogleLogin = function () {
            $scope.$on('event:google-plus-signin-success', function (event, authResult) {
                $scope.user.Token = authResult.access_token;
                gapi.client.load('plus', 'v1', apiClientLoaded)
            });


        }
        // facebook login
        $scope.FBLogin = function () {

            FB.login(function (response) {
                var accessToken = response.authResponse.accessToken;
                if (response.status === 'connected') {
                    FB.api('/me', function (response) {
                        var obj = {};
                        obj.Type = 'FB';
                        obj.FirstName = response.first_name;
                        obj.LastName = response.last_name;
                        obj.email = response.email;
                        obj.Token = accessToken;
                        obj.Id = response.id;
                        $scope.loginPromise = $http({
                            method: 'POST',
                            url: baseurl + 'Accounts/socialsignin',
                            data: JSON.stringify(obj)
                        })
                            .success(function (data) {
                                var obj1 = {};
                                obj1.id = data.accessToken;
                                obj1.userId = data.id;
                                shareData.setAccessToken(obj1);
                                $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                            })
                            .error(function (err) {
                                //console.log(err);
                            })
                    });
                }
            }, { scope: 'public_profile,email' });

        }

        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            console.log("Google Signin Failure");
        });

        window.fbAsyncInit = function () {
            FB.init({
                appId: '1598513400364558',
                xfbml: true,
                version: 'v2.3'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        } (document, 'script', 'facebook-jssdk'));

    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('NewsLetterController', ["$scope", "httpService", "$timeout", "$uibModal", NewsLetterController]);

    function NewsLetterController($scope, httpService, $timeout, $uibModal) {

        $scope.showMsg = false;

        // subscribe for news letter
        $scope.subscribe = function () {
            if ($scope.email !== undefined) {
                var obj = {
                    email: $scope.email
                };
                $scope.nwlPromise = httpService.postData(obj, 'subscribers', '')
                    .then(function (response) {
                        $scope.email = undefined;
                        $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'views/SuccessModal.html',
                            controller: 'SuccessModalController'
                        });
                    },
                    function (err) {
                        console.log(err);
                    })
            }
        };

        function hideMsg() {
            $scope.showMsg = false;
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SearchController', ["$scope", "$rootScope", "httpService", "$http", "shareData", "$uibModal", "$state", SearchController])

    function SearchController($scope, $rootScope, httpService, $http, shareData, $uibModal, $state) {
        $scope.Name = '';
        $scope.Address = '';
        $scope.addressList = [];
        $scope.markers = [];
        $scope.events = [];
        $scope.businesses = [];
        $scope.eventList = [];
        $scope.businessList = [];
        $scope.eventCategoryList = [];
        $scope.businessCategoryList = [];
        $scope.tickets = [];
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        $scope.beg = 0;
        $scope.end = 6;
        $scope.items = [1, 2, 3, 4, 5];
        var date = new Date().getTime();

        $rootScope.$on('getCategory', function (event, categoryId) {
            httpService.getData('EventCategories', "")
                .then(function (list) {
                    $scope.eventCategoryList = list;

                    $scope.EventCategoryId = categoryId;
                    $scope.eventCatId = $scope.EventCategoryId;
                    $scope.filterResult();
                }
                , function (error) {
                    console.log(error);
                })
        });

        $scope.$on('$destroy', function () {
            $rootScope.$emit('changeFooterClass', '');
        });

        // get map for Lagos
        function getMap(lat, lng) {
            $scope.map = {
                center: {
                    latitude: lat,
                    longitude: lng
                },
                zoom: 13
            };
        }

        // get map markers
        function getMarkers(obj) {
            $scope.markers = [];
            for (var i = 0; i < obj.length; i++) {
                var temp = {
                    latitude: obj[i].Location.lat,
                    longitude: obj[i].Location.lng,
                    "id": i
                }
                $scope.markers.push(temp);
            }
        }

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var R = 6371; // metres
            var φ1 = deg2rad(lat1);
            var φ2 = deg2rad(lat2);
            var Δφ = deg2rad(lat2 - lat1);
            var Δλ = deg2rad(lon2 - lon1);

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var d = R * c;
            return d;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }

        function getRsvpList() {
            for (var i = 0; i < $scope.eventList.length; i++) {
                var filter = "?filter[where][EventId]=" + $scope.eventList[i].id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
                (function (i) {
                    $scope.eventPromise = httpService.getData('Participants', filter, $scope.userInfo.id)
                        .then(function (response) {
                            if (response.length > 0) {
                                var tempObj = response[0];
                                if (tempObj.Rsvp === 2) {
                                    $scope.eventList[i].RsvpValue = "Going";
                                    $scope.eventList[i].RsvpId = tempObj.id;
                                }
                                if (tempObj.Rsvp === 1) {
                                    $scope.eventList[i].RsvpValue = "Ignore";
                                    $scope.eventList[i].RsvpId = tempObj.id;
                                }
                            } else {
                                $scope.eventList[i].RsvpValue = "RSVP";
                                $scope.eventList[i].RsvpId = '';
                            }
                        })
                })(i);
            }
        }

        // get all event list
        $scope.getEventList = function (name) {
            $scope.end = 4;
            var filter = "?filter[include]=account" + "&filter[where][StartDate][gt]=" + date + "&filter[where][status]=public" + "&filter[include]=tickets";
            if (name !== undefined) {
                filter = '?filter={"where":{"Name":{"like":"' + name + '","options":"i"}}}';
            }
            $scope.eventPromise = httpService.getData("Events", filter, "")
                .then(function (data) {
                    $scope.events = data;
                    $scope.eventList = [];
                    $scope.eventList = $scope.events;
                    if ($scope.eventList.length) {
                        $rootScope.$emit('changeFooterClass', '');
                    }
                    for (var i = 0; i < $scope.eventList.length; i++) {
                        $scope.tickets.push($scope.eventList[i].tickets);
                        $scope.eventList[i].RsvpValue = "RSVP";
                        if ($scope.eventList[i].tickets.length > 0) {
                            var currency = $scope.eventList[i].tickets[0].currency;
                            $scope.eventList[i].currencySymbol = $scope.currencySymbolList[currency];
                        }
                    }

                    if ($scope.showData === 1) {
                        getMap($scope.eventList[0].Location.lat, $scope.eventList[0].Location.lng);
                        getMarkers($scope.eventList);
                    }
                    if ($scope.loggedIn) {
                        getRsvpList();
                    }
                },
                function (err) {
                    console.log(err);
                });
        }
        $scope.getEventList();

        // get rating of the business
        function getRating(arr) {
            var filter = "?filter[where][BusinessId]="
            for (var i = 0; i < arr.length; i++) {
                (function (i) {
                    $scope.businessPromise = httpService.getData('ratings', filter + arr[i], '')
                        .then(function (data) {
                            $scope.rateArr = data;
                            if ($scope.rateArr.length === 0 || $scope.rateArr === undefined) {
                                $scope.businessList[i].ratingNum = 0;
                            } else {
                                var total = $scope.rateArr.reduce(function (prev, curr) {
                                    return prev + curr.value;
                                }, 0);
                                $scope.businessList[i].ratingNum = Math.floor(total / ($scope.rateArr.length))
                            }
                        },
                        function (err) {
                            console.log(err);
                        })
                })(i)
            }
        }

        // get saved business for an user
        function getSaveBusiness() {
            for (var i = 0; i < $scope.businessList.length; i++) {
                (function (i) {
                    var filter = "?filter[where][BusinessId]=" + $scope.businessList[i].id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
                    $scope.businessPromise = httpService.getData('savedBusinesses', filter, $scope.userInfo.id)
                        .then(function (data) {
                            if (data.length > 0) {
                                $scope.businessList[i].buttonValue = 'SAVED';
                                $scope.businessList[i].buttonDisabled = true;
                            }
                        },
                        function (err) {
                            console.log(err);
                        });
                })(i)
            }
        }

        // save a business
        $scope.saveBussiness = function (id) {
            if (!$scope.loggedIn) {
                $state.go('Main.Login');
            } else {
                if (!$scope.businessList[id].buttonDisabled) {
                    var obj = {
                        BusinessId: $scope.businessList[id].id,
                        AccountId: $scope.userInfo.userId,
                    }

                    $scope.saveBusinessPromise = httpService.postData(obj, 'savedBusinesses', $scope.userInfo.id)
                        .then(function () {
                            $scope.businessList[id].buttonValue = "SAVED";
                            $scope.businessList[id].buttonDisabled = true;
                        });
                }
            }
        }

        // get business list
        $scope.getBusinessList = function (name) {
            $scope.end = 4;
            var filter = "?filter[include]=account" + "&filter[include]=services";
            if (name !== undefined) {
                filter = '&filter={"where":{"Name":{"like":"' + name + '","options":"i"}}}';
            }
            $scope.businessPromise = httpService.getData("Businesses", filter)
                .then(function (data) {
                    $scope.businesses = data;
                    $scope.businessList = [];
                    for (var key in $scope.businesses) {
                        $scope.businessList[key] = $scope.businesses[key];
                    }
                    if ($scope.showData === 2) {
                        getMap($scope.businessList[0].Location.lat, $scope.businessList[0].Location.lng);
                        getMarkers($scope.businessList);
                    }
                    $scope.businessIdList = $scope.businessList.map(function (obj) {
                        return obj.id;
                    });
                    for (var i = 0; i < $scope.businessList.length; i++) {
                        $scope.businessList[i].buttonValue = 'SAVE';
                        $scope.businessList[i].buttonDisabled = false;
                        if ($scope.loggedIn) {
                            if ($scope.businessList[i].AccountId === $scope.userInfo.userId) {
                                $scope.businessList[i].ownBusiness = true;
                            } else {
                                $scope.businessList[i].ownBusiness = false;
                            }
                        }
                    }
                    getRating($scope.businessIdList);
                    if ($scope.loggedIn) {
                        getSaveBusiness();
                    }
                });
        }
        $scope.getBusinessList();

        $scope.getEventCategory = function () {
            httpService.getData('EventCategories', "")
                .then(function (data) {
                    $scope.eventCategoryList = data;
                }
                , function (error) {
                    console.log(error);
                })
        }
        $scope.getEventCategory();

        $scope.getBusinessCategory = function () {
            httpService.getData('BusinessCategories', '')
                .then(function (res) {
                    $scope.businessCategoryList = res;
                }
                , function (err) {
                    console.log(err);
                });
        }
        $scope.getBusinessCategory();

        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (responce) {
                    $scope.addressList = responce.data.results;
                    $scope.currAddr = responce.data.results[0];
                    if ($scope.showData === 1) {
                        $scope.filterResult();
                    }
                    if ($scope.showData === 2) {
                        $scope.filterResult2();
                    }

                });
        });

        $scope.$watch('showData', function () {
            $scope.markers = [];
            if ($scope.showData === 1) {
                if ($scope.eventList.length > 0) {
                    getMap($scope.eventList[0].Location.lat, $scope.eventList[0].Location.lng);
                    getMarkers($scope.eventList);
                    $scope.currentCategory = getCurrentCategory();
                    $rootScope.$emit('changeFooterClass', '');
                } else {
                    $scope.currentCategory = getCurrentCategory();
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                }
            }
            if ($scope.showData === 2) {
                if ($scope.businessList.length > 0) {
                    getMap($scope.businessList[0].Location.lat, $scope.businessList[0].Location.lng);
                    getMarkers($scope.businessList);
                    $rootScope.$emit('changeFooterClass', '');
                    $scope.currentCategory = getCurrentCategory();
                } else {
                    $scope.currentCategory = getCurrentCategory();
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                }
            }
        })

        $scope.$on('search_name', function () {
            var name = shareData.getMessage();
            $scope.getEventList(name);
            $scope.getBusinessList(name);
        });

        $scope.filterResult = function () {
            $scope.eventList = [];
            var tempArr = [];
            if ($scope.eventCatId !== undefined) {
                tempArr = $scope.events.filter(function (obj) {
                    return (obj.EventCategoryId === $scope.eventCatId) ? true : false;
                });
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.eventList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if ($scope.setDate !== undefined) {
                var dt = new Date($scope.setDate).getTime();
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        return (isHappeningSameDay(dt, obj.StartDate)) ? true : false;
                    })
                } else {
                    tempArr = $scope.events.filter(function (obj) {
                        return (isHappeningSameDay(dt, obj.StartDate)) ? true : false;
                    })
                }
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.eventList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if ($scope.price !== undefined) {
                var temp2Arr = [];
                if (tempArr.length > 0) {
                    for (var i = 0; i < tempArr.length; i++) {
                        if (tempArr[i].tickets.length > 0) {
                            for (var j = 0; j < tempArr[i].tickets.length; j++) {
                                var currTicket = tempArr[i].tickets[j];
                                if (currTicket.Price <= $scope.price) {
                                    temp2Arr.push(tempArr[i]);
                                    break;
                                }
                            }
                        } else {
                            temp2Arr.push(tempArr[i]);
                        }
                    }
                    tempArr = temp2Arr;
                } else {
                    for (var i = 0; i < $scope.events.length; i++) {
                        if ($scope.events[i].tickets.length > 0) {
                            for (var j = 0; j < $scope.events[i].tickets.length; j++) {
                                var currTicket1 = $scope.events[i].tickets[j];
                                if (currTicket1.Price <= $scope.price) {
                                    tempArr.push($scope.events[i]);
                                    break;
                                }
                            }
                        } else {
                            tempArr.push($scope.events[i]);
                        }
                    }
                }
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.eventList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }
            if (($scope.addressList.length > 0) && ($scope.currAddr !== undefined)) {
                var qlat = $scope.currAddr.geometry.location.lat;
                var qlng = $scope.currAddr.geometry.location.lng;
                $scope.map = {
                    center: {
                        latitude: qlat,
                        longitude: qlng
                    },
                    zoom: 10
                };
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        var dis = getDistanceFromLatLonInKm(qlat, qlng, obj.Location.lat, obj.Location.lng);
                        return (dis <= 50.00) ? true : false;
                    });
                } else {
                    tempArr = $scope.events.filter(function (obj) {
                        var dis = getDistanceFromLatLonInKm(qlat, qlng, obj.Location.lat, obj.Location.lng);
                        return (dis <= 50.00) ? true : false;
                    });
                }
            }
            $scope.eventList = tempArr;
            $scope.currentCategory = getCurrentCategory();
            getMarkers($scope.eventList);
        }

        function getCurrentCategory() {
            if ($scope.showData === 1) {
                return $scope.eventCategoryList.find(function (element, index, array) {
                    if (element.id == $scope.eventCatId) {
                        $scope.EventCategoryId = element.id;
                        return true;
                    }
                    return element.id == $scope.eventCatId;
                });
            } else {
                return $scope.businessCategoryList.find(function (element, index, array) {
                    if (element.id == $scope.bizCatId) {
                        $scope.BusinessCategoryId = element.id;
                        return true;
                    }
                    return element.id == $scope.bizCatId;
                });
            }
        }

        $scope.filterResult2 = function () {
            $scope.businessList = [];
            var tempArr = [];
            if ($scope.bizCatId !== undefined) {
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        return (obj.BusinessCategoryId === $scope.bizCatId) ? true : false;
                    });
                } else {
                    tempArr = $scope.businesses.filter(function (obj) {
                        return (obj.BusinessCategoryId === $scope.bizCatId) ? true : false;
                    });
                }

                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.businessList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if ($scope.setDate !== undefined) {
                var dt = $scope.setDate.getTime();
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        return (isHappeningSameDay(dt, obj.StartDate)) ? true : false;
                    })
                } else {
                    tempArr = $scope.businesses.filter(function (obj) {
                        return (isHappeningSameDay(dt, obj.StartDate)) ? true : false;
                    })
                }
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.businessList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if ($scope.price !== undefined) {
                var temp2Arr = [];
                if (tempArr.length > 0) {
                    for (var i = 0; i < tempArr.length; i++) {
                        if (tempArr[i].services.length > 0) {
                            for (var j = 0; j < tempArr[i].services.length; j++) {
                                var currService = tempArr[i].services[j];
                                if (currService.Price <= $scope.price) {
                                    temp2Arr.push(tempArr[i]);
                                    break;
                                }
                            }
                        } else {
                            temp2Arr.push(tempArr[i]);
                        }
                    }
                    tempArr = [];
                    tempArr = temp2Arr;
                } else {
                    for (var i = 0; i < $scope.businesses.length; i++) {
                        if ($scope.businesses[i].services.length > 0) {
                            for (var j = 0; j < $scope.businesses[i].services.length; j++) {
                                var currService1 = $scope.businesses[i].services[j];
                                if (currService1.Price <= $scope.price) {
                                    tempArr.push($scope.businesses[i]);
                                    break;
                                }
                            }
                        } else {
                            tempArr.push($scope.businesses[i]);
                        }
                    }
                }
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.businessList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if (($scope.addressList.length > 0) && ($scope.currAddr !== undefined)) {
                var qlat = $scope.currAddr.geometry.location.lat;
                var qlng = $scope.currAddr.geometry.location.lng;
                $scope.map = {
                    center: {
                        latitude: qlat,
                        longitude: qlng
                    },
                    zoom: 10
                };
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        var dis = getDistanceFromLatLonInKm(qlat, qlng, obj.Location.lat, obj.Location.lng);
                        return (dis <= 50.00) ? true : false;
                    });
                } else {
                    tempArr = $scope.businesses.filter(function (obj) {
                        var dis = getDistanceFromLatLonInKm(qlat, qlng, obj.Location.lat, obj.Location.lng);
                        return (dis <= 50.00) ? true : false;
                    });
                }
            }
            $scope.businessList = tempArr;
            $scope.currentCategory = getCurrentCategory();
            getMarkers($scope.businessList);
        }

        var isHappeningSameDay = function (queryDate, eventDate) {
            var qdate = new Date(queryDate).setHours(0, 0, 0, 0);
            var edate = new Date(eventDate).setHours(0, 0, 0, 0);
            return date === edate;
        }

        $scope.checkDate = function () {
            $scope.filterResult();
        }

        $scope.checkEvent = function (eventCatId) {
            $scope.eventCatId = eventCatId;
            $scope.filterResult();
        }

        $scope.checkBusiness = function (bizCatId) {
            $scope.bizCatId = bizCatId;
            if ($scope.showData === 2) {
                $scope.filterResult2();
            }
        }

        $scope.checkPrice = function (price) {
            $scope.price = price;
            if ($scope.showData === 1) {
                $scope.filterResult();
            }
            if ($scope.showData === 2) {
                $scope.filterResult2();
            }
        }

        $scope.resetResult = function () {
            $scope.eventList = [];
            $scope.businessList = [];
            $scope.setDate = '';
            $scope.Address = '';
            $scope.BusinessCategoryId = '';
            $scope.EventCategoryId = '';
            $scope.eventCatId = '';
            $scope.eventList = $scope.events;
            $scope.businessList = $scope.businesses;
            //location.reload();
            $state.go($state.$current, null, { reload: true });
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SearchEventController', ["$scope", "httpService", "$http", "shareData", SearchEventController]);

    function SearchEventController($scope, httpService, $http, shareData) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        $scope.eventCategoryList = [];
        $scope.event = {};
        $scope.name = "";
        $scope.Address = "";
        $scope.categoryId = "";
        $scope.addressList = [];

        //get all event categories
        $scope.getEventCategory = function () {
            httpService.getData('EventCategories', "")
                .then(function (data) {
                    $scope.eventCategoryList = data;
                }
                , function (error) {
                    console.log(error);
                })
        };
        $scope.getEventCategory();

        // watch address variable alltime and execute when any changes made
        $scope.$watch('Address', function () {
            if ($scope.Address !== '') {
                $http.get(geourl + $scope.Address)
                    .then(function (responce) {
                        $scope.addressList = responce.data.results;
                    })
            }
        });

        // when enter key is pressed
        $scope.keyUp = function (keyEvent) {
            keyEvent.preventDefault();
            if (keyEvent.keyCode === 13) {
                $scope.search($scope.name, $scope.categoryId);
            }
        };

        // search event
        $scope.searchResult = [];

        $scope.search = function (name, categoryId) {
            var date = new Date().getTime();
            var filter = "?filter[where][StartDate][gt]=" + date + "&filter[include]=account" + "&filter[where][status]=public" + "&filter[include]=tickets";
            if ($scope.addressList.length !== 0) {
                var lat = $scope.addressList[0].geometry.location.lat;
                var long = $scope.addressList[0].geometry.location.lng;
                filter = filter + "&filter[where][Location][near]=" + lat + "," + long;
            }

            if (name !== '') {
                filter = filter + '&filter={"where":{"Name":{"like":"' + name + '","options":"i"}}}'
            }

            if (categoryId !== '') {
                filter = filter + "&filter[where][EventCategoryId]=" + categoryId;
            }
            httpService.getData('Events', filter)
                .then(function (responce) {
                    shareData.setEvent(responce);
                }
                , function (error) {
                    console.log(error);
                });
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SignUpController', ["$scope", "httpService", "$http", "shareData", "$state", "$location", SignUpController])


    function SignUpController($scope, httpService, $http, shareData, $state, $location) {
        var baseurl = httpService.baseurl;
        var googleUserInfo = {};
        $scope.error = false;
        $scope.selectedFile = [];
        $scope.user = {};
        $scope.user.FirstName = '';
        $scope.user.LastName = '';
        $scope.user.email = '';
        $scope.user.password = '';
        $scope.valid_error = false;
        $scope.alert = false;
        $scope.err_msg = '';

        function clearAllField() {
            for (var key in $scope.user) {
                $scope.user[key] = '';
            }
        }

        $scope.user.newsLetter = false;
        $scope.pic = null;
        $scope.user.file = null;
        $scope.crop = '';

        // // remove image 
        // $scope.removePic = function () {
        //     $scope.pic = null;
        //     $scope.user.file = '';
        // }

        // // crop the image
        // $scope.convertUrl = function () {
        //     $scope.user.file = $scope.crop.toDataURL();
        // }

        // // check image size is greater than 1 mb or not
        // $scope.checkPic = function (pic) {
        //     if ((pic.size / 1048576) > 1.00) {
        //         $scope.user.file = null;
        //         $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
        //     } else {
        //         $scope.picErrMsg = ""
        //     }
        // }

        // sign up an user
        $scope.signup = function (user) {
            for (var key in user) {
                if (user[key] === '' || user[key] === undefined) {
                    $scope.alert = true;
                    $scope.err_msg = key + " is not Defined";
                    return;
                }
            }

            if($location.search().token !== undefined)
            {
                user.tokenFromRef = $location.search().token;
            }

            var fd = new FormData();
            for (var key in user) {
                fd.append(key, user[key]);
            }
            var Upurl = 'Accounts/addaccount';
            var url = baseurl + Upurl;
            $scope.signupPromise = $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .success(function (responce) {
                    if (responce.status === "ValidationError") {
                        $scope.alert = true;
                        $scope.err_msg = responce.message;
                    } else if (responce.status === "Success") {
                        shareData.setUserInfo(responce);
                        clearAllField();
                        $state.go('Main.Signup.Success');
                    }
                })
                .error(function (err) {
                    return err;
                })
        }

        function apiClientLoaded() {
            gapi.client.plus.people.get({ userId: 'me' }).execute(handleResponse);
        }

        function handleResponse(resp) {
            googleUserInfo = resp;
            $scope.user.FirstName = googleUserInfo.name.givenName;
            $scope.user.LastName = googleUserInfo.name.familyName;
            $scope.user.email = googleUserInfo.emails[0].value;
            $scope.user.UserPicture = googleUserInfo.image.url;
            $scope.user.Type = 'Google';
            $scope.user.Id = googleUserInfo.id;

            $scope.loginPromise = $http({
                method: 'POST',
                url: baseurl + 'Accounts/socialsignin',
                data: JSON.stringify($scope.user)
            })
                .success(function (data) {
                    var obj = {};
                    obj.id = data.accessToken;
                    obj.userId = data.id;
                    shareData.setAccessToken(obj);
                })
                .error(function (err) {
                    console.log(err);
                })
        }
        // google login
        $scope.GoogleLogin = function () {
            $scope.$on('event:google-plus-signin-success', function (event, authResult) {
                $scope.user.Token = authResult.access_token;
                gapi.client.load('plus', 'v1', apiClientLoaded)
            });


        }
        // facebook login
        $scope.FBLogin = function () {

            FB.login(function (response) {
                var accessToken = response.authResponse.accessToken;
                if (response.status === 'connected') {
                    FB.api('/me', function (response) {
                        var obj = {};
                        obj.Type = 'FB';
                        obj.FirstName = response.first_name;
                        obj.LastName = response.last_name;
                        obj.email = response.email;
                        obj.Token = accessToken;
                        obj.Id = response.id;
                        $scope.loginPromise = $http({
                            method: 'POST',
                            url: baseurl + 'Accounts/socialsignin',
                            data: JSON.stringify(obj)
                        })
                            .success(function (data) {
                                var obj1 = {};
                                obj1.id = data.accessToken;
                                obj1.userId = data.id;
                                shareData.setAccessToken(obj1);
                                $uibModalInstance.close();
                            })
                            .error(function (err) {
                                //console.log(err);
                            })
                    });
                }
            }, { scope: 'public_profile,email' });

        }

        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            console.log("Google Signin Failure");
        });

        window.fbAsyncInit = function () {
            FB.init({
                appId: '1598513400364558',
                xfbml: true,
                version: 'v2.3'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        } (document, 'script', 'facebook-jssdk'));

    }

    
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SignUpSuccessController', ["$scope", "shareData", "$http", "httpService", "$timeout", "$rootScope", SignUpSuccessController])

    function SignUpSuccessController($scope, shareData, $http, httpService, $timeout, $rootScope) {
        // $scope.obj.message = "Please wait for a few minute...";
        $scope.obj = shareData.getUserInfo();
        $scope.receivedMessage = $scope.obj.message;
        var baseurl = httpService.baseurl;
        $scope.alert = false;

        $rootScope.$emit('changeFooterClass', 'footer-fixed');

        $scope.$on('$destroy', function () {
            $rootScope.$emit('changeFooterClass', '');
        });

        function hideMsg() {
            $scope.alert = false;
        }

        // after signup success a link can be resend
        $scope.resend = function () {
            $scope.resendLinkPromise = $http({
                method: "POST",
                url: baseurl + "Accounts/resendLink",
                params: {
                    options: JSON.stringify($scope.obj.options)
                }
            })
                .success(function (res) {
                    $scope.alert = true;
                    $scope.alertMsg = "Link Resend Successful!!";
                    $timeout(hideMsg, 5000);
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SuccessModalController', ["$scope", "$uibModalInstance", "$timeout", SuccessModalController]);
        
    function SuccessModalController($scope, $uibModalInstance, $timeout) {
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        $timeout(cancel, 5000);

        $scope.finish = function () {
            cancel();
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('carouselInit', [carouselInit]);

    function carouselInit() {
        return {
            restrict: 'A',
            link: function (scope, element) {
                if (scope.$last) {
                    $(element.parent()).owlCarousel({
                        dots: false,
                        autoWidth: true,
                        navigation: true,
                        pagination: false,
                        paginationNumbers: false,
                        navigationText: [
                            '<img class="next" src="images/next.png">',
                            '<img class="prev" src="images/prev.png">'
                        ],
                        autoPlay: 3000,
                        items: 6,
                        itemsDesktop: [1199, 6],
                        itemsDesktopSmall: [979, 3]

                    })
                }
            }
        };
    }
})();
(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('AddCardModalController', ["$scope", "httpService", "$uibModalInstance", "userInfo", "$route", AddCardModalController]);

    function AddCardModalController($scope, httpService, $uibModalInstance, userInfo, $route) {
        $scope.userInfo = userInfo;
        $scope.card = {
            Name: '',
            Number: '',
            Type: '',
            Ccv: '',
            ExpiryMonth: '',
            ExpiryYear: '',
            BillingAddress: '',
            City: '',
            Country: ''
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        /* add credit card info */
        $scope.addCard = function () {
            for (var key in $scope.card) {
                if ($scope.card[key] === '') {
                    alert('Can not keep ' + key + ' field empty');
                    return;
                }
            }
            $scope.card.AccountId = $scope.userInfo.userId;
            httpService.postData($scope.card, 'Cards', $scope.userInfo.userId)
                .then(function (data) {
                    $uibModalInstance.dismiss('cancel');
                    $route.reload();
                }, function (err) {
                    //console.log(err);
                });
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ProfileController', ["$scope", "httpService", "$state", ProfileController])

    function ProfileController($scope, httpService, $state) {
        $scope.userAccInfo = {};
        $scope.passErr = false;
        $scope.rePassErr = false;

        $scope.getUserAccInfo = function () {
            $scope.profilePromise = httpService.getData("Accounts" + "/" + $scope.userInfo.userId, "", $scope.userInfo.id)
                .then(function (res) {
                    $scope.userAccInfo = res;
                    if ($scope.userAccInfo.UserPicture === undefined) {
                        $scope.showImageInput = true;
                        $scope.showImage = false;
                    } else {
                        $scope.showImageInput = false;
                        $scope.showImage = true;
                    }
                },
                function (err) {
                    console.log(err);
                });
        }
        $scope.getUserAccInfo();

        $scope.pic = null;
        $scope.userAccInfo.file = null;
        $scope.crop = '';
        $scope.cropMsg = false;
        $scope.cropMsg1 = " ";

        $scope.removeImage = function () {
            $scope.showImageInput = true;
            $scope.showImage = false;
            $scope.cropMsg = false;
            $scope.userAccInfo.UserPicture = '';
        }

        $scope.removePic = function () {
            $scope.pic = null;
            $scope.userAccInfo.file = '';
            $scope.cropMsg = false;
        }

        $scope.convertUrl = function () {
            $scope.cropMsg1 = true;
            $scope.cropMsg = false;
            $scope.userAccInfo.file = $scope.crop.toDataURL();
        }

        $scope.checkPic = function (pic) {
            if ((pic.size / 1048576) > 1.00) {
                $scope.picErr = true;
                $scope.pic = null;
                $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
            } else {
                $scope.picErr = false;
                $scope.picErrMsg = ""
            }
            $scope.cropMsg = false;
            $scope.cropMsg1 = false;
        }

        $scope.checkPass = function () {
            if ($scope.userAccInfo.password !== undefined) {
                if ($scope.userAccInfo.password.length < 6) {
                    $scope.passErr = true;
                    $scope.passErrMsg = "Password must be at least 6 character long"
                } else {
                    $scope.passErr = false;
                }
            }
        }

        $scope.$watch("rePass", function () {
            if ($scope.pass === '') {
                $scope.rePassErr = false;
            }
            if ($scope.rePass !== $scope.userAccInfo.password) {
                $scope.rePassErr = true;
                $scope.rePassErrMsg = "Password does not match";
            } else {
                $scope.rePassErr = false;
            }
        })

        $scope.editProfile = function () {
            if ($scope.userAccInfo.file !== undefined) {
                var byteString = atob($scope.userAccInfo.file.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                $scope.userAccInfo.file = new Blob([ab], { type: 'image/png' });
            }
            $scope.userAccInfo.Id = $scope.userAccInfo.id;
            if ($scope.userAccInfo.email === '') {
                alert('Email Can Not Remain Empty');
            }
            else if ($scope.cropMsg1 === false) {
                $scope.cropMsg = true;
                $scope.cropMsgErr = "Picture should be cropped properly";
            }
            else {
                if ($scope.userAccInfo.password !== undefined) {
                    var temp = {
                        email: $scope.userAccInfo.email,
                        password: $scope.userAccInfo.password
                    }
                    delete $scope.userAccInfo.password;
                    httpService.postData(temp, 'Accounts/sendemail', $scope.userInfo.id)
                        .then(function (data) {

                        },
                        function (err) {
                            console.log(err);
                        });

                }
                
                $scope.profilePromise = httpService.postMultiData('Accounts/editaccount', $scope.userAccInfo, $scope.userInfo.id)
                    .then(function () {
                        $state.reload();
                    });
            }

        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ProfileEventController', ['$scope', 'httpService', ProfileEventController])

    function ProfileEventController($scope, httpService) {
        $scope.event = "going";
        $scope.goingEventList = [];
        $scope.hostingEventList = [];
        $scope.pastHostEventList = [];
        $scope.upComingHostEventList = [];
        $scope.showUpcomingEvent = true;

        // get all participants of Rsvp 2 that means who are going
        function getGoningEvents() {
            var filter = "?filter[include]=event" + "&filter[where][AccountId]=" + $scope.userInfo.userId + "&filter[where][Rsvp]=2";
            $scope.goingEventPromise = httpService.getData('Participants', filter, $scope.userInfo.id)
                .then(function (data) {
                    $scope.goingEventList = data;
                },
                function (err) {
                    console.log(err);
                });
        }
        getGoningEvents();

        // show all upcomming and past event in each profile
        var dd = new Date().getTime();
        function sortAccordingtoDate() {
            var diff = 9999999999999999999;
            for (var i = 0; i < $scope.hostingEventList.length; i++) {
                if ($scope.hostingEventList[i].StartDate < dd) {
                    $scope.pastHostEventList.push($scope.hostingEventList[i]);
                } else {
                    $scope.upComingHostEvent = $scope.hostingEventList[i];
                    $scope.upComingHostEventList.push($scope.hostingEventList[i]);
                }
            }
            if ($scope.upComingHostEvent === undefined) {
                $scope.showUpcomingEvent = false;
            }
        }

        // get all events that are hosting by the owner
        function getHostingEvents() {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId + "&filter[include]=account";
            httpService.getData('Events', filter, '')
                .then(function (data) {
                    $scope.hostingEventList = data;
                    sortAccordingtoDate();
                },
                function (err) {
                    console.log(err);
                });
        }
        getHostingEvents()
    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ProfileHistoryController', ["$scope", "httpService", ProfileHistoryController])
    function ProfileHistoryController($scope, httpService) {

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ProfileInterestController', ["$scope", "httpService", "$http", "$timeout", "envData", ProfileInterestController]);

    function ProfileInterestController($scope, httpService, $http, $timeout, envData) {
        //todo: update the base API url to be injected and environment specific
        // $scope.baseurl = "http://api.even3app.com/api";
        $scope.baseurl = envData.apiUrl;
        var indexList = [];
        var temp = [];
        $scope.showMsg = false;
        $scope.interestRetrivedList = [];

        // 
        $scope.showInterest = function (index, state) {
            if (state) {
                indexList.push(index);
            } else {
                for (var i = 0; i < indexList.length; i++) {
                    if (indexList[i] === index) {
                        indexList.splice(i, 1);
                        return;
                    }
                }
            }
        };

        // get the all interests of the user that are checked
        function getInterest() {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId;
            httpService.getData('interests', filter, $scope.userInfo.id)
                .then(function (res) {
                    if (res.length > 0) {
                        var temp = res[0].names
                    }
                    if (temp !== undefined) {
                        for (var i = 0; i < temp.length; i++) {
                            if (temp[i] === 'Arts & Crafts') {
                                $scope.interest0 = true;
                                $scope.interestRetrivedList.push(0);
                            }
                            if (temp[i] === 'Collecting') {
                                $scope.interest1 = true;
                                $scope.interestRetrivedList.push(1);
                            }
                            if (temp[i] === 'Dancing') {
                                $scope.interest2 = true;
                                $scope.interestRetrivedList.push(2);
                            }
                            if (temp[i] === 'Drama') {
                                $scope.interest3 = true;
                                $scope.interestRetrivedList.push(3);
                            }
                            if (temp[i] === 'Food And Drink') {
                                $scope.interest4 = true;
                                $scope.interestRetrivedList.push(4);
                            }
                            if (temp[i] === 'Games') {
                                $scope.interest5 = true;
                                $scope.interestRetrivedList.push(5);
                            }
                            if (temp[i] === 'Music') {
                                $scope.interest6 = true;
                                $scope.interestRetrivedList.push(6);
                            }
                            if (temp[i] === 'Outdoor Hobbies') {
                                $scope.interest7 = true;
                                $scope.interestRetrivedList.push(7);
                            }
                            if (temp[i] === 'Pets') {
                                $scope.interest8 = true;
                                $scope.interestRetrivedList.push(8);
                            }
                            if (temp[i] === 'Rc Hobbies') {
                                $scope.interest9 = true;
                                $scope.interestRetrivedList.push(9);
                            }
                            if (temp[i] === 'Sports') {
                                $scope.interest10 = true;
                                $scope.interestRetrivedList.push(10);
                            }
                        }
                    }
                    indexList = $scope.interestRetrivedList;
                })
        }
        getInterest();

        function hideMsg() {
            $scope.showMsg = false;
        }

        // set the user interest
        $scope.setInterest = function () {
            var interestNameList = [];
            for (var i = 0; i < indexList.length; i++) {
                var id = indexList[i];
                interestNameList.push($scope.interestList[id].name);
            }
            var obj = {
                names: interestNameList,
                AccountId: $scope.userInfo.userId
            };
            $scope.interestPromise = $http({
                method: 'POST',
                url: $scope.baseurl + "interests/userinterest",
                params: {
                    allinterests: JSON.stringify(obj)
                }
            })
                .success(function (res) {
                    $scope.showMsg = true;
                    $timeout(hideMsg, 5000);
                })
                .error(function (err) {
                    console.log(err);
                })
        };

        $scope.interestList = [
            {
                name: "Arts & Crafts",
                value: false
            },
            {
                name: "Collecting",
                value: false
            },
            {
                name: "Dancing",
                value: false
            },
            {
                name: "Drama",
                value: false
            },
            {
                name: "Food And Drink",
                value: false
            },
            {
                name: "Games",
                value: false
            },
            {
                name: "Music",
                value: false
            },
            {
                name: "Outdoor Hobbies",
                value: false
            },
            {
                name: "Pets",
                value: false
            },
            {
                name: "Rc Hobbies",
                value: false
            },
            {
                name: "Sports",
                value: false
            }
        ]

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ProfilePaymentMethodController', ["$scope", "httpService", "stripe", "$uibModal", ProfilePaymentMethodController]);

    function ProfilePaymentMethodController($scope, httpService, stripe, $uibModal) {
        $scope.showCcform = false;
        $scope.cardList = [];

        // get all card of the user that he uses for payment
        function getCardList() {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId;
            $scope.paymentPromise = httpService.getData('Cards', filter, $scope.userInfo.id)
                .then(function (response) {
                    $scope.cardList = response;
                },
                function (err) {
                    console.log(err);
                })
        }

        getCardList();

        // open add card modal
        $scope.openModal = function () {
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/profile/templates/add-card-modal.html',
                controller: 'AddCardModalController',
                size: 'lg',
                resolve: {
                    userInfo: function () {
                        return $scope.userInfo;
                    }
                }
            });
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ProfileServiceController', ["$scope", "httpService", ProfileServiceController])
    function ProfileServiceController($scope, httpService) {
        $scope.service = 'saved';
        $scope.savedServiceList = [];
        $scope.myServiceList = [];

        // get the all services that are saved by the user
        function getSavedService() {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId + "&filter[include]=business" + "&filter[include]=account";
            $scope.saveBizPromise = httpService.getData('savedBusinesses', filter, $scope.userInfo.id)
                .then(function (data) {
                    $scope.savedServiceList = data;
                },
                function (err) {
                    console.log(err);
                })
        }
        getSavedService();

        // get the all services that are created by the user
        function getMyService() {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId + "&filter[include]=account";
            httpService.getData('Businesses', filter, '')
                .then(function (data) {
                    $scope.myServiceList = data;
                },
                function (err) {
                    console.log(err);
                })
        }
        getMyService();

    }
})();

(function () {
    'use strict';
    angular.module('evenApp')
        .controller('ProfileTicketController', ["$scope", "httpService", "$uibModal", ProfileTicketController]);

    function ProfileTicketController($scope, httpService, $uibModal) {
        $scope.purchasedEventList = [];
        $scope.purchasedEventList.length = 0;
        $scope.Tckts = false;
        var dt = new Date().getTime();

        // get event ticket purchase detail of an user
        $scope.getTicketPurchase = function () {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId + "&filter[include]=event" + "&filter[include]=ticketPurchase";
            $scope.ticketPurchasePromise = httpService.getData('TicketPurchaseDetails', filter, $scope.userInfo.id)
                .then(function (data) {
                    groupData(data);
                },
                function (err) {
                    console.log(err);
                })
        }
        $scope.getTicketPurchase();

        function groupData(data) {
            $scope.data = data;
            for (var i = $scope.data.length - 1; i > -1; i--) {
                if ($scope.data[i].StartDate < dt) {
                    $scope.data.splice(i, 1);
                }
            }
            $scope.purchasedEventList[0] = $scope.data[0];
            for (var i = 1; i < $scope.data.length; i++) {
                for (var j = 0; j < $scope.purchasedEventList.length; j++) {
                    if ($scope.data[i].EventId === $scope.purchasedEventList[j].EventId) {
                        break;
                    }
                }
                if (j === $scope.purchasedEventList.length) {
                    $scope.purchasedEventList.push($scope.data[i]);
                }
            }
            for (var i = 0; i < $scope.purchasedEventList.length; i++) {
                var ticketNum = 0;
                for (j = 0; j < $scope.data.length; j++) {
                    if ($scope.purchasedEventList[i].EventId === $scope.data[j].EventId) {
                        ticketNum++;
                    }
                }
                $scope.purchasedEventList[i].ticketNum = ticketNum;
            }
            $scope.Tckts = true;
        }

        // show all ticket that has been bought in a modal
        $scope.openModal = function (id) {
            var events = $scope.data.filter(function (obj) {
                return (obj.EventId === $scope.purchasedEventList[id].EventId);
            });
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/profile/templates/ticket-modal.html',
                controller: 'TicketModalController',
                size: 'lg',
                resolve: {
                    eventTicketList: function () {
                        return events;
                    }
                }
            });
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('TicketModalController', ["$scope", "httpService", "eventTicketList", "$uibModalInstance", TicketModalController]);

    function TicketModalController($scope, httpService, eventTicketList, $uibModalInstance) {
        $scope.eventTicketList = eventTicketList;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();

(function () {
    'use strict';
    angular
        .module('evenApp')
        .filter('yesNo', function () {
            return function (boolean) {
                return boolean ? 'Yes' : 'No';
            }
        });
})();
function getDate(){
	var currentDate = new Date()
	var day = currentDate.getDate()
	var month = currentDate.getMonth() + 1
	var year = currentDate.getFullYear();

	return month + "/" + day + "/" + year;
}


$(document).ready(function(){
	$('.hamburger').click(function(){
		$('.menu').slideToggle();
	});
});
/* =========================================================
 * bootstrap-datepicker.js 
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
 
!function( $ ) {
	
	// Picker object
	
	var Datepicker = function(element, options){
		this.element = $(element);
		this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||'mm/dd/yyyy');
		this.picker = $(DPGlobal.template)
							.appendTo('body')
							.on({
								click: $.proxy(this.click, this)//,
								//mousedown: $.proxy(this.mousedown, this)
							});
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
		
		if (this.isInput) {
			this.element.on({
				focus: $.proxy(this.show, this),
				//blur: $.proxy(this.hide, this),
				keyup: $.proxy(this.update, this)
			});
		} else {
			if (this.component){
				this.component.on('click', $.proxy(this.show, this));
			} else {
				this.element.on('click', $.proxy(this.show, this));
			}
		}
	
		this.minViewMode = options.minViewMode||this.element.data('date-minviewmode')||0;
		if (typeof this.minViewMode === 'string') {
			switch (this.minViewMode) {
				case 'months':
					this.minViewMode = 1;
					break;
				case 'years':
					this.minViewMode = 2;
					break;
				default:
					this.minViewMode = 0;
					break;
			}
		}
		this.viewMode = options.viewMode||this.element.data('date-viewmode')||0;
		if (typeof this.viewMode === 'string') {
			switch (this.viewMode) {
				case 'months':
					this.viewMode = 1;
					break;
				case 'years':
					this.viewMode = 2;
					break;
				default:
					this.viewMode = 0;
					break;
			}
		}
		this.startViewMode = this.viewMode;
		this.weekStart = options.weekStart||this.element.data('date-weekstart')||0;
		this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
		this.onRender = options.onRender;
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();
	};
	
	Datepicker.prototype = {
		constructor: Datepicker,
		
		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e ) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (!this.isInput) {
			}
			var that = this;
			$(document).on('mousedown', function(ev){
				if ($(ev.target).closest('.datepicker').length == 0) {
					that.hide();
				}
			});
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},
		
		hide: function(){
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}
			//this.set();
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},
		
		set: function() {
			var formated = DPGlobal.formatDate(this.date, this.format);
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').prop('value', formated);
				}
				this.element.data('date', formated);
			} else {
				this.element.prop('value', formated);
			}
		},
		
		setValue: function(newDate) {
			if (typeof newDate === 'string') {
				this.date = DPGlobal.parseDate(newDate, this.format);
			} else {
				this.date = new Date(newDate);
			}
			this.set();
			this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
			this.fill();
		},
		
		place: function(){
			var offset = this.component ? this.component.offset() : this.element.offset();
			this.picker.css({
				top: offset.top + this.height,
				left: offset.left
			});
		},
		
		update: function(newDate){
			this.date = DPGlobal.parseDate(
				typeof newDate === 'string' ? newDate : (this.isInput ? this.element.prop('value') : this.element.data('date')),
				this.format
			);
			this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
			this.fill();
		},
		
		fillDow: function(){
			var dowCnt = this.weekStart;
			var html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">'+DPGlobal.dates.daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},
		
		fillMonths: function(){
			var html = '';
			var i = 0
			while (i < 12) {
				html += '<span class="month">'+DPGlobal.dates.monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').append(html);
		},
		
		fill: function() {
			var d = new Date(this.viewDate),
				year = d.getFullYear(),
				month = d.getMonth(),
				currentDate = this.date.valueOf();
			this.picker.find('.datepicker-days th:eq(1)')
						.text(DPGlobal.dates.months[month]+' '+year);
			var prevMonth = new Date(year, month-1, 28,0,0,0,0),
				day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
			prevMonth.setDate(day);
			prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setDate(nextMonth.getDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName,
				prevY,
				prevM;
			while(prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getDay() === this.weekStart) {
					html.push('<tr>');
				}
				clsName = this.onRender(prevMonth);
				prevY = prevMonth.getFullYear();
				prevM = prevMonth.getMonth();
				if ((prevM < month &&  prevY === year) ||  prevY < year) {
					clsName += ' old';
				} else if ((prevM > month && prevY === year) || prevY > year) {
					clsName += ' new';
				}
				if (prevMonth.valueOf() === currentDate) {
					clsName += ' active';
				}
				html.push('<td class="day '+clsName+'">'+prevMonth.getDate() + '</td>');
				if (prevMonth.getDay() === this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setDate(prevMonth.getDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date.getFullYear();
			
			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear === year) {
				months.eq(this.date.getMonth()).addClass('active');
			}
			
			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i === -1 || i === 10 ? ' old' : '')+(currentYear === year ? ' active' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},
		
		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th');
			if (target.length === 1) {
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								this.viewDate['set'+DPGlobal.modes[this.viewMode].navFnc].call(
									this.viewDate,
									this.viewDate['get'+DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate) + 
									DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1)
								);
								this.fill();
								this.set();
								break;
						}
						break;
					case 'span':
						if (target.is('.month')) {
							var month = target.parent().find('span').index(target);
							this.viewDate.setMonth(month);
						} else {
							var year = parseInt(target.text(), 10)||0;
							this.viewDate.setFullYear(year);
						}
						if (this.viewMode !== 0) {
							this.date = new Date(this.viewDate);
							this.element.trigger({
								type: 'changeDate',
								date: this.date,
								viewMode: DPGlobal.modes[this.viewMode].clsName
							});
						}
						this.showMode(-1);
						this.fill();
						this.set();
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							var day = parseInt(target.text(), 10)||1;
							var month = this.viewDate.getMonth();
							if (target.is('.old')) {
								month -= 1;
							} else if (target.is('.new')) {
								month += 1;
							}
							var year = this.viewDate.getFullYear();
							this.date = new Date(year, month, day,0,0,0,0);
							this.viewDate = new Date(year, month, Math.min(28, day),0,0,0,0);
							this.fill();
							this.set();
							this.element.trigger({
								type: 'changeDate',
								date: this.date,
								viewMode: DPGlobal.modes[this.viewMode].clsName
							});
						}
						break;
				}
			}
		},
		
		mousedown: function(e){
			e.stopPropagation();
			e.preventDefault();
		},
		
		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
		}
	};
	
	$.fn.datepicker = function ( option, val ) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data) {
				$this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
			}
			if (typeof option === 'string') data[option](val);
		});
	};

	$.fn.datepicker.defaults = {
		onRender: function(date) {
			return '';
		}
	};
	$.fn.datepicker.Constructor = Datepicker;
	
	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		dates:{
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		},
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		parseFormat: function(format){
			var separator = format.match(/[.\/\-\s].*?/),
				parts = format.split(/\W+/);
			if (!separator || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separator: separator, parts: parts};
		},
		parseDate: function(date, format) {
			var parts = date.split(format.separator),
				date = new Date(),
				val;
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			if (parts.length === format.parts.length) {
				var year = date.getFullYear(), day = date.getDate(), month = date.getMonth();
				for (var i=0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10)||1;
					switch(format.parts[i]) {
						case 'dd':
						case 'd':
							day = val;
							date.setDate(val);
							break;
						case 'mm':
						case 'm':
							month = val - 1;
							date.setMonth(val - 1);
							break;
						case 'yy':
							year = 2000 + val;
							date.setFullYear(2000 + val);
							break;
						case 'yyyy':
							year = val;
							date.setFullYear(val);
							break;
					}
				}
				date = new Date(year, month, day, 0 ,0 ,0);
			}
			return date;
		},
		formatDate: function(date, format){
			var val = {
				d: date.getDate(),
				m: date.getMonth() + 1,
				yy: date.getFullYear().toString().substring(2),
				yyyy: date.getFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			var date = [];
			for (var i=0, cnt = format.parts.length; i < cnt; i++) {
				date.push(val[format.parts[i]]);
			}
			return date.join(format.separator);
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev">&lsaquo;</th>'+
								'<th colspan="5" class="switch"></th>'+
								'<th class="next">&rsaquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
	};
	DPGlobal.template = '<div class="datepicker dropdown-menu">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
								'</table>'+
							'</div>'+
						'</div>';

}( window.jQuery );
/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1||b[0]>2)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.6",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.6",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),a(c.target).is('input[type="radio"]')||a(c.target).is('input[type="checkbox"]')||c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.6",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.6",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",f)))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.6",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger(a.Event("shown.bs.dropdown",h))}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.6",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.6",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),c.isInStateTrue()?void 0:(clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide())},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.6",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.6",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");
d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.6",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.6",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
$(document).ready(function(){
	$('#upload_photo').click(function(){
		$("#pic").trigger('click');
	});

	var add_ticket = $('.ticket_container').html();
	
	$('#event_price_paid,#event_price_free').change(function(){
		if(this.value === 'paid'){
			$(".ticket_type").show();
		}
		else if(this.value === 'free'){
			$(".ticket_type").hide();   
			$('.ticket_container').remove();
			$(".ticket_type .add_new_event").before('<div class=\"ticket_container\">' + add_ticket + '</div>');
		}else{

		}
	 	
	});

	$('.add_new_event').click(function(){
	 $('.ticket_container').last().after('<div class=\"ticket_container\">' + add_ticket + '</div>');
	})
});
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
/*
 * jQuery FlexSlider v2.6.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;
(function ($) {

  var focused = true;

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);

    // making variables public
    slider.vars = $.extend({}, $.flexslider.defaults, options);

    var namespace = slider.vars.namespace,
        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
        // depricating this idea, as devices are being released with both of these events
        eventType = "click touchend MSPointerUp keyup",
        watchedEvent = "",
        watchedEventClearTimer,
        vertical = slider.vars.direction === "vertical",
        reverse = slider.vars.reverse,
        carousel = (slider.vars.itemWidth > 0),
        fade = slider.vars.animation === "fade",
        asNav = slider.vars.asNavFor !== "",
        methods = {};

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Private slider methods
    methods = {
      init: function() {
        slider.animating = false;
        // Get current slide and make sure it is a number
        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0), 10 );
        if ( isNaN( slider.currentSlide ) ) { slider.currentSlide = 0; }
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
        slider.slides = $(slider.vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(slider.vars.sync).length > 0;
        // SLIDE:
        if (slider.vars.animation === "slide") { slider.vars.animation = "swing"; }
        slider.prop = (vertical) ? "top" : "marginLeft";
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        slider.stopped = false;
        //PAUSE WHEN INVISIBLE
        slider.started = false;
        slider.startTimeout = null;
        // TOUCH/USECSS:
        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        slider.ensureAnimationEnd = '';
        // CONTROLSCONTAINER:
        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
        // MANUAL:
        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

        // CUSTOM DIRECTION NAV:
        if (slider.vars.customDirectionNav !== "") slider.customDirectionNav = $(slider.vars.customDirectionNav).length === 2 && $(slider.vars.customDirectionNav);

        // RANDOMIZE:
        if (slider.vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (slider.vars.controlNav) { methods.controlNav.setup(); }

        // DIRECTIONNAV:
        if (slider.vars.directionNav) { methods.directionNav.setup(); }

        // KEYBOARD:
        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (keycode === 39) ? slider.getTarget('next') :
                           (keycode === 37) ? slider.getTarget('prev') : false;
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (slider.vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (slider.vars.pausePlay) { methods.pausePlay.setup(); }

        //PAUSE WHEN INVISIBLE
        if (slider.vars.slideshow && slider.vars.pauseInvisible) { methods.pauseInvisible.init(); }

        // SLIDSESHOW
        if (slider.vars.slideshow) {
          if (slider.vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) { slider.pause(); }
            }, function() {
              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) { slider.play(); }
            });
          }
          // initialize animation
          //If we're visible, or we don't use PageVisibility API
          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
          }
        }

        // ASNAV:
        if (asNav) { methods.asNav.setup(); }

        // TOUCH
        if (touch && slider.vars.touch) { methods.touch(); }

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && slider.vars.smoothHeight)) { $(window).bind("resize orientationchange focus", methods.resize); }

        slider.find("img").attr("draggable", "false");

        // API: start() Callback
        setTimeout(function(){
          slider.vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          if(!msGesture){
              slider.slides.on(eventType, function(e){
                e.preventDefault();
                var $slide = $(this),
                    target = $slide.index();
                var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                if( posFromLeft <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
                  slider.flexAnimate(slider.getTarget("prev"), true);
                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                }
              });
          }else{
              el._slider = slider;
              slider.slides.each(function (){
                  var that = this;
                  that._gesture = new MSGesture();
                  that._gesture.target = that;
                  that.addEventListener("MSPointerDown", function (e){
                      e.preventDefault();
                      if(e.currentTarget._gesture) {
                        e.currentTarget._gesture.addPointer(e.pointerId);
                      }
                  }, false);
                  that.addEventListener("MSGestureTap", function (e){
                      e.preventDefault();
                      var $slide = $(this),
                          target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                      }
                  });
              });
          }
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item,
              slide;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              slide = slider.slides.eq(i);
              if ( undefined === slide.attr( 'data-thumb-alt' ) ) { slide.attr( 'data-thumb-alt', '' ); }
              altText = ( '' !== slide.attr( 'data-thumb-alt' ) ) ? altText = ' alt="' + slide.attr( 'data-thumb-alt' ) + '"' : '';
              item = (slider.vars.controlNav === "thumbnails") ? '<img src="' + slide.attr( 'data-thumb' ) + '"' + altText + '/>' : '<a href="#">' + j + '</a>';
              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
                var captn = slide.attr( 'data-thumbcaption' );
                if ( '' !== captn && undefined !== captn ) { item += '<span class="' + namespace + 'caption">' + captn + '</span>'; }
              }
              slider.controlNavScaffold.append('<li>' + item + '</li>');
              j++;
            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();

          });
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        set: function() {
          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a href="#">' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li class="' + namespace + 'nav-prev"><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li class="' + namespace + 'nav-next"><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + '</a></li></ul>');

          // CUSTOM DIRECTION NAV:
          if (slider.customDirectionNav) {
            slider.directionNav = slider.customDirectionNav;
          // CONTROLSCONTAINER:
          } else if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target;

            if (watchedEvent === "" || watchedEvent === event.type) {
              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
          } else if (!slider.vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
            } else {
              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
            }
          } else {
            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a href="#"></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              if ($(this).hasClass(namespace + 'pause')) {
                slider.manualPause = true;
                slider.manualPlay = false;
                slider.pause();
              } else {
                slider.manualPause = false;
                slider.manualPlay = true;
                slider.play();
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          onTouchStart,
          onTouchMove,
          onTouchEnd,
          scrolling = false,
          localX = 0,
          localY = 0,
          accDx = 0;

        if(!msGesture){
            onTouchStart = function(e) {
              if (slider.animating) {
                e.preventDefault();
              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
                slider.pause();
                // CAROUSEL:
                cwidth = (vertical) ? slider.h : slider. w;
                startT = Number(new Date());
                // CAROUSEL:

                // Local vars for X and Y points.
                localX = e.touches[0].pageX;
                localY = e.touches[0].pageY;

                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                startX = (vertical) ? localY : localX;
                startY = (vertical) ? localX : localY;

                el.addEventListener('touchmove', onTouchMove, false);
                el.addEventListener('touchend', onTouchEnd, false);
              }
            };

            onTouchMove = function(e) {
              // Local vars for X and Y points.

              localX = e.touches[0].pageX;
              localY = e.touches[0].pageY;

              dx = (vertical) ? startX - localY : startX - localX;
              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));

              var fxms = 500;

              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
                e.preventDefault();
                if (!fade && slider.transitions) {
                  if (!slider.vars.animationLoop) {
                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                  }
                  slider.setProps(offset + dx, "setTouch");
                }
              }
            };

            onTouchEnd = function(e) {
              // finish the touch by undoing the touch session
              el.removeEventListener('touchmove', onTouchMove, false);

              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                var updateDx = (reverse) ? -dx : dx,
                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                } else {
                  if (!fade) { slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true); }
                }
              }
              el.removeEventListener('touchend', onTouchEnd, false);

              startX = null;
              startY = null;
              dx = null;
              offset = null;
            };

            el.addEventListener('touchstart', onTouchStart, false);
        }else{
            el.style.msTouchAction = "none";
            el._gesture = new MSGesture();
            el._gesture.target = el;
            el.addEventListener("MSPointerDown", onMSPointerDown, false);
            el._slider = slider;
            el.addEventListener("MSGestureChange", onMSGestureChange, false);
            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

            function onMSPointerDown(e){
                e.stopPropagation();
                if (slider.animating) {
                    e.preventDefault();
                }else{
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider. w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                }
            }

            function onMSGestureChange(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                var transX = -e.translationX,
                    transY = -e.translationY;

                //Accumulate translations.
                accDx = accDx + ((vertical) ? transY : transX);
                dx = accDx;
                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
                    setImmediate(function (){
                        el._gesture.stop();
                    });

                    return;
                }

                if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                        if (!slider.vars.animationLoop) {
                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                        }
                        slider.setProps(offset + dx, "setTouch");
                    }
                }
            }

            function onMSGestureEnd(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                        if (!fade) { slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true); }
                    }
                }

                startX = null;
                startY = null;
                dx = null;
                offset = null;
                accDx = 0;
            }
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) { slider.doMath(); }

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) { methods.smoothHeight(); }
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
        }
      },
      sync: function(action) {
        var $obj = $(slider.vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      },
      uniqueID: function($clone) {
        // Append _clone to current level and children elements with id attributes
        $clone.filter( '[id]' ).add($clone.find( '[id]' )).each(function() {
          var $this = $(this);
          $this.attr( 'id', $this.attr( 'id' ) + '_clone' );
        });
        return $clone;
      },
      pauseInvisible: {
        visProp: null,
        init: function() {
          var visProp = methods.pauseInvisible.getHiddenProp();
          if (visProp) {
            var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
            document.addEventListener(evtname, function() {
              if (methods.pauseInvisible.isHidden()) {
                if(slider.startTimeout) {
                  clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                } else {
                  slider.pause(); //Or just pause
                }
              }
              else {
                if(slider.started) {
                  slider.play(); //Initiated before, just play
                } else {
                  if (slider.vars.initDelay > 0) {
                    setTimeout(slider.play, slider.vars.initDelay);
                  } else {
                    slider.play(); //Didn't init before: simply init or wait for it
                  }
                }
              }
            });
          }
        },
        isHidden: function() {
          var prop = methods.pauseInvisible.getHiddenProp();
          if (!prop) {
            return false;
          }
          return document[prop];
        },
        getHiddenProp: function() {
          var prefixes = ['webkit','moz','ms','o'];
          // if 'hidden' is natively supported just return it
          if ('hidden' in document) {
            return 'hidden';
          }
          // otherwise loop over all the known prefixes until we find one
          for ( var i = 0; i < prefixes.length; i++ ) {
              if ((prefixes[i] + 'Hidden') in document) {
                return prefixes[i] + 'Hidden';
              }
          }
          // otherwise it's not supported
          return null;
        }
      },
      setToClearWatchedEvent: function() {
        clearTimeout(watchedEventClearTimer);
        watchedEventClearTimer = setTimeout(function() {
          watchedEvent = "";
        }, 3000);
      }
    };

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
      }

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(slider.vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;

        // SLIDESHOW:
        if (pause) { slider.pause(); }

        // API: before() animation Callback
        slider.vars.before(slider);

        // SYNC:
        if (slider.syncExists && !fromNav) { methods.sync("animate"); }

        // CONTROLNAV
        if (slider.vars.controlNav) { methods.controlNav.active(); }

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) { slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide'); }

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (slider.vars.directionNav) { methods.directionNav.update(); }

        if (target === slider.last) {
          // API: end() of cycle Callback
          slider.vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!slider.vars.animationLoop) { slider.pause(); }
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            margin = slider.vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", slider.vars.animationSpeed);
          if (slider.transitions) {
            if (!slider.vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }

            // Unbind previous transitionEnd events and re-bind new transitionEnd event
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              clearTimeout(slider.ensureAnimationEnd);
              slider.wrapup(dimension);
            });

            // Insurance for the ever-so-fickle transitionEnd event
            clearTimeout(slider.ensureAnimationEnd);
            slider.ensureAnimationEnd = setTimeout(function() {
              slider.wrapup(dimension);
            }, slider.vars.animationSpeed + 100);

          } else {
            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
            //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
            slider.wrapup(dimension);
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) { methods.smoothHeight(slider.vars.animationSpeed); }
      }
    };
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      slider.vars.after(slider);
    };

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating && focused ) { slider.flexAnimate(slider.getTarget("next")); }
    };
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.animatedSlides = null;
      slider.playing = false;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) { methods.pausePlay.update("play"); }
      // SYNC:
      if (slider.syncExists) { methods.sync("pause"); }
    };
    // SLIDESHOW:
    slider.play = function() {
      if (slider.playing) { clearInterval(slider.animatedSlides); }
      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      slider.started = slider.playing = true;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) { methods.pausePlay.update("pause"); }
      // SYNC:
      if (slider.syncExists) { methods.sync("play"); }
    };
    // STOP:
    slider.stop = function () {
      slider.pause();
      slider.stopped = true;
    };
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (slider.vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    };
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    };

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());

            return (posCalc * -1) + "px";
          }());

      if (slider.transitions) {
        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
         slider.container.css("transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) { slider.container.css(slider.args); }

      slider.container.css('transform',target);
    };

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (slider.vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") { slider.container.find('.clone').remove(); }
          slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass('clone')).attr('aria-hidden', 'true'))
                          .prepend(methods.uniqueID(slider.slides.last().clone().addClass('clone')).attr('aria-hidden', 'true'));
        }
        slider.newSlides = $(slider.vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
            slider.newSlides.css({"width": slider.computedW, "marginRight" : slider.computedM, "float": "left", "display": "block"});
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) { methods.smoothHeight(); }
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
        if (type === "init") {
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
            if (slider.vars.fadeFirstSlide == false) {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).css({"opacity": 1});
            } else {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
            }
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) { methods.smoothHeight(); }
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) { slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide"); }

      //FlexSlider: init() Callback
      slider.vars.init(slider);
    };

    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = slider.vars.itemMargin,
          minItems = slider.vars.minItems,
          maxItems = slider.vars.maxItems;

      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = slider.vars.itemWidth + slideMargin;
        slider.itemM = slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

        slider.visible = Math.floor(slider.w/(slider.itemW));
        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.itemM = slideMargin;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
      slider.computedM = slider.itemM;
    };

    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (slider.vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (slider.vars.directionNav) { methods.directionNav.update(); }

    };

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      slider.vars.added(slider);
    };
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      slider.vars.removed(slider);
    };

    //FlexSlider: Initialize
    methods.init();
  };

  // Ensure the slider isn't focussed if the window loses focus.
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order
    fadeFirstSlide: true,           //Boolean: Fade in the first slide when animation type is "fade"
    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    pauseInvisible: true,   		//{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each slide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "",           //String: Set the text for the "previous" directionNav item
    nextText: "",               //String: Set the text for the "next" directionNav item

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    customDirectionNav: "",         //{NEW} jQuery Object/Selector: Custom prev / next button. Must be two jQuery elements. In order to make the events work they have to have the classes "prev" and "next" (plus namespace)
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
    init: function() {}             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
  };

  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) { options = {}; }

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

      if ( ( $slides.length === 1 && options.allowOneSlide === true ) || $slides.length === 0 ) {
          $slides.fadeIn(400);
          if (options.start) { options.start($this); }
        } else if ($this.data('flexslider') === undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "stop": $slider.stop(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") { $slider.flexAnimate(options, true); }
      }
    }
  };
})(jQuery);

/*
 *  jQuery OwlCarousel v1.3.3
 *
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owlgraphic.com/owlcarousel/
 *
 *  Licensed under MIT
 *
 */

/*JS Lint helpers: */
/*global dragMove: false, dragEnd: false, $, jQuery, alert, window, document */
/*jslint nomen: true, continue:true */

if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {

    var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"));
            base.$elem.data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = $(base.options.responsiveBaseWidth).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };

    $.fn.owlCarousel.options = {

        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
    };
}(jQuery, window, document));
$(window).ready(function() {
  $('.flexslider').flexslider({
    animation: "slide",
    controlNav: false
  });
});
(function(r){"object"===typeof exports&&"undefined"!==typeof module?module.exports=r():"function"===typeof define&&define.amd?define([],r):("undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:this).SmartBanner=r()})(function(){return function b(g,f,e){function c(d,n){if(!f[d]){if(!g[d]){var k="function"==typeof require&&require;if(!n&&k)return k(d,!0);if(a)return a(d,!0);k=Error("Cannot find module '"+d+"'");throw k.code="MODULE_NOT_FOUND",k;}k=f[d]=
{exports:{}};g[d][0].call(k.exports,function(a){var e=g[d][1][a];return c(e?e:a)},k,k.exports,b,g,f,e)}return f[d].exports}for(var a="function"==typeof require&&require,d=0;d<e.length;d++)c(e[d]);return c}({1:[function(b,g,f){var e=b("xtend/mutable"),c=b("component-query"),a=b("get-doc"),d=a&&a.documentElement,p=b("cookie-cutter"),n=b("ua-parser-js"),k=(navigator.language||navigator.userLanguage||navigator.browserLanguage).slice(-2)||"us",l={ios:{appMeta:"apple-itunes-app",iconRels:["apple-touch-icon-precomposed",
"apple-touch-icon"],getStoreLink:function(){return"https://itunes.apple.com/"+this.options.appStoreLanguage+"/app/id"+this.appId}},android:{appMeta:"google-play-app",iconRels:["android-touch-icon","apple-touch-icon-precomposed","apple-touch-icon"],getStoreLink:function(){return"http://play.google.com/store/apps/details?id="+this.appId}},windows:{appMeta:"msApplication-ID",iconRels:["windows-touch-icon","apple-touch-icon-precomposed","apple-touch-icon"],getStoreLink:function(){return"http://www.windowsphone.com/s?appid="+
this.appId}}};b=function(c){var a=n(navigator.userAgent);this.options=e({},{daysHidden:15,daysReminder:90,appStoreLanguage:k,button:"OPEN",store:{ios:"On the App Store",android:"In Google Play",windows:"In the Windows Store"},price:{ios:"FREE",android:"FREE",windows:"FREE"},theme:"",icon:"",force:""},c||{});this.options.force?this.type=this.options.force:"Windows Phone"===a.os.name||"Windows Mobile"===a.os.name?this.type="windows":"iOS"===a.os.name?this.type="ios":"Android"===a.os.name&&(this.type=
"android");!this.type||"ios"===this.type&&"Mobile Safari"===a.browser.name&&6<=parseInt(a.os.version)||navigator.standalone||p.get("smartbanner-closed")||p.get("smartbanner-installed")||(e(this,l[this.type]),this.parseAppId()&&(this.create(),this.show()))};b.prototype={constructor:b,create:function(){var d=this.getStoreLink(),e=this.options.price[this.type]+" - "+this.options.store[this.type],t;if(this.options.icon)t=this.options.icon;else for(var u=0;u<this.iconRels.length;u++){var v=c('link[rel="'+
this.iconRels[u]+'"]');if(v){t=v.getAttribute("href");break}}var b=a.createElement("div");b.className="smartbanner smartbanner-"+(this.options.theme||this.type);b.innerHTML='<div class="smartbanner-container"><a href="javascript:void(0);" class="smartbanner-close">&times;</a><span class="smartbanner-icon" style="background-image: url('+t+')"></span><div class="smartbanner-info"><div class="smartbanner-title">'+this.options.title+"</div><div>"+this.options.author+"</div><span>"+e+'</span></div><a href="'+
d+'" class="smartbanner-button"><span class="smartbanner-button-text">'+this.options.button+"</span></a></div>";a.body?a.body.appendChild(b):a&&a.addEventListener("DOMContentLoaded",function(){a.body.appendChild(b)});c(".smartbanner-button",b).addEventListener("click",this.install.bind(this),!1);c(".smartbanner-close",b).addEventListener("click",this.close.bind(this),!1)},hide:function(){d.classList.remove("smartbanner-show")},show:function(){d.classList.add("smartbanner-show")},close:function(){this.hide();
p.set("smartbanner-closed","true",{path:"/",expires:new Date(+new Date+864E5*this.options.daysHidden)})},install:function(){this.hide();p.set("smartbanner-installed","true",{path:"/",expires:new Date(+new Date+864E5*this.options.daysReminder)})},parseAppId:function(){var a=c('meta[name="'+this.appMeta+'"]');if(a)return this.appId="windows"===this.type?a.getAttribute("content"):/app-id=([^\s,]+)/.exec(a.getAttribute("content"))[1]}};g.exports=b},{"component-query":2,"cookie-cutter":3,"get-doc":4,"ua-parser-js":6,
"xtend/mutable":7}],2:[function(b,g,f){function e(c,a){return a.querySelector(c)}f=g.exports=function(c,a){a=a||document;return e(c,a)};f.all=function(c,a){a=a||document;return a.querySelectorAll(c)};f.engine=function(c){if(!c.one)throw Error(".one callback required");if(!c.all)throw Error(".all callback required");e=c.one;f.all=c.all;return f}},{}],3:[function(b,g,f){f=g.exports=function(e){e||(e={});"string"===typeof e&&(e={cookie:e});void 0===e.cookie&&(e.cookie="");return{get:function(c){for(var a=
e.cookie.split(/;\s*/),d=0;d<a.length;d++){var b=a[d].split("=");if(unescape(b[0])===c)return unescape(b[1])}},set:function(c,a,d){d||(d={});c=escape(c)+"="+escape(a);d.expires&&(c+="; expires="+d.expires);d.path&&(c+="; path="+escape(d.path));return e.cookie=c}}};"undefined"!==typeof document&&(b=f(document),f.get=b.get,f.set=b.set)},{}],4:[function(b,g,f){b=b("has-dom");g.exports=b()?document:null},{"has-dom":5}],5:[function(b,g,f){g.exports=function(){return"undefined"!==typeof window&&"undefined"!==
typeof document&&"function"===typeof document.createElement}},{}],6:[function(b,g,f){(function(e,c){var a={extend:function(a,c){for(var b in c)-1!=="browser cpu device engine os".indexOf(b)&&0===c[b].length%2&&(a[b]=c[b].concat(a[b]));return a},has:function(a,c){return"string"===typeof a?-1!==c.toLowerCase().indexOf(a.toLowerCase()):!1},lowerize:function(a){return a.toLowerCase()},major:function(a){return"string"===typeof a?a.split(".")[0]:c}},d=function(){for(var a,b=0,d,e,f,h,g,k,l=arguments;b<
l.length&&!g;){var n=l[b],m=l[b+1];if("undefined"===typeof a)for(f in a={},m)m.hasOwnProperty(f)&&(h=m[f],"object"===typeof h?a[h[0]]=c:a[h]=c);for(d=e=0;d<n.length&&!g;)if(g=n[d++].exec(this.getUA()))for(f=0;f<m.length;f++)k=g[++e],h=m[f],"object"===typeof h&&0<h.length?2==h.length?a[h[0]]="function"==typeof h[1]?h[1].call(this,k):h[1]:3==h.length?a[h[0]]="function"!==typeof h[1]||h[1].exec&&h[1].test?k?k.replace(h[1],h[2]):c:k?h[1].call(this,k,h[2]):c:4==h.length&&(a[h[0]]=k?h[3].call(this,k.replace(h[1],
h[2])):c):a[h]=k?k:c;b+=2}return a},b=function(b,d){for(var e in d)if("object"===typeof d[e]&&0<d[e].length)for(var f=0;f<d[e].length;f++){if(a.has(d[e][f],b))return"?"===e?c:e}else if(a.has(d[e],b))return"?"===e?c:e;return b},n={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2E3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2","8.1":"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},k={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,
/(opera)[\/\s]+([\w\.]+)/i],["name","version"],[/\s(opr)\/([\w\.]+)/i],[["name","Opera"],"version"],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]+)*/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i],["name","version"],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[["name","IE"],"version"],
[/(edge)\/((\d+)?[\w\.]+)/i],["name","version"],[/(yabrowser)\/([\w\.]+)/i],[["name","Yandex"],"version"],[/(comodo_dragon)\/([\w\.]+)/i],[["name",/_/g," "],"version"],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,/(qqbrowser)[\/\s]?([\w\.]+)/i],["name","version"],[/(uc\s?browser)[\/\s]?([\w\.]+)/i,/ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,/JUC.+(ucweb)[\/\s]?([\w\.]+)/i],[["name","UCBrowser"],"version"],[/(dolfin)\/([\w\.]+)/i],[["name","Dolphin"],"version"],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],
[["name","Chrome"],"version"],[/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],["version",["name","MIUI Browser"]],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],["version",["name","Android Browser"]],[/FBAV\/([\w\.]+);/i],["version",["name","Facebook"]],[/fxios\/([\w\.-]+)/i],["version",["name","Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],["version",["name","Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],["version","name"],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
["name",["version",b,{"1.0":"/8","1.2":"/1","1.3":"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],["name","version"],[/(navigator|netscape)\/([\w\.-]+)/i],[["name","Netscape"],"version"],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]+)*/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],["name","version"]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[["architecture","amd64"]],[/(ia32(?=;))/i],[["architecture",a.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[["architecture","ia32"]],[/windows\s(ce|mobile);\sppc;/i],[["architecture","arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[["architecture",/ower/,"",a.lowerize]],[/(sun4\w)[;\)]/i],[["architecture","sparc"]],
[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[["architecture",a.lowerize]]],device:[[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],["model","vendor",["type","tablet"]],[/applecoremedia\/[\w\.]+ \((ipad)/],["model",["vendor","Apple"],["type","tablet"]],[/(apple\s{0,1}tv)/i],[["model","Apple TV"],["vendor","Apple"]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],
["vendor","model",["type","tablet"]],[/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],["model",["vendor","Amazon"],["type","tablet"]],[/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],[["model",b,{"Fire Phone":["SD","KF"]}],["vendor","Amazon"],["type","mobile"]],[/\((ip[honed|\s\w*]+);.+(apple)/i],["model","vendor",["type","mobile"]],[/\((ip[honed|\s\w*]+);/i],["model",["vendor","Apple"],["type","mobile"]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],["vendor","model",["type","mobile"]],[/\(bb10;\s(\w+)/i],["model",["vendor","BlackBerry"],["type","mobile"]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i],["model",["vendor","Asus"],["type","tablet"]],[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[["vendor","Sony"],["model","Xperia Tablet"],["type","tablet"]],[/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],[["vendor","Sony"],["model","Xperia Phone"],["type",
"mobile"]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],["vendor","model",["type","console"]],[/android.+;\s(shield)\sbuild/i],["model",["vendor","Nvidia"],["type","console"]],[/(playstation\s[34portablevi]+)/i],["model",["vendor","Sony"],["type","console"]],[/(sprint\s(\w+))/i],[["vendor",b,{HTC:"APA",Sprint:"Sprint"}],["model",b,{"Evo Shift 4G":"7373KT"}],["type","mobile"]],[/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],["vendor","model",["type","tablet"]],[/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,/(zte)-(\w+)*/i,
/(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],["vendor",["model",/_/g," "],["type","mobile"]],[/(nexus\s9)/i],["model",["vendor","HTC"],["type","tablet"]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],["model",["vendor","Microsoft"],["type","console"]],[/(kin\.[onetw]{3})/i],[["model",/\./g," "],["vendor","Microsoft"],["type","mobile"]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w+)*/i,/(XT\d{3,4}) build\//i,/(nexus\s[6])/i],
["model",["vendor","Motorola"],["type","mobile"]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],["model",["vendor","Motorola"],["type","tablet"]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[["vendor","Samsung"],"model",["type","tablet"]],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,/sec-((sgh\w+))/i],[["vendor","Samsung"],"model",["type","mobile"]],[/(samsung);smarttv/i],["vendor","model",["type","smarttv"]],
[/\(dtv[\);].+(aquos)/i],["model",["vendor","Sharp"],["type","smarttv"]],[/sie-(\w+)*/i],["model",["vendor","Siemens"],["type","mobile"]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]+)*/i],[["vendor","Nokia"],"model",["type","mobile"]],[/android\s3\.[\s\w;-]{10}(a\d{3})/i],["model",["vendor","Acer"],["type","tablet"]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[["vendor","LG"],"model",["type","tablet"]],[/(lg) netcast\.tv/i],["vendor","model",["type","smarttv"]],[/(nexus\s[45])/i,
/lg[e;\s\/-]+(\w+)*/i],["model",["vendor","LG"],["type","mobile"]],[/android.+(ideatab[a-z0-9\-\s]+)/i],["model",["vendor","Lenovo"],["type","tablet"]],[/linux;.+((jolla));/i],["vendor","model",["type","mobile"]],[/((pebble))app\/[\d\.]+\s/i],["vendor","model",["type","wearable"]],[/android.+;\s(glass)\s\d/i],["model",["vendor","Google"],["type","wearable"]],[/android.+(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i],
[["model",/_/g," "],["vendor","Xiaomi"],["type","mobile"]],[/\s(tablet)[;\/\s]/i,/\s(mobile)[;\/\s]/i],[["type",a.lowerize],"vendor","model"]],engine:[[/windows.+\sedge\/([\w\.]+)/i],["version",["name","EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],["name","version"],[/rv\:([\w\.]+).*(gecko)/i],["version","name"]],os:[[/microsoft\s(windows)\s(vista|xp)/i],["name","version"],
[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],["name",["version",b,n]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[["name","Windows"],["version",b,n]],[/\((bb)(10);/i],[["name","BlackBerry"],"version"],[/(blackberry)\w*\/?([\w\.]+)*/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,/linux;.+(sailfish);/i],["name","version"],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
[["name","Symbian"],"version"],[/\((series40);/i],["name"],[/mozilla.+\(mobile;.+gecko.+firefox/i],[["name","Firefox OS"],"version"],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w+)*/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,/(hurd|linux)\s?([\w\.]+)*/i,/(gnu)\s?([\w\.]+)*/i],["name","version"],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[["name","Chromium OS"],
"version"],[/(sunos)\s?([\w\.]+\d)*/i],[["name","Solaris"],"version"],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],["name","version"],[/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i],[["name","iOS"],["version",/_/g,"."]],[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i,/(macintosh|mac(?=_powerpc)\s)/i],[["name","Mac OS"],["version",/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,/(haiku)\s(\w+)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
/(unix)\s?([\w\.]+)*/i],["name","version"]]},l=function(b,c){if(!(this instanceof l))return(new l(b,c)).getResult();var f=b||(e&&e.navigator&&e.navigator.userAgent?e.navigator.userAgent:""),g=c?a.extend(k,c):k;this.getBrowser=function(){var b=d.apply(this,g.browser);b.major=a.major(b.version);return b};this.getCPU=function(){return d.apply(this,g.cpu)};this.getDevice=function(){return d.apply(this,g.device)};this.getEngine=function(){return d.apply(this,g.engine)};this.getOS=function(){return d.apply(this,
g.os)};this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}};this.getUA=function(){return f};this.setUA=function(a){f=a;return this};this.setUA(f);return this};l.VERSION="0.7.10";l.BROWSER={NAME:"name",MAJOR:"major",VERSION:"version"};l.CPU={ARCHITECTURE:"architecture"};l.DEVICE={MODEL:"model",VENDOR:"vendor",TYPE:"type",CONSOLE:"console",MOBILE:"mobile",SMARTTV:"smarttv",TABLET:"tablet",WEARABLE:"wearable",
EMBEDDED:"embedded"};l.ENGINE={NAME:"name",VERSION:"version"};l.OS={NAME:"name",VERSION:"version"};"undefined"!==typeof f?("undefined"!==typeof g&&g.exports&&(f=g.exports=l),f.UAParser=l):e.UAParser=l;var m=e.jQuery||e.Zepto;if("undefined"!==typeof m){var q=new l;m.ua=q.getResult();m.ua.get=function(){return q.getUA()};m.ua.set=function(a){q.setUA(a);a=q.getResult();for(var b in a)m.ua[b]=a[b]}}})("object"===typeof window?window:this)},{}],7:[function(b,g,f){g.exports=function(b){for(var c=1;c<arguments.length;c++){var a=
arguments[c],d;for(d in a)a.hasOwnProperty(d)&&(b[d]=a[d])}return b}},{}]},{},[1])(1)});

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
//# sourceMappingURL=maps/app.js.map