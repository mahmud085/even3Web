(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('MapController', ["$scope", MapController]);
        
    function MapController($scope) {
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    }
})();