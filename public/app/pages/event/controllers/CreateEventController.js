(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CreateEventController', ["$scope", "httpService", "$http", "shareData", "$mdpTimePicker", "$uibModal", "$state", "prerenderService", CreateEventController])

    function CreateEventController($scope, httpService, $http, shareData, $mdpTimePicker, $uibModal, $state, prerenderService) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCuPr_PsYccfO9CDnEflllkcFcbMurXRUg&q=&address=';

        $scope.alert = false;
        $scope.err_msg = "";
        $scope.alertTime1 = false;
        $scope.alertTime2 = false;
        $scope.picErr = false;
        $scope.emailAlert = false;
        $scope.time_msg1 = "";
        $scope.time_msg2 = "";
        var dt = new Date();
        var currDate = dt.getDate();
        var currMonth = dt.getMonth();
        var currYear = dt.getFullYear();
        $scope.dateError1 = false;
        $scope.dateError2 = false;
        $scope.StartDate = '';
        $scope.EndDate = '';
        $scope.event = {
            priceType: 'free',
            tickets: [],
            status: 'public',
            StartDate: '',
            EndDate: '',
            Name: '',
            Description: '',
            EventCategoryId: '',
            email: '',
            Phone: '',
            Website: ''
        };
        $scope.Address = '';
        $scope.location = {};

        // get event categories 
        $scope.getEventCategory = function () {
            httpService.getData('EventCategories', '')
                .then(function (res) {
                    $scope.eventCategoryList = res;
                }
                , function (err) {
                    console.log(err);
                })
        }
        $scope.getEventCategory();

        // watch address variable always
        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (response) {
                    $scope.addressList = response.data.results;
                })
        })

        // check start date . if start date is previus then the current date show error
        $scope.checkDate1 = function (date) {
            var timeStamp = new Date(date).toISOString();
            $scope.event.StartDate = new Date(timeStamp).getTime();
            var eventDate = new Date($scope.event.StartDate).getDate();
            var eventMonth = new Date($scope.event.StartDate).getMonth();
            var eventYear = new Date($scope.event.StartDate).getFullYear();
            if (eventYear < currYear) {
                $scope.dateError1 = true;
                $scope.StartDate = '';
                return
            } else if (eventYear === currYear) {
                if (eventMonth < currMonth) {
                    $scope.dateError1 = true;
                    $scope.StartDate = '';
                    return
                } else if (eventMonth === currMonth) {
                    if (eventDate < currDate) {
                        $scope.dateError1 = true;
                        $scope.StartDate = '';
                        return
                    } else {
                        $scope.dateError1 = false;
                    }
                } else {
                    $scope.dateError1 = false;
                }
            } else {
                $scope.dateError1 = false;
            }
        }
        /* check finish date and show error when below condition is not satisfied*/
        $scope.checkDate2 = function (date) {
            var timeStamp = new Date(date).toISOString();
            $scope.event.EndDate = new Date(timeStamp).getTime();
            var eventDate = new Date($scope.event.StartDate).getDate();
            var eventMonth = new Date($scope.event.StartDate).getMonth();
            var eventYear = new Date($scope.event.StartDate).getFullYear();
            var endDate = new Date($scope.event.EndDate).getDate();
            var endMonth = new Date($scope.event.EndDate).getMonth();
            var endYear = new Date($scope.event.EndDate).getFullYear();
            if ($scope.StartDate === '') {
                $scope.dateError2 = true;
                $scope.date_err_msg = "Choose Event Start Date First";
                $scope.EndDate = '';
                return;
            }
            if (endYear < eventYear) {
                $scope.dateError2 = true;
                $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                $scope.EndDate = '';
                return;
            } else if (endYear === eventYear) {
                if (endMonth < eventMonth) {
                    $scope.dateError2 = true;
                    $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                    $scope.EndDate = '';
                    return;
                } else if (endMonth === eventMonth) {
                    if (endDate < eventDate) {
                        $scope.dateError2 = true;
                        $scope.date_err_msg = "Finish Date Can Not Previous than Start Date ";
                        $scope.EndDate = '';
                        return;
                    } else {
                        $scope.dateError2 = false;
                        return;
                    }
                } else {
                    $scope.dateError2 = false;
                    return;
                }
            } else {
                $scope.dateError2 = false;
                return;
            }
        }

        /* watch StartTime always if any change has occurred in startTime this will execute*/
        $scope.$watch('StartTime', function () {
            if ($scope.StartTime !== undefined) {
                if ($scope.StartDate !== '') {
                    $scope.event.StartDate += $scope.StartTime.getHours() * 3600 * 1000 + $scope.StartTime.getMinutes() * 60 * 1000 + $scope.StartTime.getSeconds() * 1000;
                    $scope.alertTime1 = false;
                    $scope.time_msg1 = "";
                } else {
                    $scope.alertTime1 = true;
                    $scope.time_msg1 = "Set Event Start Date First";
                    $scope.StartTime = "";
                }
            }
        })

        /* check finish time. if finish time is earlier then start time or start date
         show error
         */
        $scope.checkTime2 = function () {
            if ($scope.EndDate !== "") {
                if ($scope.StartTime !== undefined) {
                    var startHour = $scope.StartTime.getHours();
                    var startMinute = $scope.StartTime.getMinutes();
                    var endHour = $scope.EndTime.getHours();
                    var endMinute = $scope.EndTime.getMinutes();
                    if (endHour < startHour) {
                        $scope.alertTime2 = true;
                        $scope.time_msg2 = "Check Your Start Time and End Time";
                        $scope.EndTime = "";
                        return;
                    } else if (endHour === startHour) {
                        if (endMinute < startMinute) {
                            $scope.alertTime2 = true;
                            $scope.time_msg2 = "Check Your Start Time and End Time";
                            $scope.EndTime = "";
                            return;
                        } else {
                            $scope.alertTime2 = false;
                            $scope.event.EndDate += $scope.EndTime.getHours() * 3600 * 1000 + $scope.EndTime.getMinutes() * 60 * 1000 + $scope.EndTime.getSeconds() * 1000;
                            return;
                        }
                    } else {
                        $scope.event.EndDate += $scope.EndTime.getHours() * 3600 * 1000 + $scope.EndTime.getMinutes() * 60 * 1000 + $scope.EndTime.getSeconds() * 1000;
                        $scope.alertTime2 = false;
                        return;
                    }
                } else {
                    $scope.alertTime2 = true;
                    $scope.time_msg2 = "Set Event Start Time First";
                    $scope.EndTime = "";
                    return;
                }
            } else {
                $scope.alertTime2 = true;
                $scope.time_msg2 = "Set Event Finish Date First";
                $scope.EndTime = "";
                return;
            }
        }

        $scope.pic = null;
        $scope.croppedPic = null;
        $scope.crop = '';

        // remove the picture/image
        $scope.removePic = function () {
            $scope.pic = null;
            $scope.event.file = '';
        }

        // check image size
        $scope.checkPic = function (pic) {
            if ((pic.size / 1048576) > 1.00) {
                $scope.picErr = true;
                $scope.pic = null;
                $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
            } else {
                $scope.picErr = false;
                $scope.picErrMsg = ""
            }
        }

        // validate the email by using regular expression
        $scope.validateEmail = function (email) {
            var re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            if (!re.test(email)) {
                $scope.emailAlert = true;
                $scope.emailAlertMsg = "Not a valid Email";
            } else {
                $scope.emailAlert = false;
            }
        }

        /* create the event.check if any field is null or not. after successfull
         creation open a success modal from which event can be shared
         */
        $scope.createEvent = function (event) {
            for (var key in event) {
                if (event[key] === '') {
                    if ((key === 'Phone') || (key === 'Website') || (key === 'email')) {
                        continue;
                    } else {
                        $scope.alert = true;
                        $scope.err_msg = "Event " + key + " is not Defined";
                        return;
                    }
                }
            }

            if (event.tickets.length > 0) {
                for (var i = 0; i < event.tickets.length; i++) {
                    delete event.tickets[i].$$hashKey;
                    if ((event.tickets[i].price === undefined) || (event.tickets[i].currency === undefined) || (event.tickets[i].available === undefined)) {
                        $scope.alert = true;
                        $scope.err_msg = "Ticket is not Defined Properly";
                        return;
                    } else {
                        $scope.alert = false;
                    }
                }
            }
            if ($scope.croppedPic !== null) {
                var byteString = atob($scope.croppedPic.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                event.file = new Blob([ab], { type: 'image/png' });
            }
            event.AccountId = $scope.userInfo.userId;
            if ($scope.Address !== '') {
                event.Address = $scope.addressList[0].formatted_address;
                event.LocationLat = $scope.addressList[0].geometry.location.lat;
                event.LocationLong = $scope.addressList[0].geometry.location.lng;
            } else {
                $scope.alert = true;
                $scope.err_msg = "Event Address is not Defined";
                return;
            }
            
            $scope.createEventPromise = httpService.postMultiData('Events/newEvent', event, $scope.userInfo.id)
                .then(function (response) {
                    if (event.priceType === 'paid') {
                        for (var i = 0; i < event.tickets.length; i++) {
                            (function (i) {
                                var obj = {
                                    Price: event.tickets[i].price,
                                    currency: event.tickets[i].currency,
                                    Available: event.tickets[i].available,
                                    SoldTicket: 0,
                                    EventId: response.id
                                };
                                httpService.postData(obj, 'Tickets', $scope.userInfo)
                                    .then(function (data) {
                                        
                                    })
                            })(i);
                        }
                    }
                    $scope.show(2);
                    var eventId = response.id;
                    var url = "http://www.even3app.com/" + $state.href('Main.Event.Detail.Info', { id: eventId });

                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'app/pages/event/templates/event-success-modal.html',
                        controller: 'EventSuccessModalController',
                        size: 'sm',
                        resolve: {
                            eventUrl: function () {
                                return url;
                            }
                        }
                    });

                     prerenderService.recache(eventId, 'event');
                });
        }
                 
        
    }
})();
