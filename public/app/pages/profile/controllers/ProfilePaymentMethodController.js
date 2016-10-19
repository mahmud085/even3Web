(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('ProfilePaymentMethodController', ["$scope", "httpService", "stripe", "$uibModal", ProfilePaymentMethodController]);

    function ProfilePaymentMethodController($scope, httpService, stripe, $uibModal) {
        $scope.showCcform = false;
        $scope.cardList = [];

        // get all card of the user that he uses for payment
        function getCardList() {
            var filter = "?filter[where][AccountId]=" + $scope.userInfo.userId;
            $scope.paymentPromise = httpService.getData('Cards', filter, $scope.userInfo.id)
                .then(function (response) {
                    $scope.cardList = response;
                },
                function (err) {
                    console.log(err);
                })
        }

        getCardList();

        // open add card modal
        $scope.openModal = function () {
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/profile/templates/add-card-modal.html',
                controller: 'AddCardModalController',
                size: 'lg',
                resolve: {
                    userInfo: function () {
                        return $scope.userInfo;
                    }
                }
            });
        }
    }
})();
