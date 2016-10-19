(function () {
  'use strict';
  angular
    .module('evenApp')
    .directive('sideNav', function () {
      var controller = ["$scope", '$rootScope', "$state", function ($scope, $rootScope, $state) {
        if (!$rootScope.tab) {
          var tabName = $state.current.name.split('.');
          $rootScope.tab = tabName[2];
        }
        $scope.tabState = $rootScope.tab;
        $scope.isActive = function (viewLocation) {
          return $state.current.name === viewLocation;
        };
        $scope.goToState = function () {
          var stateName = 'Main.Profile.' + $scope.tabState;
          $rootScope.tab = $scope.tabState;
          $state.go('Main.Profile.' + $scope.tabState);
        }
      }];

      return {
        templateUrl: 'views/side-nav.html',
        restrict: 'E',
        controller: controller

      };
    });

})();
