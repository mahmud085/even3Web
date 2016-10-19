(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EditEventController', ["$scope", "$state", "httpService", "$stateParams", "$http", "prerenderService", EditEventController])

    function EditEventController($scope, $state, httpService, $stateParams, $http, prerenderService) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCuPr_PsYccfO9CDnEflllkcFcbMurXRUg&q=&address=';

        var id = $stateParams.id;
        $scope.event = {};
        var dt = new Date();
        var currDate = dt.getDate();
        var currMonth = dt.getMonth();
        var currYear = dt.getFullYear();
        $scope.showImageInput = false;
        $scope.showImage = false;
        $scope.OwnBusiness = false;

        // check startdate
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

        // check finish date     
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

        // check start time
        $scope.checkTime1 = function () {
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
        }

        // check finish time
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
        $scope.event.file = null;
        $scope.croppedPic = '';

        // remove image
        $scope.removeImage = function () {
            $scope.showImageInput = true;
            $scope.showImage = false;
            $scope.event.EventPicture = '';
        }

        // remove image
        $scope.removePic = function () {
            $scope.pic = null;
            $scope.croppedPic = '';
        }


        // check the image size
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

        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        function getDateTime(StartDate, EndDate) {
            StartDate = new Date(StartDate);
            EndDate = new Date(EndDate);
            var startDay = StartDate.getDate();
            var startMonth = StartDate.getMonth();
            var startYear = StartDate.getFullYear();
            var endDay = EndDate.getDate();
            var endMonth = EndDate.getMonth();
            var endYear = EndDate.getFullYear();
            $scope.StartDate = month[startMonth] + "-" + startDay + "-" + startYear;
            $scope.EndDate = month[endMonth] + "-" + endDay + "-" + endYear;
            $scope.StartTime = StartDate;
            $scope.EndTime = EndDate;
        }

        // get the event detail that are going to be edited
        $scope.getEventDetail = function () {
            var filter = "?filter[where][id]=" + id + "&filter[include]=tickets" + "&filter[include]=account";
            httpService.getData('Events', filter, '')
                .then(function (response) {
                    if (response[0].AccountId === $scope.userInfo.userId) {
                        $scope.OwnBusiness = true;
                        $scope.event = response[0];
                        if ($scope.event.EventPicture === undefined) {
                            $scope.showImageInput = true;
                            $scope.showImage = false;
                        } else {
                            $scope.showImageInput = false;
                            $scope.showImage = true;
                        }
                        getDateTime($scope.event.StartDate, $scope.event.EndDate);
                        $scope.Address = $scope.event.Address;
                        if ($scope.event.EventPicture !== undefined) {
                            //generateBlob($scope.baseurl + $scope.event.EventPicture);
                        }
                        if ($scope.event.tickets.length === 0) {
                            $scope.event.priceType = 'free';
                        } else {
                            $scope.event.priceType = 'paid';
                        }
                    } else {
                        $scope.OwnBusiness = false;
                    }
                },
                function (err) {
                    console.log(err);
                })
        }
        $scope.getEventDetail();

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

        // watch address variable always.if any change is made this will execute instantly
        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (responce) {
                    $scope.addressList = responce.data.results;
                })
        });

        // edit the event and save it
        $scope.editEvent = function () {
           // debugger;
            if ($scope.OwnBusiness) {
                $scope.event.Id = id;
                $scope.event.AccountId = $scope.userInfo.userId;
                if ($scope.Address !== '') {
                    $scope.event.Address = $scope.addressList[0].formatted_address;
                    $scope.event.LocationLat = $scope.addressList[0].geometry.location.lat;
                    $scope.event.LocationLong = $scope.addressList[0].geometry.location.lng;
                }
                else {
                    $scope.alert = true;
                    $scope.err_msg = "Event Address is not Defined";
                    return;
                }

                for (var key in $scope.event) {
                    if ($scope.event[key] === '') {
                        if ((key === 'Phone') || (key === 'Website') || (key === 'email') || ( key === 'file') || (key === 'EventPicture')) {
                            continue;
                        }
                        
                            $scope.alert = true;
                            $scope.err_msg = "Event " + key + " is not Defined";
                        
                        return;
                    }
                }
                delete $scope.event.$$hashKey;

                if ($scope.croppedPic !== '') {
                    var byteString = atob($scope.croppedPic.split(',')[1]);
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    $scope.event.file = new Blob([ab], { type: 'image/png' });
                }

                httpService.postMultiData('Events/editevent', $scope.event, $scope.userInfo.id)
                    .then(function (response) {
                        prerenderService.recache(response.id, 'event');
                        $state.go('Main.Profile.Event');
                    }, function (err) {
                        console.log(err);
                    });
            }
        }

        // save ticket price and availability
        $scope.saveTicket = function (ticket, index) {
            if ($scope.OwnBusiness) {
                if (ticket.id === undefined) {
                    ticket.EventId = id;
                    if ((ticket.Price === undefined) || (ticket.currency === undefined) || (ticket.Available === undefined)) {
                        alert("undefined Fill Up All The Fields");
                    } else {
                        delete ticket.$$hashKey;
                        httpService.postData(ticket, 'Tickets', $scope.userInfo.id);
                    }
                } else {
                    if ((ticket.Price === '') || (ticket.currency === '') || (ticket.Available === '')) {
                        alert("defined Fill Up All The Fields");
                    } else {
                        delete ticket.$$hashKey;
                        httpService.putData(ticket, 'Tickets', $scope.userInfo.id, ticket.id);
                    }
                }
            }
        }

        // delete ticket price and availability option
        $scope.deleteTicket = function (ticket, index) {
            if ($scope.OwnBusiness) {
                if (ticket.id === undefined) {
                    $scope.event.tickets.splice(index, 1);
                } else {
                    var r = confirm("Do You Really Want to Delete This?");
                    if (r) {
                        httpService.deleteData('Tickets', $scope.userInfo.id, ticket.id);
                        $scope.event.tickets.splice(index, 1);
                    }
                }
            }
        }

    }
})();
