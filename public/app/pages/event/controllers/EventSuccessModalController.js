(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EventSuccessModalController', ["$scope", "eventUrl", "httpService", "$uibModal", "$uibModalInstance", "$state", EventSuccessModalController]);

    function EventSuccessModalController($scope, eventUrl, httpService, $uibModal, $uibModalInstance, $state) {
        $scope.share = false;
        $scope.eventUrl = eventUrl;
        $scope.invite = function () {
            $scope.share = true;
        };

        // go back to search 
        $scope.services = function () {
            $state.go('Main.Search');
            $uibModalInstance.dismiss('cancel');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();
