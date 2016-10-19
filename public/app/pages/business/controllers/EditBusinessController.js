(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('EditBusinessController', ["$scope", "httpService", "$stateParams", "$http", "$state", "prerenderService", EditBusinessController])

    function EditBusinessController($scope, httpService, $stateParams, $http, $state, prerenderService) {
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

        var id = $stateParams.id;
        $scope.business = {};
        $scope.showImageInput = false;
        $scope.showImage = false;
        $scope.OwnBusiness = false;
        $scope.alert = false;

        /* get business detail that are going to be edited */
        $scope.getBusinessDetail = function () {
            var filter = "?filter[where][id]=" + id + "&filter[include]=account" + "&filter[include]=services";
            httpService.getData('Businesses', filter, '')
                .then(function (response) {
                    if (response[0].AccountId === $scope.userInfo.userId) {
                        $scope.OwnBusiness = true;
                        $scope.business = response[0];
                        if ($scope.business.BusinessPicture === undefined) {
                            $scope.showImageInput = true;
                            $scope.showImage = false;
                        } else {
                            $scope.showImageInput = false;
                            $scope.showImage = true;
                        }
                        $scope.Address = $scope.business.Address;
                        if ($scope.business.services.length === 0) {
                            $scope.business.priceType = 'free';
                        } else {
                            $scope.business.priceType = 'paid';
                        }
                    } else {
                        $scope.OwnBusiness = false;
                    }
                })
        }
        $scope.getBusinessDetail();

        // get business category list
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

        // watch address variable always. when a change is made it will execute instantly
        $scope.$watch('Address', function () {
            $http.get(geourl + $scope.Address)
                .then(function (responce) {
                    $scope.addressList = responce.data.results;
                });
        });

        $scope.pic = null;
        $scope.business.file = null;
        $scope.croppedPic = '';

        $scope.removeImage = function () {
            $scope.showImageInput = true;
            $scope.showImage = false;
            $scope.business.BusinessPicture = '';
        }

        $scope.removePic = function () {
            $scope.pic = null;
            $scope.business.file = '';
        }

        // crop the image
        $scope.convertUrl = function (dataURI) {
            $scope.business.file = dataURI;
        }

        //check the image size
        $scope.checkPic = function (pic) {
            if ((pic.size / 1048576) > 1.00) {
                $scope.picErr = true;
                $scope.pic = null;
                $scope.picErrMsg = "Image Size Must Be Less Than 1 MB";
            } else {
                $scope.picErr = false;
                $scope.picErrMsg = ""
            }
        }

        // edit the business and save it 
        $scope.editBusiness = function () {
            if ($scope.OwnBusiness) {
                for (var key in $scope.business) {

                    if( key === 'BusinessPicture' && $scope.croppedPic !== ''){
                        continue;
                    }

                    if ($scope.business[key] === '' || $scope.business[key] === undefined) {
                        $scope.alert = true;
                        $scope.err_msg = "Business " + key + " is not Defined";
                        return;
                    }
                }
                $scope.alert = false;
                if ($scope.business.file !== undefined) {
                    var byteString = atob($scope.business.file.split(',')[1]);
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    $scope.business.file = new Blob([ab], { type: 'image/png' });
                }
                $scope.business.Id = id;
                $scope.business.Address = $scope.addressList[0].formatted_address;
                $scope.business.LocationLat = $scope.addressList[0].geometry.location.lat;
                $scope.business.LocationLong = $scope.addressList[0].geometry.location.lng;
                $scope.business.AccountId = $scope.userInfo.userId;

                $scope.editBizPromise = httpService.postMultiData('Businesses/editbusiness', $scope.business, $scope.userInfo.id)
                    .then(function (response) {
                        prerenderService.recache(response.id, 'business');
                        $state.go('Main.Profile.Service');
                    });
            }
        }

        // save service option. if the service is paid
        $scope.saveService = function (service, index) {
            if ($scope.OwnBusiness) {
                if (service.id === undefined) {
                    service.BusinessId = id;
                    if ((service.Name === undefined) || (service.Price === undefined)) {
                        alert("Fill Up All The Fields");
                    } else {
                        $scope.editBizTicketPromise = httpService.postData(service, 'services', $scope.userInfo.id);
                    }
                } else {
                    if ((service.Name === '') || (service.Price === '')) {
                        alert("Fill Up All The Fields");
                    } else {
                        $scope.editBizTicketPromise = httpService.putData(service, 'services', $scope.userInfo.id, service.id);
                    }
                }
            }
        }

        // delete service option
        $scope.deleteService = function (service, index) {
            if ($scope.OwnBusiness) {
                if (service.id === undefined) {
                    $scope.business.services.splice(index, 1);
                } else {
                    var r = confirm("Do You Really Want to Delete This?");
                    if (r) {
                        $scope.editBizTicketPromise = $scope.editBizPromise = httpService.deleteData('services', $scope.userInfo.id, service.id)
                            .then(function (res) {
                                $scope.business.services.splice(index, 1);
                            });
                    }
                }
            }
        }

    }
})();

