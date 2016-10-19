(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('BusinessController', ["$scope", "$state", "httpService", "$uibModal", BusinessController])

    function BusinessController($scope, $state, httpService, $uibModal) {
        $scope.businessList = [];
        $scope.businessIdList = [];
        $scope.beg = 0;
        $scope.end = 4;
        $scope.items = [1, 2, 3, 4, 5];

        /* find rating of the services */
        function getRating(arr) {
            var filter = "?filter[where][BusinessId]=";
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
        /* find saved business */
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
                            //console.log(err);
                        });
                })(i)
            }
        }

        /* find all business */
        $scope.getBusinessList = function () {
            var date = new Date().getTime();
            var filter = "?filter[include]=account"
            $scope.businessPromise = httpService.getData("Businesses", filter)
                .then(function (data) {
                    $scope.businessList =  shuffleArray(data);
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
                    $scope.businessIdList = $scope.businessList.map(function (obj) {
                        return obj.id;
                    });
                    getRating($scope.businessIdList);
                    if ($scope.loggedIn) {
                        getSaveBusiness();
                    }

                });
        }
        $scope.getBusinessList();

        /* save a business when save button is clicked */
        $scope.saveBussiness = function (id) {
            if (!$scope.loggedIn) {                         // logged in or not
                $state.go('Main.Login');
            } else {
                if (!$scope.businessList[id].ownBusiness) {
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
        }

       function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
    }
})();
