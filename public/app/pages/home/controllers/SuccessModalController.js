(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SuccessModalController', ["$scope", "$uibModalInstance", "$timeout", SuccessModalController]);
        
    function SuccessModalController($scope, $uibModalInstance, $timeout) {
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        $timeout(cancel, 5000);

        $scope.finish = function () {
            cancel();
        }

    }
})();
