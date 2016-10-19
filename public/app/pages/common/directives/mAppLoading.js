(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('mAppLoading', ['$animate', function ($animate) {
            return {
                restrict: 'C',
                link: function (scope, element, attrs) {
                    $animate.leave(element.children().eq(1)).then(
                        function cleanupAfterAnimation() {
                            element.remove();
                            scope = element = attrs = null;
                        }
                    );
                }
            };
        }]);
})();
