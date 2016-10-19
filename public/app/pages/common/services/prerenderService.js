(function () {
    'use strict';

    angular.module('evenApp')
        .service('prerenderService', prerenderService);

    prerenderService.$inject = ['$http', 'envData'];

    function prerenderService($http, envData) {
        var baseUrl = envData.apiUrl;
        var service = {
            recache : recache
        };

        return service;

        function recache (id, type){
        var sendData = {
            id: id,
            type: type
        };

        return $http.get('/recache', {params: sendData})
            .then(function(response){
                return response;
            })
        }
    }
})();