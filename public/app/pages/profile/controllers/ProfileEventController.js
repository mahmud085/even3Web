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
