(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('AddCardModalController', ["$scope", "httpService", "$uibModalInstance", "userInfo", "$route", AddCardModalController]);

    function AddCardModalController($scope, httpService, $uibModalInstance, userInfo, $route) {
        $scope.userInfo = userInfo;
        $scope.card = {
            Name: '',
            Number: '',
            Type: '',
            Ccv: '',
            ExpiryMonth: '',
            ExpiryYear: '',
            BillingAddress: '',
            City: '',
            Country: ''
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        /* add credit card info */
        $scope.addCard = function () {
            console.log("here add card ");
            for (var key in $scope.card) {
                if ($scope.card[key] === '') {
                    alert('Can not keep ' + key + ' field empty');
                    return;
                }
            }
            $scope.card.AccountId = $scope.userInfo.userId;
            // httpService.postData($scope.card, 'Cards', $scope.userInfo.userId)
            //     .then(function (data) {
            //         $uibModalInstance.dismiss('cancel');
            //         $route.reload();
            //     }, function (err) {
            //         //console.log(err);
            // });
        }
    }
})();
