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
