(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CropPicModalController', ["$scope", "pic", CropPicModalController]);
        
    function CropPicModalController($scope, pic) {
        $scope.picture = pic;
    }
})();