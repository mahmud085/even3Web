(function () {
    'use strict';
    angular.module('evenApp')
        .service('httpService', ["$http", "envData", function ($http, envData) {
            var http = {};
            var tempList = [];
            //var baseurl = envData.apiUrl;
            var baseurl = "http://localhost:3000/api/";
            http.baseurl = baseurl;
            http.getData = function (model, filter, auth) {
                return $http({
                    method: "GET",
                    url: baseurl + model + filter,
                    headers: {
                        'Authorization': auth
                    }
                }).then(function (responce) {
                    tempList = responce.data;
                    return tempList;
                }
                    , function (err) {
                        //console.log(err);
                    });
            };

            http.postData = function (obj, model, auth) {
                return $http({
                    method: "POST",
                    url: baseurl + model,
                    data: JSON.stringify(obj),
                    headers: {
                        'Authorization': auth
                    }
                }).then(function (response) {
                    return response;
                },
                    function (err) {
                        console.log(err);
                        return err;
                    });
            };

            http.postMultiData = function (Upurl, data, auth) {
                var fd = new FormData();
                for (var key in data) {
                    fd.append(key, data[key]);
                }
                var url = baseurl + Upurl;
                return $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': auth
                    }
                }).then(function (responce) {
                    return responce.data;
                },
                    function (err) {
                        console.log(err);
                    });
            };

            http.putData = function (obj, model, auth, filter) {
                return $http({
                    method: "PUT",
                    url: baseurl + model + "/" + filter,
                    data: JSON.stringify(obj),
                    headers: {
                        'Authorization': auth
                    }
                }).then(function (response) {
                    return response.data;
                }
                    , function (err) {
                        //console.log(err);
                        return err;
                    });
            };

            http.putMultiData = function (model, data, auth, id) {
                var fd = new FormData();
                for (var key in data) {
                    fd.append(key, data[key]);
                }
                var url = baseurl + model + "/" + id;
                return $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': auth
                    }
                }).then(function (responce) {
                    
                },
                    function (err) {
                        console.log(err);
                    });
            };

            http.deleteData = function (model, auth, id) {
                return $http({
                    method: "DELETE",
                    url: baseurl + model + "/" + id,
                    headers: {
                        'Authorization': auth
                    }
                }).then(function (data) {
                    return data;
                }
                    , function (err) {
                        return err;
                    })
            };

            return http;
        }]);
})();
