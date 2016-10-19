(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CarouselController', ["$scope", "$rootScope", "$state", "$timeout", "httpService", CarouselController]);

    function CarouselController($scope, $rootScope, $state, $timeout, httpService) {
        $scope.goToCategory = goToCategory;
        $scope.slides;
        var _categories = [];
        httpService.getData('EventCategories', "")
            .then(function (categories) {
                _categories = categories;
                $scope.slides = [
                    {
                        image: "/images/popular-category/tile-2.png",
                        text: 'Bachelorette party',
                        id: getCategoryId('Bachelorette party')
                    },
                    {
                        image: "images/popular-category/tile-1.png",
                        text: 'Birthday Party',
                        id: getCategoryId('Birthday')
                    },
                    {
                        image: "images/popular-category/tile-6.png",
                        text: 'Family Reunion',
                        id: getCategoryId('Family reunion')
                    },
                    {
                        image: "images/popular-category/tile-5.png",
                        text: 'Wedding',
                        id: getCategoryId('Wedding')
                    },
                    {
                        image: "images/popular-category/tile-3.png",
                        text: 'Barbecue',
                        id: getCategoryId('BBQ')
                    },
                    {
                        image: "images/popular-category/tile-4.png",
                        text: 'Meetup',
                        id: getCategoryId('Meet up')
                    },
                    {
                        image: "images/event_category.png",
                        text: 'Other',
                        id: getCategoryId('Other')
                    }
                ];
            });


        function getCategoryId(text) {
            return _categories.find(function(value) {
                return value.Name.includes(text);
            }).id;
        }

        function goToCategory(category) {
            $timeout(function () {
                $rootScope.$emit('getCategory', category);
            }, 1000)
            $state.go('Main.Search');
        }
    }
})();
