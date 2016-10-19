(function () {
    'use strict';
    angular
        .module('evenApp')
        .filter('yesNo', function () {
            return function (boolean) {
                return boolean ? 'Yes' : 'No';
            }
        });
})();