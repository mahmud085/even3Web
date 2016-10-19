(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('RsvpModalController', ["$scope", "event", "httpService", "$uibModalInstance", "userInfo", "shareData", "$state", RsvpModalController])

    function RsvpModalController($scope, event, httpService, $uibModalInstance, userInfo, shareData, $state) {
        $scope.event = event;
        $scope.rsvpList = [];
        $scope.showMsg = false;
        $scope.going = false;
        $scope.ignore = false;
        if ($scope.event.RsvpValue === "Ignore") {
            $scope.going = false;
            $scope.ignore = true;
            $scope.prevPost = true;
        } else if ($scope.event.RsvpValue === "Going") {
            $scope.going = true;
            $scope.ignore = false;
            $scope.prevPost = true;
        } else {
            $scope.prevPost = false;
        }

        $scope.setRSVP = function (state) {

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
            obj.EventId = $scope.event.id;
            obj.AccountId = userInfo.userId;
            if ($scope.event.tickets.length === 0) {
                if (!$scope.prevPost) {
                    $scope.rsvpPromise = httpService.postData(obj, 'Participants', userInfo.id)
                        .then(function () {
                            $scope.showMsg = true;
                        });
                } else {
                    $scope.rsvpPromise = httpService.putData(obj, 'Participants', userInfo.id, $scope.event.RsvpId)
                        .then(function () {
                            $scope.showMsg = true;
                        });
                }
            } else {
                if (state === 2) {
                    $uibModalInstance.dismiss('cancel');
                    $state.go('Main.Event.Detail.Cart', { id: $scope.event.id });
                } else {
                    if (!$scope.prevPost) {
                        $scope.rsvpPromise = httpService.postData(obj, 'Participants', userInfo.id)
                            .then(function () {
                                $scope.showMsg = true;
                            });
                    } else {
                        $scope.rsvpPromise = httpService.putData(obj, 'Participants', userInfo.id, $scope.event.RsvpId)
                            .then(function () {
                                $scope.showMsg = true;
                            });
                    }
                }
            }

        }

        $scope.cancel = function () {
            $state.go($state.$current, null, { reload: true });
            $uibModalInstance.dismiss('cancel');
        };

    }
})();