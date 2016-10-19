(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EventDetailController', ["$scope", "$stateParams", "httpService", "$interval", "$http", "$sce", "$state", "$uibModal", EventDetailController])

    function EventDetailController($scope, $stateParams, httpService, $interval, $http, $sce, $state, $uibModal) {
        var WEATHER_URL = "https://api.forecast.io/forecast/095db319e3486519e02c46e2b596cc81/";
        var geoUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCuPr_PsYccfO9CDnEflllkcFcbMurXRUg&q=";
        $scope.eventDetail = {};
        $scope.weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.commentList = [];
        $scope.CommentBody = "";
        $scope.user = {};
        $scope.weather = {};
        $scope.showRSVP = true;
        var d = new Date();
        var id = $stateParams.id;
        $scope.eventId = id;

        /* get event detail */
        $scope.getEventDetail = function () {
            var filter = "?filter[where][id]=" + id + "&filter[include]=account" + "&filter[include]=tickets";

            $scope.eventDetailPromise = httpService.getData('Events', filter)
                .then(function (res) {
                    $scope.eventDetail = res[0];
                    if ($scope.eventDetail.tickets.length > 0) {
                        for (var i = 0; i < $scope.eventDetail.tickets.length; i++) {
                            $scope.eventDetail.tickets[i].currencySymbol = $scope.currencySymbolList[$scope.eventDetail.tickets[i].currency];
                        }
                    }
                    $scope.geoSrc = $sce.trustAsResourceUrl(geoUrl + $scope.eventDetail.Address);
                    if ($scope.loggedIn) {
                        if ($scope.eventDetail.AccountId === $scope.userInfo.userId) {
                            $scope.showRSVP = false;
                            $scope.ownEvent = true;
                        } else {
                            $scope.ownEvent = false;
                            getRSVP();
                        }
                    }
                    if ($scope.eventDetail.StartDate < d.getTime()) {
                        $scope.showRSVP = false;
                    }
                    $scope.map = {
                        center: {
                            latitude: $scope.eventDetail.Location.lat,
                            longitude: $scope.eventDetail.Location.lng
                        },
                        zoom: 8
                    };
                    $scope.marker = {
                        id: 0,
                        coords: {
                            latitude: $scope.eventDetail.Location.lat,
                            longitude: $scope.eventDetail.Location.lng
                        }
                    };
                    var dd = Math.floor(d.getTime() / 1000);
                    $http({
                        method: "jsonp",
                        url: WEATHER_URL + $scope.eventDetail.Location.lat + "," + $scope.eventDetail.Location.lng + "," + dd,
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        },
                        params: {
                            format: 'jsonp',
                            callback: 'JSON_CALLBACK'
                        }
                    })
                        .then(function (res) {
                            $scope.weather = res.data;
                            $scope.weatherIcon = "images/weather/" + $scope.weather.currently.icon + ".jpg";
                            $scope.temperature = (($scope.weather.currently.temperature - 32) / 1.8);

                        },
                        function (err) {
                            console.log(err);
                        })
                }
                , function (err) {
                    console.log(err);
                })
        }
        $scope.getEventDetail();

        /* get all comments in the event */
        function getComments() {
            var filter = "?filter[include]=account" + "&filter[where][EventId]=" + id;
            httpService.getData("EventComments", filter, "")
                .then(function (res) {
                    $scope.commentList = res;
                }
                , function (err) {
                    console.log(err);
                })
        }

        /* get the new comment */
        function getNewComments() {
            var filter = "?filter[include]=account" + "&filter[where][EventId]=" + id;
            httpService.getData("EventComments", filter, "")
                .then(function (res) {
                    if (res.length !== $scope.commentList.length) {
                        $scope.commentList = res;
                    }
                }
                , function (err) {
                    console.log(err);
                })
        }
        getComments();
        var commentPromice = $interval(getNewComments, 2000);
        $scope.$on("$destroy", function () {
            if (commentPromice) {
                $interval.cancel(commentPromice);
            }
        });

        // add a comment
        $scope.addComment = function (comment) {
            if (comment.length === 0) {
                alert('Can not post EMPTY Comment');
            }
            else {
                $scope.CommentBody = "";
                var obj = {};
                obj.Time = new Date().getTime();
                obj.CommentBody = comment;
                obj.EventId = id;
                obj.Id = $scope.userInfo.userId;
                httpService.postMultiData('EventComments/addcomment', obj, $scope.userInfo.id);
            }
        }

        $scope.going = false;
        $scope.ignore = false;

        // get rsvp for participants
        function getRSVP() {
            $scope.showRSVP = true;
            var filter = "?filter[where][EventId]=" + id + "&filter[where][AccountId]=" + $scope.userInfo.userId;

            httpService.getData('Participants', filter, $scope.userInfo.id)
                .then(function (res) {
                    $scope.rsvpList = res;
                    if ($scope.rsvpList.length > 0) {
                        if ($scope.rsvpList[0].Rsvp === 1) {
                            $scope.going = false;
                            $scope.ignore = true;
                        }
                        else if ($scope.rsvpList[0].Rsvp === 2) {
                            $scope.going = true;
                            $scope.ignore = false;
                        }
                    }
                },
                function (err) {
                    console.log(err);
                })
        }

        // set rsvp for participants
        $scope.setRSVP = function (state) {
            if ($scope.loggedIn) {
                var filter = "?filter[where][EventId]=" + id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
                httpService.getData('Participants', filter, $scope.userInfo.id)
                    .then(function (res) {
                        $scope.rsvpList = res;
                    })
                if (state === 1) {
                    $scope.going = false;
                    $scope.ignore = true;
                } else {
                    $scope.going = true;
                    $scope.ignore = false;
                }
                var obj = {};
                obj.Invited = false;
                obj.Rsvp = state;
                obj.EventId = id;
                obj.AccountId = $scope.userAccInfo.id;
                if ($scope.eventDetail.tickets.length === 0) {
                    if ($scope.rsvpList.length === 0) {
                        $scope.rsvpPromise = httpService.postData(obj, 'Participants', $scope.userInfo.id);
                    } else {
                        $scope.rsvpPromise = httpService.putData(obj, 'Participants', $scope.userInfo.id, $scope.rsvpList[0].id);
                    }
                } else {
                    if (state === 2) {
                        $state.go('Main.Event.Detail.Cart', { id: id });
                    } else {
                        if ($scope.rsvpList.length === 0) {
                            $scope.rsvpPromise = httpService.postData(obj, 'Participants', $scope.userInfo.id);
                        } else {
                            $scope.rsvpPromise = httpService.putData(obj, 'Participants', $scope.userInfo.id, $scope.rsvpList[0].id)
                                .then(function (response) {
                                    
                                });
                        }
                    }
                }
            } else {
                $state.go('Main.Login');
            }
        }

        // delete the entire event
        $scope.deleteEvent = function () {
            var cnfrm = confirm("Are you Sure to Delete your Event?");
            if (cnfrm) {
                httpService.deleteData('Events', $scope.userInfo.id, id)
                    .then(function (response) {
                        $state.go('Main.Search');
                    }, function (err) {
                        console.log(err);
                    })
            }
        }

    }
})();
