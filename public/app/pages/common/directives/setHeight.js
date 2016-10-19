(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('setHeight', ['$window', function ($window) {
            return {
                link: function (scope, element, attrs) {
                    scope.getElementDimensions = function () {
                        return {
                            'h': element[0].clientHeight,
                            'w': element[0].clientWidth
                        };
                    };

                    scope.$watch(scope.getElementDimensions, function (newValue, oldValue) {
                        scope.setStyle = function () {
                            return (newValue.w * 385 / 850) + 'px';
                        };

                    }, true);

                    element.bind('setHeight', function () {
                        scope.$apply();
                    });
                }
            };
        }]);
})();