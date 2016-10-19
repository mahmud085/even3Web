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
