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