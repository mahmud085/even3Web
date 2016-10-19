(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SearchController', ["$scope", "$rootScope", "httpService", "$http", "shareData", "$uibModal", "$state", SearchController])

    function SearchController($scope, $rootScope, httpService, $http, shareData, $uibModal, $state) {
        $scope.Name = '';
        $scope.Address = '';
        $scope.addressList = [];
        $scope.markers = [];
        $scope.events = [];
        $scope.businesses = [];
        $scope.eventList = [];
        $scope.businessList = [];
        $scope.eventCategoryList = [];
        $scope.businessCategoryList = [];
        $scope.tickets = [];
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        $scope.beg = 0;
        $scope.end = 6;
        $scope.items = [1, 2, 3, 4, 5];
        var date = new Date().getTime();

        $rootScope.$on('getCategory', function (event, categoryId) {
            httpService.getData('EventCategories', "")
                .then(function (list) {
                    $scope.eventCategoryList = list;

                    $scope.EventCategoryId = categoryId;
                    $scope.eventCatId = $scope.EventCategoryId;
                    $scope.filterResult();
                }
                , function (error) {
                    console.log(error);
                })
        });

        $scope.$on('$destroy', function () {
            $rootScope.$emit('changeFooterClass', '');
        });

        // get map for Lagos
        function getMap(lat, lng) {
            $scope.map = {
                center: {
                    latitude: lat,
                    longitude: lng
                },
                zoom: 13
            };
        }

        // get map markers
        function getMarkers(obj) {
            $scope.markers = [];
            for (var i = 0; i < obj.length; i++) {
                var temp = {
                    latitude: obj[i].Location.lat,
                    longitude: obj[i].Location.lng,
                    "id": i
                }
                $scope.markers.push(temp);
            }
        }

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var R = 6371; // metres
            var φ1 = deg2rad(lat1);
            var φ2 = deg2rad(lat2);
            var Δφ = deg2rad(lat2 - lat1);
            var Δλ = deg2rad(lon2 - lon1);

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var d = R * c;
            return d;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }

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
                            } else {
                                $scope.eventList[i].RsvpValue = "RSVP";
                                $scope.eventList[i].RsvpId = '';
                            }
                        })
                })(i);
            }
        }

        // get all event list
        $scope.getEventList = function (name) {
            $scope.end = 4;
            var filter = "?filter[include]=account" + "&filter[where][StartDate][gt]=" + date + "&filter[where][status]=public" + "&filter[include]=tickets";
            if (name !== undefined) {
                filter = '?filter={"where":{"Name":{"like":"' + name + '","options":"i"}}}';
            }
            $scope.eventPromise = httpService.getData("Events", filter, "")
                .then(function (data) {
                    $scope.events = data;
                    $scope.eventList = [];
                    $scope.eventList = $scope.events;
                    if ($scope.eventList.length) {
                        $rootScope.$emit('changeFooterClass', '');
                    }
                    for (var i = 0; i < $scope.eventList.length; i++) {
                        $scope.tickets.push($scope.eventList[i].tickets);
                        $scope.eventList[i].RsvpValue = "RSVP";
                        if ($scope.eventList[i].tickets.length > 0) {
                            var currency = $scope.eventList[i].tickets[0].currency;
                            $scope.eventList[i].currencySymbol = $scope.currencySymbolList[currency];
                        }
                    }

                    if ($scope.showData === 1) {
                        getMap($scope.eventList[0].Location.lat, $scope.eventList[0].Location.lng);
                        getMarkers($scope.eventList);
                    }
                    if ($scope.loggedIn) {
                        getRsvpList();
                    }
                },
                function (err) {
                    console.log(err);
                });
        }
        $scope.getEventList();

        // get rating of the business
        function getRating(arr) {
            var filter = "?filter[where][BusinessId]="
            for (var i = 0; i < arr.length; i++) {
                (function (i) {
                    $scope.businessPromise = httpService.getData('ratings', filter + arr[i], '')
                        .then(function (data) {
                            $scope.rateArr = data;
                            if ($scope.rateArr.length === 0 || $scope.rateArr === undefined) {
                                $scope.businessList[i].ratingNum = 0;
                            } else {
                                var total = $scope.rateArr.reduce(function (prev, curr) {
                                    return prev + curr.value;
                                }, 0);
                                $scope.businessList[i].ratingNum = Math.floor(total / ($scope.rateArr.length))
                            }
                        },
                        function (err) {
                            console.log(err);
                        })
                })(i)
            }
        }

        // get saved business for an user
        function getSaveBusiness() {
            for (var i = 0; i < $scope.businessList.length; i++) {
                (function (i) {
                    var filter = "?filter[where][BusinessId]=" + $scope.businessList[i].id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
                    $scope.businessPromise = httpService.getData('savedBusinesses', filter, $scope.userInfo.id)
                        .then(function (data) {
                            if (data.length > 0) {
                                $scope.businessList[i].buttonValue = 'SAVED';
                                $scope.businessList[i].buttonDisabled = true;
                            }
                        },
                        function (err) {
                            console.log(err);
                        });
                })(i)
            }
        }

        // save a business
        $scope.saveBussiness = function (id) {
            if (!$scope.loggedIn) {
                $state.go('Main.Login');
            } else {
                if (!$scope.businessList[id].buttonDisabled) {
                    var obj = {
                        BusinessId: $scope.businessList[id].id,
                        AccountId: $scope.userInfo.userId,
                    }

                    $scope.saveBusinessPromise = httpService.postData(obj, 'savedBusinesses', $scope.userInfo.id)
                        .then(function () {
                            $scope.businessList[id].buttonValue = "SAVED";
                            $scope.businessList[id].buttonDisabled = true;
                        });
                }
            }
        }

        // get business list
        $scope.getBusinessList = function (name) {
            $scope.end = 4;
            var filter = "?filter[include]=account" + "&filter[include]=services";
            if (name !== undefined) {
                filter = '&filter={"where":{"Name":{"like":"' + name + '","options":"i"}}}';
            }
            $scope.businessPromise = httpService.getData("Businesses", filter)
                .then(function (data) {
                    $scope.businesses = data;
                    $scope.businessList = [];
                    for (var key in $scope.businesses) {
                        $scope.businessList[key] = $scope.businesses[key];
                    }
                    if ($scope.showData === 2) {
                        getMap($scope.businessList[0].Location.lat, $scope.businessList[0].Location.lng);
                        getMarkers($scope.businessList);
                    }
                    $scope.businessIdList = $scope.businessList.map(function (obj) {
                        return obj.id;
                    });
                    for (var i = 0; i < $scope.businessList.length; i++) {
                        $scope.businessList[i].buttonValue = 'SAVE';
                        $scope.businessList[i].buttonDisabled = false;
                        if ($scope.loggedIn) {
                            if ($scope.businessList[i].AccountId === $scope.userInfo.userId) {
                                $scope.businessList[i].ownBusiness = true;
                            } else {
                                $scope.businessList[i].ownBusiness = false;
                            }
                        }
                    }
                    getRating($scope.businessIdList);
                    if ($scope.loggedIn) {
                        getSaveBusiness();
                    }
                });
        }
        $scope.getBusinessList();

        $scope.getEventCategory = function () {
            httpService.getData('EventCategories', "")
                .then(function (data) {
                    $scope.eventCategoryList = data;
                }
                , function (error) {
                    console.log(error);
                })
        }
        $scope.getEventCategory();

        $scope.getBusinessCategory = function () {
            httpService.getData('BusinessCategories', '')
                .then(function (res) {
                    $scope.businessCategoryList = res;
                }
                , function (err) {
                    console.log(err);
                });
        }
        $scope.getBusinessCategory();

        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (responce) {
                    $scope.addressList = responce.data.results;
                    $scope.currAddr = responce.data.results[0];
                    if ($scope.showData === 1) {
                        $scope.filterResult();
                    }
                    if ($scope.showData === 2) {
                        $scope.filterResult2();
                    }

                });
        });

        $scope.$watch('showData', function () {
            $scope.markers = [];
            if ($scope.showData === 1) {
                if ($scope.eventList.length > 0) {
                    getMap($scope.eventList[0].Location.lat, $scope.eventList[0].Location.lng);
                    getMarkers($scope.eventList);
                    $scope.currentCategory = getCurrentCategory();
                    $rootScope.$emit('changeFooterClass', '');
                } else {
                    $scope.currentCategory = getCurrentCategory();
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                }
            }
            if ($scope.showData === 2) {
                if ($scope.businessList.length > 0) {
                    getMap($scope.businessList[0].Location.lat, $scope.businessList[0].Location.lng);
                    getMarkers($scope.businessList);
                    $rootScope.$emit('changeFooterClass', '');
                    $scope.currentCategory = getCurrentCategory();
                } else {
                    $scope.currentCategory = getCurrentCategory();
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                }
            }
        })

        $scope.$on('search_name', function () {
            var name = shareData.getMessage();
            $scope.getEventList(name);
            $scope.getBusinessList(name);
        });

        $scope.filterResult = function () {
            $scope.eventList = [];
            var tempArr = [];
            if ($scope.eventCatId !== undefined) {
                tempArr = $scope.events.filter(function (obj) {
                    return (obj.EventCategoryId === $scope.eventCatId) ? true : false;
                });
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.eventList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if ($scope.setDate !== undefined) {
                var dt = new Date($scope.setDate).getTime();
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        return (isHappeningSameDay(dt, obj.StartDate)) ? true : false;
                    })
                } else {
                    tempArr = $scope.events.filter(function (obj) {
                        return (isHappeningSameDay(dt, obj.StartDate)) ? true : false;
                    })
                }
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.eventList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if ($scope.price !== undefined) {
                var temp2Arr = [];
                if (tempArr.length > 0) {
                    for (var i = 0; i < tempArr.length; i++) {
                        if (tempArr[i].tickets.length > 0) {
                            for (var j = 0; j < tempArr[i].tickets.length; j++) {
                                var currTicket = tempArr[i].tickets[j];
                                if (currTicket.Price <= $scope.price) {
                                    temp2Arr.push(tempArr[i]);
                                    break;
                                }
                            }
                        } else {
                            temp2Arr.push(tempArr[i]);
                        }
                    }
                    tempArr = temp2Arr;
                } else {
                    for (var i = 0; i < $scope.events.length; i++) {
                        if ($scope.events[i].tickets.length > 0) {
                            for (var j = 0; j < $scope.events[i].tickets.length; j++) {
                                var currTicket1 = $scope.events[i].tickets[j];
                                if (currTicket1.Price <= $scope.price) {
                                    tempArr.push($scope.events[i]);
                                    break;
                                }
                            }
                        } else {
                            tempArr.push($scope.events[i]);
                        }
                    }
                }
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.eventList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }
            if (($scope.addressList.length > 0) && ($scope.currAddr !== undefined)) {
                var qlat = $scope.currAddr.geometry.location.lat;
                var qlng = $scope.currAddr.geometry.location.lng;
                $scope.map = {
                    center: {
                        latitude: qlat,
                        longitude: qlng
                    },
                    zoom: 10
                };
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        var dis = getDistanceFromLatLonInKm(qlat, qlng, obj.Location.lat, obj.Location.lng);
                        return (dis <= 50.00) ? true : false;
                    });
                } else {
                    tempArr = $scope.events.filter(function (obj) {
                        var dis = getDistanceFromLatLonInKm(qlat, qlng, obj.Location.lat, obj.Location.lng);
                        return (dis <= 50.00) ? true : false;
                    });
                }
            }
            $scope.eventList = tempArr;
            $scope.currentCategory = getCurrentCategory();
            getMarkers($scope.eventList);
        }

        function getCurrentCategory() {
            if ($scope.showData === 1) {
                return $scope.eventCategoryList.find(function (element, index, array) {
                    if (element.id == $scope.eventCatId) {
                        $scope.EventCategoryId = element.id;
                        return true;
                    }
                    return element.id == $scope.eventCatId;
                });
            } else {
                return $scope.businessCategoryList.find(function (element, index, array) {
                    if (element.id == $scope.bizCatId) {
                        $scope.BusinessCategoryId = element.id;
                        return true;
                    }
                    return element.id == $scope.bizCatId;
                });
            }
        }

        $scope.filterResult2 = function () {
            $scope.businessList = [];
            var tempArr = [];
            if ($scope.bizCatId !== undefined) {
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        return (obj.BusinessCategoryId === $scope.bizCatId) ? true : false;
                    });
                } else {
                    tempArr = $scope.businesses.filter(function (obj) {
                        return (obj.BusinessCategoryId === $scope.bizCatId) ? true : false;
                    });
                }

                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.businessList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if ($scope.setDate !== undefined) {
                var dt = $scope.setDate.getTime();
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        return (isHappeningSameDay(dt, obj.StartDate)) ? true : false;
                    })
                } else {
                    tempArr = $scope.businesses.filter(function (obj) {
                        return (isHappeningSameDay(dt, obj.StartDate)) ? true : false;
                    })
                }
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.businessList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if ($scope.price !== undefined) {
                var temp2Arr = [];
                if (tempArr.length > 0) {
                    for (var i = 0; i < tempArr.length; i++) {
                        if (tempArr[i].services.length > 0) {
                            for (var j = 0; j < tempArr[i].services.length; j++) {
                                var currService = tempArr[i].services[j];
                                if (currService.Price <= $scope.price) {
                                    temp2Arr.push(tempArr[i]);
                                    break;
                                }
                            }
                        } else {
                            temp2Arr.push(tempArr[i]);
                        }
                    }
                    tempArr = [];
                    tempArr = temp2Arr;
                } else {
                    for (var i = 0; i < $scope.businesses.length; i++) {
                        if ($scope.businesses[i].services.length > 0) {
                            for (var j = 0; j < $scope.businesses[i].services.length; j++) {
                                var currService1 = $scope.businesses[i].services[j];
                                if (currService1.Price <= $scope.price) {
                                    tempArr.push($scope.businesses[i]);
                                    break;
                                }
                            }
                        } else {
                            tempArr.push($scope.businesses[i]);
                        }
                    }
                }
                if (tempArr.length === 0) {
                    $rootScope.$emit('changeFooterClass', 'footer-fixed');
                    $scope.businessList = tempArr;
                    $scope.currentCategory = getCurrentCategory();
                    return;
                }
            }

            if (($scope.addressList.length > 0) && ($scope.currAddr !== undefined)) {
                var qlat = $scope.currAddr.geometry.location.lat;
                var qlng = $scope.currAddr.geometry.location.lng;
                $scope.map = {
                    center: {
                        latitude: qlat,
                        longitude: qlng
                    },
                    zoom: 10
                };
                if (tempArr.length > 0) {
                    tempArr = tempArr.filter(function (obj) {
                        var dis = getDistanceFromLatLonInKm(qlat, qlng, obj.Location.lat, obj.Location.lng);
                        return (dis <= 50.00) ? true : false;
                    });
                } else {
                    tempArr = $scope.businesses.filter(function (obj) {
                        var dis = getDistanceFromLatLonInKm(qlat, qlng, obj.Location.lat, obj.Location.lng);
                        return (dis <= 50.00) ? true : false;
                    });
                }
            }
            $scope.businessList = tempArr;
            $scope.currentCategory = getCurrentCategory();
            getMarkers($scope.businessList);
        }

        var isHappeningSameDay = function (queryDate, eventDate) {
            var qdate = new Date(queryDate).setHours(0, 0, 0, 0);
            var edate = new Date(eventDate).setHours(0, 0, 0, 0);
            return date === edate;
        }

        $scope.checkDate = function () {
            $scope.filterResult();
        }

        $scope.checkEvent = function (eventCatId) {
            $scope.eventCatId = eventCatId;
            $scope.filterResult();
        }

        $scope.checkBusiness = function (bizCatId) {
            $scope.bizCatId = bizCatId;
            if ($scope.showData === 2) {
                $scope.filterResult2();
            }
        }

        $scope.checkPrice = function (price) {
            $scope.price = price;
            if ($scope.showData === 1) {
                $scope.filterResult();
            }
            if ($scope.showData === 2) {
                $scope.filterResult2();
            }
        }

        $scope.resetResult = function () {
            $scope.eventList = [];
            $scope.businessList = [];
            $scope.setDate = '';
            $scope.Address = '';
            $scope.BusinessCategoryId = '';
            $scope.EventCategoryId = '';
            $scope.eventCatId = '';
            $scope.eventList = $scope.events;
            $scope.businessList = $scope.businesses;
            //location.reload();
            $state.go($state.$current, null, { reload: true });
        }

    }
})();
