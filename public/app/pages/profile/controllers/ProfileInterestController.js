(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ProfileInterestController', ["$scope", "httpService", "$http", "$timeout", "envData", ProfileInterestController]);

    function ProfileInterestController($scope, httpService, $http, $timeout, envData) {
        //todo: update the base API url to be injected and environment specific
        // $scope.baseurl = "http://api.even3app.com/api";
        $scope.baseurl = envData.apiUrl;
        var indexList = [];
        var temp = [];
        $scope.showMsg = false;
        $scope.interestRetrivedList = [];

        // 
        $scope.showInterest = function (index, state) {
            if (state) {
                indexList.push(index);
            } else {
                for (var i = 0; i < indexList.length; i++) {
                    if (indexList[i] === index) {
                        indexList.splice(i, 1);
                        return;
                    }
                }
            }
        };

        // get the all interests of the user that are checked
        function getInterest() {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId;
            httpService.getData('interests', filter, $scope.userInfo.id)
                .then(function (res) {
                    if (res.length > 0) {
                        var temp = res[0].names
                    }
                    if (temp !== undefined) {
                        for (var i = 0; i < temp.length; i++) {
                            if (temp[i] === 'Arts & Crafts') {
                                $scope.interest0 = true;
                                $scope.interestRetrivedList.push(0);
                            }
                            if (temp[i] === 'Collecting') {
                                $scope.interest1 = true;
                                $scope.interestRetrivedList.push(1);
                            }
                            if (temp[i] === 'Dancing') {
                                $scope.interest2 = true;
                                $scope.interestRetrivedList.push(2);
                            }
                            if (temp[i] === 'Drama') {
                                $scope.interest3 = true;
                                $scope.interestRetrivedList.push(3);
                            }
                            if (temp[i] === 'Food And Drink') {
                                $scope.interest4 = true;
                                $scope.interestRetrivedList.push(4);
                            }
                            if (temp[i] === 'Games') {
                                $scope.interest5 = true;
                                $scope.interestRetrivedList.push(5);
                            }
                            if (temp[i] === 'Music') {
                                $scope.interest6 = true;
                                $scope.interestRetrivedList.push(6);
                            }
                            if (temp[i] === 'Outdoor Hobbies') {
                                $scope.interest7 = true;
                                $scope.interestRetrivedList.push(7);
                            }
                            if (temp[i] === 'Pets') {
                                $scope.interest8 = true;
                                $scope.interestRetrivedList.push(8);
                            }
                            if (temp[i] === 'Rc Hobbies') {
                                $scope.interest9 = true;
                                $scope.interestRetrivedList.push(9);
                            }
                            if (temp[i] === 'Sports') {
                                $scope.interest10 = true;
                                $scope.interestRetrivedList.push(10);
                            }
                        }
                    }
                    indexList = $scope.interestRetrivedList;
                })
        }
        getInterest();

        function hideMsg() {
            $scope.showMsg = false;
        }

        // set the user interest
        $scope.setInterest = function () {
            var interestNameList = [];
            for (var i = 0; i < indexList.length; i++) {
                var id = indexList[i];
                interestNameList.push($scope.interestList[id].name);
            }
            var obj = {
                names: interestNameList,
                AccountId: $scope.userInfo.userId
            };
            $scope.interestPromise = $http({
                method: 'POST',
                url: $scope.baseurl + "interests/userinterest",
                params: {
                    allinterests: JSON.stringify(obj)
                }
            })
                .success(function (res) {
                    $scope.showMsg = true;
                    $timeout(hideMsg, 5000);
                })
                .error(function (err) {
                    console.log(err);
                })
        };

        $scope.interestList = [
            {
                name: "Arts & Crafts",
                value: false
            },
            {
                name: "Collecting",
                value: false
            },
            {
                name: "Dancing",
                value: false
            },
            {
                name: "Drama",
                value: false
            },
            {
                name: "Food And Drink",
                value: false
            },
            {
                name: "Games",
                value: false
            },
            {
                name: "Music",
                value: false
            },
            {
                name: "Outdoor Hobbies",
                value: false
            },
            {
                name: "Pets",
                value: false
            },
            {
                name: "Rc Hobbies",
                value: false
            },
            {
                name: "Sports",
                value: false
            }
        ]

    }
})();
