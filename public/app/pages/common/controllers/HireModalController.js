(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('HireModalController', ["$scope", "business", "$uibModalInstance", HireModalController]);

    function HireModalController($scope, business, $uibModalInstance) {
        $scope.business = business;
        //$scope.hire = "mailto:"+ $scope.business.account.email + "?subject= New%20Hiring%20proposal%20from%20Even3";
        $scope.email = $scope.business.account.email;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();