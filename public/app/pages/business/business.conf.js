(function () {
    'use strict';
    angular.module('evenApp')
        .config(businessConfig);

    function businessConfig($stateProvider) {
        $stateProvider
            .state('Main.Business', {
                abstract: true,
                url: '/business',
                template: '<ui-view />',
                controller: 'BusinessController'
            })
            .state('Main.Business.Create', {
                url: '/create',
                templateUrl: 'app/pages/business/templates/create-business.html',
                controller: 'CreateBusinessController'
            })
            .state('Main.Business.Detail', {
                abstract: true,
                url: '/:id',
                template: '<ui-view />'
            })
            .state('Main.Business.Detail.Info', {
                url: '/',
                templateUrl: 'app/pages/business/templates/business-detail.html',
                controller: 'BusinessDetailController',
                resolve: {
                    data: function (ngMeta, httpService, $stateParams, envData) {
                        var id = $stateParams.id;
                        var baseurl = envData.apiUrl;
                        var filter = "?filter[where][id]=" + id + "&filter[include]=account";
                        var businessDetailPromise = httpService.getData('Businesses', filter)
                            .then(function (res) {
                                var businessDetail = res[0];
                                var imagePath = baseurl + businessDetail.BusinessPicture;
                                var title = 'Even3 - service: ' + businessDetail.Name
                                var description = businessDetail.Description;

                                ngMeta.setTitle(title);
                                ngMeta.setTag('description', description);
                                ngMeta.setTag('image', imagePath);

                            }, function (err) {
                                console.log(err);
                            })
                    }
                },
                meta: {
                    disableUpdate: true
                }
            })
            .state('Main.Business.Detail.Edit', {
                url: '/edit',
                templateUrl: 'app/pages/business/templates/edit-business.html',
                controller: 'EditBusinessController'
            })
    }

})();