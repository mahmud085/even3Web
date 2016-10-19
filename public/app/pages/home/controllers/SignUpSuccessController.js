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
