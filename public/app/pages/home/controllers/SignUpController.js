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
