(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EventController', ["$scope", "$state", "httpService", "$route", "shareData", EventController]);

    function EventController($scope, $state, httpService, $route, shareData) {
        $scope.$state = $state;
        var eventData = [];
        var sortedEventData = [];
        var date = new Date().getTime();
        $scope.eventList = [];
        $scope.beg = 0;
        $scope.end = 4;

        // get RSVP list 
        function getRsvpList() {
            for (var i = 0; i < $scope.eventList.length; i++) {
                var filter = "?filter[where][EventId]=" + $scope.eventList[i].id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
                (function (i) {
                    $scope.eventPromise = httpService.getData('Participants', filter, $scope.userInfo.id)
                        .then(function (response) {
                            if (response.length > 0) {
                                var tempObj = response[0];
                                if (tempObj.Rsvp === 2) {
                                    $scope.eventList[i].RsvpValue = "Going";
                                    $scope.eventList[i].RsvpId = tempObj.id;
                                }
                                if (tempObj.Rsvp === 1) {
                                    $scope.eventList[i].RsvpValue = "Ignore";
                                    $scope.eventList[i].RsvpId = tempObj.id;
                                }
                            }
                        })
                })(i);
            }
        }
        // find all events
        $scope.getEventList = function (sort) {
            var filter = "?filter[include]=account" + "&filter[where][StartDate][gt]=" + date + "&filter[where][status]=public" + "&filter[include]=tickets";
            $scope.eventPromise = httpService.getData("Events", filter)
                .then(function (data) {
                    var currentData = data.filter(function(event, index) {
                        if (index < 4) return event;
                    });
                    if (sort) $scope.eventList =  currentData.sort(sortByDate);
                    else $scope.eventList =  currentData;

                    for (var i = 0; i < $scope.eventList.length; i++) {
                        $scope.eventList[i].RsvpValue = "RSVP";
                        if ($scope.eventList[i].tickets.length > 0) {
                            var currency = $scope.eventList[i].tickets[0].currency;
                            $scope.eventList[i].currencySymbol = $scope.currencySymbolList[currency];
                        }
                    }
                    if ($scope.loggedIn) {
                        getRsvpList();
                    }
                }
                , function (err) {
                    console.log(err);
                });
        }
        $scope.getEventList(true);

        // load more events when Load more button is clicked 
        $scope.$on('search', function () {
            $scope.eventList = [];
            $scope.eventList = shareData.getEvent();
            for (var i = 0; i < $scope.eventList.length; i++) {
                $scope.eventList[i].RsvpValue = "RSVP";
                if ($scope.eventList[i].tickets.length > 0) {
                    var currency = $scope.eventList[i].tickets[0].currency;
                    $scope.eventList[i].currencySymbol = $scope.currencySymbolList[currency];
                }
            }
            if ($scope.loggedIn) {
                getRsvpList();
            }
        });

        function sortByDate(a, b) {
            var aDate = a.StartDate - date;
            var bDate = b.StartDate - date;
            if (aDate < bDate) return -1;
            if (aDate > bDate) return 1;

            return 0;
        }

    }
})();
