(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('SocialShareController', ["$scope", "eventUrl", "eventTitle", "$uibModalInstance", SocialShareController])
        
    function SocialShareController($scope, eventUrl, eventTitle, $uibModalInstance) {
        $scope.eventUrl = eventUrl;

        $scope.title = eventTitle;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();