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