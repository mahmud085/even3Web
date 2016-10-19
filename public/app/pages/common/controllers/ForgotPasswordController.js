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