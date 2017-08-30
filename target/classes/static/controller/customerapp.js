var app = angular.module('custApp', []);

app.controller('CustomerController', ['$window', '$scope', '$http', '$location', function ($window, $scope, $http, $location) {

        var vm = this;
        vm.customers = [];
        var username;
        $scope.create = function () {
            var url = "http://127.0.0.1:8080/customers/create/";

            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            };

            if ($scope.cust.password === $scope.cust.password1) {

                if ($scope.cust.gender === "") {
                    alert("Please select gender from the above");
                } else {
                    $http.post(url, $scope.cust, config).then(function (response) {

                        alert($scope.cust.firstName + " has been registered");
                        username = $scope.cust.firstName;
                        $window.location.href = "http://127.0.0.1:8080/home";
                    }, function (response) {
                        alert("Failed " + response);
                    });
                }

            } else {
                alert("Your passwords do not match");
            }

        };
    }]);