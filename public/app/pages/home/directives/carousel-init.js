(function () {
    'use strict';
    angular
        .module('evenApp')
        .directive('carouselInit', [carouselInit]);

    function carouselInit() {
        return {
            restrict: 'A',
            link: function (scope, element) {
                if (scope.$last) {
                    $(element.parent()).owlCarousel({
                        dots: false,
                        autoWidth: true,
                        navigation: true,
                        pagination: false,
                        paginationNumbers: false,
                        navigationText: [
                            '<img class="next" src="images/next.png">',
                            '<img class="prev" src="images/prev.png">'
                        ],
                        autoPlay: 3000,
                        items: 6,
                        itemsDesktop: [1199, 6],
                        itemsDesktopSmall: [979, 3]

                    })
                }
            }
        };
    }
})();