(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CreateBusinessController', ["$scope", "httpService", "$http", "$uibModal", "$state", "prerenderService", CreateBusinessController])

    function CreateBusinessController($scope, httpService, $http, $uibModal, $state, prerenderService) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        $scope.business = {
            Name: '',
            BusinessCategoryId: '',
            Description: '',
            priceType: 'free',
            tickets: [],
            email: ''
        };
        $scope.alert = false;
        $scope.Address = '';
        $scope.addressList = [];
        $scope.businessCategoryList = [];
        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (response) {
                    $scope.addressList = response.data.results;
                });
        });

        // get all business category
        $scope.getBusinessCategory = function () {
            httpService.getData('BusinessCategories', '')
                .then(function (res) {
                    $scope.businessCategoryList = res;
                }
                , function (err) {
                    console.log(err);
                });
        }
        $scope.getBusinessCategory();

        $scope.pic = null;
        $scope.business.file = null;
        $scope.cropedPic = '';
        $scope.cropMsg = false;
        $scope.cropMsg1 = " ";

        // remove the picture that is choosen
        $scope.removePic = function () {
            $scope.pic = null;
            $scope.business.file = '';
            $scope.cropMsg = false;
        }

        // crop the picture and save it in business.file
        $scope.convertUrl = function ($dataURI) {
            $scope.cropMsg1 = true;
            $scope.cropMsg = false;
            $scope.business.file = $dataURI;
        }

        // check the image size is greater than 1 mb or not
        $scope.checkPic = function (pic) {
            if ((pic.size / 1048576) > 1.00) {
                $scope.business.file = null;
                $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
            } else {
                $scope.picErrMsg = ""
            }
            $scope.cropMsg = false;
            $scope.cropMsg1 = false;
        }

        // validate the email with regular expression
        $scope.validateEmail = function (email) {
            var re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            if (!re.test(email)) {
                $scope.emailAlert = true;
                $scope.emailAlertMsg = "Not a valid Email";
            } else {
                $scope.emailAlert = false;
            }
        }

        /*  create a business first and then with the business ID from response
            create a service with price,name,currency and businessID.
            after successfull creation a success modal is open
        */
        $scope.createBusiness = function (business) {

            for (var key in business) {
                if (business[key] === '') {
                    $scope.alert = true;
                    $scope.err_msg = "Business " + key + " is not Defined";
                    return;
                }
            }
            if (business.tickets.length > 0) {
                for (var i = 0; i < business.tickets.length; i++) {
                    delete business.tickets[i].$$hashKey;
                    if ((business.tickets[i].price === undefined) || (business.tickets[i].name === undefined)) {
                        $scope.alert = true;
                        $scope.err_msg = "Service Price is not Defined Properly";
                        return;
                    } else {
                        $scope.alert = false;
                    }
                }
            }
            if (business.file !== null) {
                var byteString = atob(business.file.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                business.file = new Blob([ab], { type: 'image/png' });
            }
            if ($scope.cropMsg1 === false) {
                $scope.alert = true;
                $scope.err_msg = "Picture should be cropped properly";
                return;
            }
            if ($scope.Address !== '') {
                business.Address = $scope.addressList[0].formatted_address;
                business.LocationLat = $scope.addressList[0].geometry.location.lat;
                business.LocationLong = $scope.addressList[0].geometry.location.lng;
            } else {
                $scope.alert = true;
                $scope.err_msg = "Business Address is not Defined";
                return;
            }
            business.AccountId = $scope.userInfo.userId;
            $scope.createBizPromise = httpService.postMultiData('Businesses/newBusiness', business, $scope.userInfo.id)
                .then(function (response) {
                    if (business.priceType === 'paid') {
                        for (var i = 0; i < business.tickets.length; i++) {
                            (function (i) {
                                var obj = {
                                    Price: business.tickets[i].price,
                                    Name: business.tickets[i].name,
                                    currency: business.tickets[i].currency,
                                    BusinessId: response.id
                                }
                                $scope.createBizPromise = httpService.postData(obj, 'services', $scope.userInfo)
                                    .then(function (data) {
                                       
                                    }, function (err) {
                                        console.log(err);
                                    })
                            })(i);
                        }
                    }
                    $scope.show(2);
                    var businessId = response.id;
                    var url = "http://www.even3app.com/" + $state.href('Main.Business.Detail.Info', { id: businessId });
                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'app/pages/business/templates/service-success-modal.html',
                        controller: 'ServiceSuccessModalController',
                        size: 'sm',
                        resolve: {
                            eventUrl: function () {
                                return url;
                            }
                        }
                    });

                    prerenderService.recache(businessId, 'business');
                });
        }

    }
})();
