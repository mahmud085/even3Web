(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('BusinessDetailController', ["$scope", "$state", "$stateParams", "httpService", "$http", "$interval", "$sce", "$uibModal", "$window", BusinessDetailController])

    function BusinessDetailController($scope, $state, $stateParams, httpService, $http, $interval, $sce, $uibModal, $window) {

        $scope.businessDetail = {};
        var geoUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCuPr_PsYccfO9CDnEflllkcFcbMurXRUg&q=";
        $scope.commentList = [];
        $scope.CommentBody = "";
        $scope.contact = "";
        $scope.hireEmail = "";
        var id = $stateParams.id;
        $scope.showSaveButton = $scope.loggedIn;
        $scope.buttonDisabled = false;
        $scope.buttonValue = "SAVE";
        $scope.showRate = false;
        $scope.ownBusiness = false;

        $scope.getBusinessDetail = function () {
            var filter = "?filter[where][id]=" + id + "&filter[include]=account";
            var d = new Date();
            $scope.businessDetailPromise = httpService.getData('Businesses', filter)
                .then(function (res) {
                    $scope.businessDetail = res[0];
                    //$scope.hire = "mailto:"+ $scope.businessDetail.email + "?subject= New Hiring proposal from Even3";
                    $scope.geoSrc = $sce.trustAsResourceUrl(geoUrl + $scope.businessDetail.Address);
                    //initialization of map
                    $scope.map = {
                        center: {
                            latitude: $scope.businessDetail.Location.lat,
                            longitude: $scope.businessDetail.Location.lng
                        },
                        zoom: 14
                    };
                    //initialization of map marker
                    $scope.marker = {
                        id: 0,
                        coords: {
                            latitude: $scope.businessDetail.Location.lat,
                            longitude: $scope.businessDetail.Location.lng
                        }
                    };
                    // loggeddIn na thakle rate korteparbe na,, but rate korte gele login modal show korbe
                    //save bussiness korte hole login thakte hobe
                    //own biz save kora jabe na, button disable show korbe
                    //ek baar save kora biz 2nd save korte parbe na
                    if ($scope.loggedIn) {
                        if ($scope.userInfo.userId === $scope.businessDetail.AccountId) {
                            $scope.businessDetail.ownBusiness = true;
                            $scope.showRate = false;
                            $scope.businessDetail.buttonDisabled = true;
                        } else {
                            $scope.showRate = true;
                            $scope.businessDetail.ownBusiness = false;
                        }

                    } else {
                        $scope.showRate = false;
                        $scope.businessDetail.ownBusiness = false;
                    }
                    if ($scope.businessDetail != undefined) {
                        if ($scope.businessDetail.email.length > 0) {
                            $scope.contact += $scope.businessDetail.email;
                        }
                        if ($scope.businessDetail.Phone !== undefined) {
                            if ($scope.contact.length > 0) {
                                $scope.contact += " / " + $scope.businessDetail.Phone;
                            } else {
                                $scope.contact += $scope.businessDetail.Phone;
                            }
                        }
                        if ($scope.businessDetail.Website !== undefined) {
                            if ($scope.contact.length > 0) {
                                $scope.contact += " / " + $scope.businessDetail.Website;
                            } else {
                                $scope.contact += $scope.businessDetail.Website;
                            }
                        }
                    }
                }
                , function (err) {
                    //console.log(err);
                })
        }
        $scope.getBusinessDetail();

        //hire service part
        $scope.hireMe = function () {
            if ($scope.loggedIn) {
                //var hire = "mailto:"+ $scope.business.account.email + "?subject= New%20Hiring%20proposal%20from%20Even3";
                $window.open("mailto:" + $scope.businessDetail.email + "?subject=New%20Hiring%20proposal%20from%20Even3");
                /*$uibModal.open({
                   animation: $scope.animationsEnabled,
                   templateUrl: 'views/hireModal.html',
                   controller: 'HireModalCtrl',
                   resolve: {
                       business: function () {
                           return $scope.businessDetail;
                       }
                   }
               });*/
            } else {
                $state.go('Main.Login');
            }
        }

        $scope.getBackgroundImage = function () {
            var imagePath = $scope.baseurl + $scope.businessDetail.BusinessPicture;
            return 'url(' + imagePath + ')';

        }
        //commnet GET part
        //2 sec por por new comment check korbe, $interval ei jonne use kora hoise
        function getComments() {
            var filter = "?filter[include]=account" + "&filter[where][BusinessId]=" + id;
            httpService.getData("EventComments", filter, "")
                .then(function (res) {
                    $scope.commentList = res;
                }
                , function (err) {
                    //console.log(err);
                })
        }

        function getNewComments() {
            var filter = "?filter[include]=account" + "&filter[where][BusinessId]=" + id;
            httpService.getData("EventComments", filter, "")
                .then(function (res) {
                    if (res.length !== $scope.commentList.length) {
                        $scope.commentList = res;
                    }
                }
                , function (err) {
                    //console.log(err);
                })
        }
        getComments();
        //new comment check
        var commentPromice = $interval(getNewComments, 2000);

        //interval destroy kora hoise state change kora matroi, otherwise puro shomoy $interval choltei thakbe
        $scope.$on("$destroy", function () {
            if (commentPromice) {
                $interval.cancel(commentPromice);
            }
        });

        //comment add function
        $scope.addComment = function (comment) {
            if (comment.length === 0) {
                alert('Can not post EMPTY Comment');
            }
            else {
                $scope.CommentBody = "";
                var obj = {};
                obj.Time = new Date().getTime();
                obj.CommentBody = comment;
                obj.BusinessId = id;
                obj.Id = $scope.userInfo.userId;
                httpService.postMultiData('EventComments/addcomment', obj, $scope.userInfo.id);
            }
        }

        //rate korar part, fullstar and empty star
        $scope.giveRate = 0;
        $scope.fullStar = 0;
        $scope.emptyStar = 5;
        $scope.fullStarRate = function (n) {
            $scope.giveRate = n;
            $scope.fullStar = n;
            $scope.emptyStar = 5 - n;
        }
        $scope.emptyStarRate = function (n) {
            $scope.giveRate = n;
            $scope.fullStar = n + $scope.fullStar;
            $scope.emptyStar = 5 - $scope.fullStar;
        }

        $scope.postRate = function () {
            var obj = {
                value: $scope.fullStar,
                AccountId: $scope.userInfo.userId,
                BusinessId: id
            }
            $scope.ratePromise = httpService.postData(obj, "ratings", "")
                .then(function (res) {
                    $scope.showRate = false;
                });

            $scope.getRatings();
        }

        function setRatings(arr) {
            if (arr === undefined || arr.length === 0) {
                $scope.ratingNum = 0;
                $scope.showRate = true;
            }
            else {
                if ($scope.loggedIn) {
                    if (!$scope.ownBusiness) {
                        var filter = "?filter[where][BusinessId]=" + id + "&filter[where][AccountId]=" + $scope.userInfo.userId
                        $scope.ratePromise = httpService.getData('ratings', filter, "")
                            .then(function (response) {
                                if (response.length === 0) {
                                    $scope.showRate = true;
                                } else {
                                    $scope.showRate = false;
                                }
                            })
                    }
                }
                var totalVal = arr.reduce(function (prev, curr) {
                    return prev + curr.value;
                }, 0);
                $scope.ratingNum = Math.floor(totalVal / (arr.length));
            }
        }

        $scope.items = [1, 2, 3, 4, 5]
        $scope.getRatings = function () {
            var filter = "?filter[where][BusinessId]=" + id;
            $scope.ratePromise = httpService.getData('ratings', filter, "")
                .then(function (data) {
                    $scope.ratingList = data;
                    setRatings($scope.ratingList);
                },
                function (err) {
                    console.log(err);
                });
        }
        $scope.getRatings();

        function getServices() {
            var filter = "?filter[where][BusinessId]=" + id;
            httpService.getData('services', filter, "")
                .then(function (data) {
                    $scope.serviceList = data;
                    for (var i = 0; i < $scope.serviceList.length; i++) {
                        $scope.serviceList[i].currencySymbol = $scope.currencySymbolList[$scope.serviceList[i].currency]
                    }
                },
                function (err) {
                    console.log(err);
                })
        }
        getServices();

        $scope.deleteService = function () {
            var cnfrm = confirm("Are you Sure to Delete your Service?");
            if (cnfrm) {
                httpService.deleteData('Businesses', $scope.userInfo.id, id)
                    .then(function (response) {
                        $scope.show(2);
                    }, function (err) {
                        console.log(err);
                    })
            }
        }

    }
})();
