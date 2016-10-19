(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('errSrc', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('error', function () {
                        if (attrs.src != attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }
                    });
                    attrs.$observe('ngSrc', function (value) {
                        if (!value && attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }
                    });

                }
            };
        });
})();
