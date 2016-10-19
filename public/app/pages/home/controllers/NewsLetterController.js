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
