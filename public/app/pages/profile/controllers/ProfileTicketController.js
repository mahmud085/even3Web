(function () {
    'use strict';
    angular.module('evenApp')
        .controller('ProfileTicketController', ["$scope", "httpService", "$uibModal", ProfileTicketController]);

    function ProfileTicketController($scope, httpService, $uibModal) {
        $scope.purchasedEventList = [];
        $scope.purchasedEventList.length = 0;
        $scope.Tckts = false;
        var dt = new Date().getTime();

        // get event ticket purchase detail of an user
        $scope.getTicketPurchase = function () {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId + "&filter[include]=event" + "&filter[include]=ticketPurchase";
            $scope.ticketPurchasePromise = httpService.getData('TicketPurchaseDetails', filter, $scope.userInfo.id)
                .then(function (data) {
                    groupData(data);
                },
                function (err) {
                    console.log(err);
                })
        }
        $scope.getTicketPurchase();

        function groupData(data) {
            $scope.data = data;
            for (var i = $scope.data.length - 1; i > -1; i--) {
                if ($scope.data[i].StartDate < dt) {
                    $scope.data.splice(i, 1);
                }
            }
            $scope.purchasedEventList[0] = $scope.data[0];
            for (var i = 1; i < $scope.data.length; i++) {
                for (var j = 0; j < $scope.purchasedEventList.length; j++) {
                    if ($scope.data[i].EventId === $scope.purchasedEventList[j].EventId) {
                        break;
                    }
                }
                if (j === $scope.purchasedEventList.length) {
                    $scope.purchasedEventList.push($scope.data[i]);
                }
            }
            for (var i = 0; i < $scope.purchasedEventList.length; i++) {
                var ticketNum = 0;
                for (j = 0; j < $scope.data.length; j++) {
                    if ($scope.purchasedEventList[i].EventId === $scope.data[j].EventId) {
                        ticketNum++;
                    }
                }
                $scope.purchasedEventList[i].ticketNum = ticketNum;
            }
            $scope.Tckts = true;
        }

        // show all ticket that has been bought in a modal
        $scope.openModal = function (id) {
            var events = $scope.data.filter(function (obj) {
                return (obj.EventId === $scope.purchasedEventList[id].EventId);
            });
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/profile/templates/ticket-modal.html',
                controller: 'TicketModalController',
                size: 'lg',
                resolve: {
                    eventTicketList: function () {
                        return events;
                    }
                }
            });
        }

    }
})();
