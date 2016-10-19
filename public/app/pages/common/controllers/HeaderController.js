(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('HeaderController', ["$scope", "$uibModal", "shareData", "$rootScope", "$state", HeaderController]);

    function HeaderController($scope, $uibModal, shareData, $rootScope, $state) {

        $scope.$state = $state;
        $scope.search = '';

        $scope.$on('login', function () {
            $state.go('Main.Home.Event');
        });

        $scope.searchFn = function (search) {
            shareData.setMessage($scope.search);
        };

        $scope.status = {
            isopen: false
        };

        $scope.toggleDropdown = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };

        $scope.logout = function () {
            $rootScope.$emit('logout');
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $scope.showMenu = false;
        });
    }
})();