var app = angular.module('app', ['ngCookies']);
app.controller('UserController', ['$window', '$scope', '$http', '$location', function ($window, $scope, $http, $location) {
        var config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };
        $scope.login = function () {
            var url = "http://127.0.0.1:8080/customers/login/";
            $http.post(url, $scope.user, config).then(function (response) {
                $scope.response = response.data;
                var name = $scope.response.firstName;
                var customer = name + " " + $scope.response.lastName;

                if (name === null) {
                    alert("Incorrect Username or password");
                } else {
                    alert("Signed in as " + name);

                    $window.localStorage.setItem('name', customer);
                    $window.localStorage.setItem('email', $scope.response.email);

                    $window.location.href = "http://127.0.0.1:8080/";
                }
            }, function (response) {
                alert("Failed to login");
            });
        };
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
app.controller('CartController', ['$window', '$scope', '$http', '$location',
    function ($window, $scope, $http) {
        var config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };

        $scope.getCartItem = function (product) {
            var url = "http://127.0.0.1:8080/cart/cartItem";
            $http.post(url, product, config).then(function (response) {
                $scope.cartItem = response.data;
                $window.location.href = "http://127.0.0.1:8080/cartItem";

            }, function () {
                alert("Item not found");
            });

        };
        $scope.showing = false;

        $scope.show = function () {
            $scope.showing = true;
        };
        $scope.getCart = function () {
            var url = "http://127.0.0.1:8080/cart/all";

            $http.get(url, config).then(function (response) {
                $scope.shoppingCart = response.data;
                $scope.name = $window.localStorage.getItem('name');
                $scope.email = $window.localStorage.getItem('email');

            }, function (response) {
                alert("Unable to get items");
            });
        };

        $scope.remove = function (product) {

            var url = "http://127.0.0.1:8080/cart/remove/";
            $http.post(url, product, config).then(function (response) {}, function (response) {
                alert("Removed");

            }, function (response) {
                alert("Unable to Remove Item");
            });

        };

        $scope.subTotal = function () {
            var url = "http://127.0.0.1:8080/cart/total";
            $http.get(url, config).then(function (response) {
                $scope.total = response.data;
                $window.localStorage.setItem('total', $scope.total);
            });
        };


        $scope.getAllOrders = function () {
            var url = "http://127.0.0.1:8080/orders/all";
            $http.get(url, config).then(function (response) {

                $scope.customerOrder = JSON.stringify(response.data);

                $window.location.href = "http://127.0.0.1:8080/orders";
            }, function (response) {
                alert("There are no orders at the moment");
            });
        };

        $scope.getOrders = function () {
            var url = "http://127.0.0.1:8080/orders/customers";
            $http.get(url, config).then(function (response) {

                $scope.customers = response.data;
                $window.location.href = "http://127.0.0.1:8080/orders";
            }, function (response) {
                alert("There are no orders at the moment");
            });
        };

        $scope.placeOrder = function () {
            var url = "http://127.0.0.1:8080/placecheckout";

            var tot = $window.localStorage.getItem('total');
            var wrapper = {
                cart: $scope.shoppingCart,
                email: $window.localStorage.getItem('email'),
                address: $scope.address,
                payment: $scope.payment.expiryMonth,
                total: tot
            };

            alert("Total : R " + wrapper.total);
            $http.post(url, wrapper.cart, config).then(function (response) {

                alert("Please wait while we process your order");
                var newURL = "http://127.0.0.1:8080/orders/placeorder";

                wrapper = {
                    cart: response.data, //List<OrderLine> orders...
                    email: $window.localStorage.getItem('email'),
                    address: $scope.address,
                    payment: $scope.payment.expiryMonth,
                    total: tot
                };
                alert(wrapper.total);
                $http.post(newURL, wrapper, config).then(function (response) {
                    alert("Success!!");
                }, function (response) {
                    alert("Failed to place order\n" + angular.toJson(response));
                });
            }, function (response) {
                //failure callback
            });
        };

    }]);
app.controller('StockController', ['$window', '$scope', '$http', '$location', '$cookies',
    function ($window, $scope, $http, $location, $cookies) {
        var config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };

        $scope.addToCart = function (product) {
            var url = "http://127.0.0.1:8080/cart/add";
            
            $http.post(url, product, config).then(function () {
                alert("Added to cart");
            }, function () {
                alert("Unable to add");
            });
        };
        $scope.delete = function (product) {
            var url = "http://127.0.0.1:8080/product/delete";
            $http.post(url, product, config).then(function (response) {
                alert("Removed");
                $window.location.href = "http://127.0.0.1:8080/test1";
            }, function (response) {
                alert("Failed");
            });
        };

        $scope.getStock = function () {
            var url = "http://127.0.0.1:8080/product/all";
            $http.get(url, config).then(function (response) {
                $scope.response = response.data;
                $scope.products = $scope.response;
            }, function (response) {
                alert("Unable to get items");
            });
        };


    }]);

app.controller('HomeController', ['$window', '$scope', '$http', function ($window, $scope, $http) {


        $scope.products = [];

        $scope.getStock = function () {
            var url = "http://127.0.0.1:8080/product/all";
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            };

            $http.post(url, $scope.cust, config).then(function (response) {
                $scope.products = response.data;
            }, function (response) {
                alert("Unable to retrieve items");
            });

        };
        $scope.loadProduct = function () {
            var url = "http://127.0.0.1:8080/product/create/";
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

app.controller('AdministrativeController', ['$window', '$scope', '$http', '$location', function ($window, $scope, $http, $location) {
        var config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };

        $scope.fetchOrders = function () {
            var url = "http://127.0.0.1:8080/orders/all";
            $http.get(url, config).then(function (response) {
                $scope.response = response.data;
            });
        };
        
        
        $scope.orderDetailedVisibility = false;
        $scope.orderListVisibility = false; 
        $scope.productListVisibility = false; 
        $scope.productFormVisibility = false;
        
        $scope.viewOrder = function (order) {

            var url = "http://127.0.0.1:8080/orders/findone";
            $http.post(url, order, config).then(function (response) {
                $scope.thisOrder = order;
                $scope.currentOrder = response.data;
                $scope.orderVisibility = true;
            });
        };
        $scope.getStock = function () {
            var url = "http://127.0.0.1:8080/product/all";
            $http.get(url, config).then(function (response) {
                $scope.response = response.data;
                $scope.products = $scope.response;
            }, function (response) {
                alert("Unable to get items");
            });
        };

        $scope.delete = function (product) {
            var url = "http://127.0.0.1:8080/product/delete";
            $http.post(url, product, config).then(function (response) {
                alert("Removed");
                $window.location.href = "http://127.0.0.1:8080/test1";
            }, function (response) {
                alert("Failed");
            });
        };

        $scope.addStock = function () {
            var url = "http://127.0.0.1:8080/product/add/";
            $http.post(url, $scope.stock, config).then(function (response) {

                alert("Success!!");
                $window.location.href = "http://127.0.0.1:8080/test1";
            }, function (response) {
                alert("Failed " + response);
            });
        };
        
        $scope.selectedUploadFile;
        $scope.uploadFile = function () {
            //get Stock number
            var formData = new FormData();
            formData.append('file', $scope.selectedUploadFile);
            formData.append('name', $scope.stock.name);
            formData.append('barcodeId', $scope.stock.barcodeId);
            formData.append('category', $scope.stock.category);
            formData.append('department', $scope.stock.department);
            formData.append('price', $scope.stock.price);
            
            
            
            $http.post('http://localhost:8080/product/fileUpload/', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function () {
                alert("Success");
            }, function () {
                alert("Success");
                $window.location.href = "http://127.0.0.1:8080/test1";
            });
        };
        
        
        $scope.loginAdmin = function () {
            var url = "http://127.0.0.1:8080/admin/login/";
            $http.post(url, $scope.user, config).then(function (response) {
                $scope.response = response.data;
                var name = $scope.response.email;
                if (name === null) {
                    alert("Incorrect Username or password");
                } else {
                    $window.location.href = "http://127.0.0.1:8080/test1";
                }
            }, function (response) {
                alert("Failed to login");
            });
        };
    }]);


app.controller('CheckoutController', ['$window', '$scope', '$http', '$location', function ($window, $scope, $http, $location) {
        var config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };

        $scope.getCartItem = function (product) {
            var url = "http://127.0.0.1:8080/cart/cartItem";
            $http.post(url, product, config).then(function (response) {
                $scope.cartItem = response.data;
                $window.location.href = "http://127.0.0.1:8080/cartItem";

            }, function () {
                alert("Item not found");
            });

        };

        $scope.getCart = function () {
            var url = "http://127.0.0.1:8080/cart/all";
            $http.get(url, config).then(function (response) {
                $scope.shoppingCart = response.data;
            }, function (response) {
                alert("Unable to get items");
            });
        };

        $scope.subTotal = function () {
            var url = "http://127.0.0.1:8080/cart/total";
            $http.get(url, config).then(function (response) {
                $scope.total = response.data;
            });
        };

    }]);

app.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});