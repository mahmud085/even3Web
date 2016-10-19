(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('TicketModalController', ["$scope", "httpService", "eventTicketList", "$uibModalInstance", TicketModalController]);

    function TicketModalController($scope, httpService, eventTicketList, $uibModalInstance) {
        $scope.eventTicketList = eventTicketList;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();
