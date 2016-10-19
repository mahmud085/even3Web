(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ServiceSuccessModalController', ["$scope", "eventUrl", "httpService", "$uibModal", "$uibModalInstance", "$state", ServiceSuccessModalController]);

    function ServiceSuccessModalController($scope, eventUrl, httpService, $uibModal, $uibModalInstance, $state) {
        $scope.share = false;
        $scope.eventUrl = eventUrl;
        $scope.invite = function () {
            $scope.share = true;
        };

        $scope.services = function () {
            $state.go('Main.Search');
            $uibModalInstance.dismiss('cancel');
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();
