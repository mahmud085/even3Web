(function () {
    'use strict';
    angular
        .module('evenApp')
        .controller('CartController', ["$scope", "httpService", "$stateParams", "stripe", "shareData", "$state", CartController])

    function CartController($scope, httpService, $stateParams, stripe, shareData, $state) {

        stripe.setPublishableKey(shareData.testPublishableKey);

        $scope.ticketList = [];
        $scope.buyTicket = [];
        $scope.selectedCard = null;
        $scope.totalPrice = 0;
        $scope.ticketPrice = 0;
        $scope.quantity = 0;
        $scope.showCardError = false;
        $scope.showErr = false;
        var id = $stateParams.id;
        $scope.selectedcardNumber = '';

        /* find the tickets of an event */
        function getEventTickets() {
            var filter = '?filter[where][EventId]=' + id;
            $scope.paymentPromise = httpService.getData('Tickets', filter, $scope.userInfo.id)
                .then(function (response) {
                    if (response.length > 0) {
                        $scope.ticketList = response;
                        $scope.currency = $scope.ticketList[0].currency;
                        $scope.buyTicket = response;
                        for (var i = 0; i < $scope.ticketList.length; i++) {
                            $scope.ticketList.quantity = 0;
                            $scope.ticketList.total = 0;
                        }
                    }
                }, function (err) {
                    console.log(err);
                })
        }
        getEventTickets();

        /* find RSVP if the user is going or not going */
        function getRsvp() {
            var filter = "?filter[where][EventId]=" + id + "&filter[where][AccountId]=" + $scope.userInfo.userId;
            $scope.paymentPromise = httpService.getData('Participants', filter, $scope.userInfo.id)
                .then(function (response) {
                    if (response.length > 0) {
                        $scope.rsvp = 1;
                        $scope.rsvpId = response[0].id;
                    } else {
                        $scope.rsvp = 0;
                    }
                }, function (err) {
                    console.log(err);
                });
        }
        getRsvp();

        /* get card list of the user that he saved for payment use */
        function getCardList() {
            var filter = '?filter[where][AccountId]=' + $scope.userInfo.userId;
            $scope.paymentPromise = httpService.getData('cards', filter, $scope.userInfo.id)
                .then(function (response) {
                    if (response.length > 0) {
                        $scope.cardList = response;
                    }
                }, function (err) {
                    console.log(err);
                })
        }
        getCardList();

        // select payment card for paying the ticket price
        $scope.selectCard = function (cardId) {
            for (var i = 0; i < $scope.cardList.length; i++) {
                if ($scope.cardList[i].id === cardId) {
                    $scope.selectedCard = $scope.cardList[i];
                    var len = $scope.selectedCard.Number.length;
                    $scope.selectedCardNumber = "***********" + $scope.selectedCard.Number[len - 2] + $scope.selectedCard.Number[len - 1];
                    $scope.selectedCard.ExpiryDate = $scope.selectedCard.ExpiryMonth + "/" + $scope.selectedCard.ExpiryYear;
                }
            }
        }
        // calculate price for ticket
        $scope.calculatePrice = function (index, obj) {
            if ($scope.ticketList[index].quantity > -1) {
                $scope.showErr = false;
                $scope.ticketList[index].total = $scope.ticketList[index].quantity * $scope.ticketList[index].Price;
                for (var i = 0; i < $scope.ticketList.length; i++) {
                    $scope.totalPrice = ($scope.ticketList[i].quantity * $scope.ticketList[i].Price);
                }
            } else {
                $scope.ticketList[index].quantity = 0;
                $scope.showErr = true;
            }
        }

        // when delete button is clicked ticket quantity field will be zero
        $scope.deleteTicket = function (index) {
            $scope.ticketList[index].quantity = 0;
            $scope.calculatePrice(index);
        }

        // pay the price of ticket using card
        $scope.pay = function (selectedCard) {
            if (selectedCard === null) {
                $scope.showCardError = true;
                $scope.cardErrMsg = "Please Select A card";
            } else {
                $scope.showCardError = false;
                if ($scope.totalPrice === 0) {
                    $scope.showCardError = true;
                    $scope.cardErrMsg = "Set Total Amount"
                } else {
                    $scope.showCardError = false;
                    var tempCard = {
                        number: selectedCard.Number,
                        cvc: selectedCard.Ccv,
                        exp_month: selectedCard.ExpiryMonth,
                        exp_year: selectedCard.ExpiryYear
                    }
                    if ((stripe.card.validateExpiry(tempCard.exp_month, tempCard.exp_year))
                        && (stripe.card.validateCardNumber(tempCard.number))
                        && (stripe.card.validateCVC(tempCard.cvc))) {
                        stripe.card.createToken(tempCard)
                            .then(function (response) {
                                $scope.token = response.id;
                                var payment = {
                                    amount: $scope.totalPrice,
                                    currency: $scope.currency,
                                    description: "Payment for Tickets of EventId " + id,
                                    isTest: true,
                                    stripeToken: $scope.token
                                }
                                $scope.paymentPromise = httpService.postData(payment, 'Cards/stripepayment', $scope.userInfo.id)
                                    .then(function (response) {
                                        if (response.statusText === 'OK') {
                                            var TransacId = response.data.payment;
                                            var timeToPurchase = response.data.created;
                                            for (var i = 0; i < $scope.ticketList.length; i++) {
                                                (function (i) {
                                                    if ($scope.ticketList[i].quantity !== 0) {
                                                        var transaction = {
                                                            Purchased: $scope.ticketList[i].quantity,
                                                            TransactionId: TransacId,
                                                            TimeOfTicket: timeToPurchase,
                                                            AccountId: $scope.userInfo.userId,
                                                            TicketId: $scope.ticketList[i].id,
                                                            EventId: id
                                                        }
                                                        $scope.paymentPromise = httpService.postData(transaction, 'TicketPurchases', $scope.userInfo.id)
                                                            .then(function (response) {
                                                                if (response.statusText === 'OK') {
                                                                    if ($scope.rsvp > 0) {
                                                                        var obj = {
                                                                            Rsvp: 2,
                                                                            EventId: id,
                                                                            AccountId: $scope.userInfo.userId
                                                                        }
                                                                        $scope.paymentPromise = httpService.putData(obj, 'Participants', $scope.userInfo.id, $scope.rsvpId)
                                                                            .then(function () {
                                                                                $state.go('Main.Profile.Ticket');
                                                                            });
                                                                    } else {
                                                                        var obj1 = {
                                                                            Rsvp: 2,
                                                                            EventId: id,
                                                                            AccountId: $scope.userInfo.userId
                                                                        }
                                                                        $scope.paymentPromise = httpService.postData(obj1, 'Participants', $scope.userInfo.id)
                                                                            .then(function () {
                                                                                $state.go('Main.Profile.Ticket');
                                                                            });
                                                                    }

                                                                }
                                                            }, function (err) {
                                                                console.log(err);
                                                            })
                                                    }
                                                })(i);
                                            }
                                        }
                                    }, function (err) {
                                        console.log(err);
                                    })
                            })
                    } else {
                        $scope.showCardError = true;
                        $scope.cardErrMsg = "Selected Card is not Valid, Please Select or Add a Valid Card";
                    }
                }

            }
        }

    }
})();