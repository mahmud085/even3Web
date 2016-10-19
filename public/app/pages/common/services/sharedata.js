(function () {
    'use strict';
    angular.module('evenApp')
        .factory('shareData', ["$rootScope", function ($rootScope) {
            var data = {};
            data.userInfo = {};
            data.eventList = [];
            data.eventDetail = {};
            data.message = '';
            data.rsvpObj = {};

            data.testPublishableKey = "pk_test_P2jvqRsGBCekrhYItngejV3a";
            data.livePublishableKey = "pk_live_CQH2eIg98BWYBr8MXxUZgfZj";

            data.setRsvpObj = function (val) {
                data.rsvpObj = val;
                $rootScope.$broadcast('rsvpSet');
            };

            data.getRsvpObj = function () {
                return data.rsvpObj;
            };

            data.setMessage = function (val) {
                data.message = val;
                $rootScope.$broadcast('search_name');
            };

            data.getMessage = function () {
                return data.message;
            };

            data.setAccessToken = function (val) {
                for (var key in val) {
                    data.userInfo[key] = val[key];
                }
                $rootScope.$broadcast('login');
            };

            data.getAccessToken = function () {
                return data.userInfo;
            };

            data.setEvent = function (arr) {
                data.eventList = arr;
                $rootScope.$broadcast('search');
            };

            data.getEvent = function () {
                return data.eventList;
            };

            data.setUserInfo = function (obj) {
                data.userInfo = obj;
            };

            data.getUserInfo = function () {
                return data.userInfo;
            };

            return data;
        }]);
})();