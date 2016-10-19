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
