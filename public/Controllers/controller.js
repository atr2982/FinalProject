angular.module('myApp', ['ngRoute']).config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/signUp.html',
                controller: 'AppCtrl'
            }).when('/home', {
                templateUrl: '/views/homepage.html',
                controller: 'homepageCtrl'
            }).when('/mybeers', {
                templateUrl: '/views/myBeers.html',
                controller: 'myBeersCtrl'
            }).when('/wishlist', {
                templateUrl: '/views/wishList.html',
                controller: 'wishListCtrl'
            }).when('/bars', {
                templateUrl: '/views/bars.html',
                controller: 'barCtrl'
            })
            .when('/searchResults/:searchTerm', {
                templateUrl: '/views/searchResults.html',
                controller: 'resultsCtrl'
            }).when('/resultInfo/:searchTerm/:beerIndex', {
                templateUrl: '/views/result-info.html',
                controller: 'infoCtrl'
            }).otherwise('/')
}])

.run(['$rootScope', '$http', function ($rootScope, $http) {
        $http.get('/userCheck').success(function (response) {
            if(response){
                $rootScope.userObj = response;
            }
        });
}])

.factory('beerApi',['$http', function($http){
        var _clientId = '905F449B2E3DAB14D4138D35623F50858F2D105D',
            _clientSecret = 'B4DEB76167F86248BB68F5CDA7606A8EA2707752',
            _resultLimit = 10,
            _apiUrl = 'https://api.untappd.com/v4/search/beer?q=',
            _apiDetails = '&limit='+ _resultLimit +'&client_id='+_clientId +'&client_secret='+ _clientSecret,
            beerApi = {};

        beerApi.getList = function(searchTerm){
            var _concatUrl = _apiUrl + searchTerm +_apiDetails;
            return $http.get(_concatUrl);
        };

        beerApi.list = {};




        return beerApi;
}])

.controller('AppCtrl', ["$scope", "$rootScope", "$http", "$location", function ($scope, $rootScope, $http, $location) {

        $scope.signUp1 = false;
        $scope.signUp = function () {
            if ($scope.user.password != $scope.user.confirm) {
                $location.path('/');
                alert("passwords do not match");
            } else {
                $http.post('/beerdata', $scope.user).success(function (response) {
                    $location.path('/home');
                })
            }
        };

        $scope.login = function () {
            $http.post('/login', $scope.user).success(function (response) {
                $rootScope.userObj = response;
                $location.path('/home');
            })
        };
}])

.controller('homepageCtrl', ["$http", "$rootScope", "$scope", "$location", function ($http, $rootScope, $scope, $location) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

        $scope.homeEsc = function(){
            $location.path('/home');
        };

        $scope.logout = function () {
            $http.post('/logout');
            $rootScope.userObj = undefined;
            $location.path('/');
        };

        $scope.beerLocation = function(){
            $location.path('/mybeers');

        };

        $scope.bar = function(){
            $location.path('/bars');
        };

        $scope.recent = function(){

            var id = $rootScope.userObj._id;

            $http.get('/recent/' + id).success(function (response) {
                console.log('target: ',response.beers);

                $scope.recentList = response.beers;

            });

        };

        $scope.trending = function () {

            console.log("is it working?");

            $http.get("https://api.untappd.com/v4/beer/trending?client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
                .success(function (response) {
                    $scope.trendingBeers = response.response.micro.items;
                });
        };
}])

.controller('resultsCtrl', ["$http", "$rootScope", "$scope", "$location","$route","beerApi","$routeParams", function ($http, $rootScope, $scope, $location,$route, beerApi, $routeParams) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

        $scope.homeEsc = function(){
            $location.path('/home');
        };

        $scope.logout = function () {
            $http.post('/logout');
            $rootScope.userObj = undefined;
            $location.path('/');
        };

        $scope.bar = function(){
            $location.path('/bars');
        };

        beerApi.getList($routeParams.searchTerm)
            .success(function(response){
                console.log(response.response.beers.items);

                $scope.Data = response.response.beers.items;

                $scope.searchTerm = $routeParams.searchTerm;


            });
}])
.directive('starRating',
    function () {
        return {
            restrict: 'A',
            template: '<ul class="rating">' + '    <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' + '\u2605' + '</li>' + '</ul>',
            scope: {
                ratingValue: '=',
                max: '=',
                onRatingSelected: '&'
            },
            link: function (scope, elem, attrs) {
                var updateStars = function () {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };

                scope.toggle = function (index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating: index + 1
                    });
                };

                scope.$watch('ratingValue',
                    function (oldVal, newVal) {
                        if (newVal) {
                            updateStars();
                        }
                    }
                );
            }
        };
    }
)

.controller('infoCtrl', ["$http", "$rootScope", "$scope", "$location","$route","beerApi","$routeParams", function ($http, $rootScope, $scope, $location,$route, beerApi, $routeParams) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

        $scope.getLocation = function () {
            var x = document.getElementById("loc");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }

            function showPosition(position) {
                var clientId = 'BCLHOHAALKGEP1TSBVATOYJSIVOH0MB51NRQ24IFRKKRMHCO';
                var clientSecret = 'LOGV4UOQGXCIPHNTYMKPYX1IPKDSTMYGJY2ZD0XYZ2WDMXA5';
                var la = position.coords.latitude;
                var lo = position.coords.longitude;
                $http.get('https://api.foursquare.com/v2/venues/explore?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20130815&ll=' + la + '%2C' + lo + '&oauth_token=L2H43J5FGR3HFTNXFQP5OSYRZDDSUI4HXXW422QGT2JGO2W5&v=20151209&mode=url&query=beer').success(function (response) {
                    $rootScope.objArr = [];
                    $rootScope.locations = response.response.groups[0].items;
                });
            }
        };

        $scope.rateFunction = function(rating) {
            console.log(rating);
        };

        $scope.homeEsc = function(){
            $location.path('/home');
        };

        $scope.logout = function () {
            $http.post('/logout');
            $rootScope.userObj = undefined;
            $location.path('/');
        };

        $scope.bar = function(){
            $location.path('/bars');
        };

        beerApi.getList($routeParams.searchTerm)
            .success(function(response){
                $scope.beer = response.response.beers.items[$routeParams.beerIndex].beer;

                console.log('looking: ',$scope.beer);

            });

        $scope.checkin = function (name, label, style, abv, desc) {

            console.log("NOT WISHLIST");

            var beerstats = {
                type: "checkin",
                username: $rootScope.userObj.username,
                bname: name,
                blabel: label,
                bstyle: style,
                babv: abv,
                bdesc: desc
            };

            $http.put('/addcheckin', beerstats).success(function (response) {
                console.log(response);

                if(response){
                    $location.path('/mybeers')
                }
            });
        };

        $scope.wishList = function(name, label, style, abv, desc){

            console.log("WISHLIST");

            var wdata = $rootScope.userObj.username;

            var beerstats = {
                type: "wishlist",
                username: $rootScope.userObj.username,
                bname: name,
                blabel: label,
                bstyle: style,
                babv: abv,
                bdesc: desc
            };

            $http.put('/addwishlist', beerstats).success(function (response) {
                console.log(response);

                if(response){
                    $location.path('/mybeers')
                }
            })
        };
}])

.controller('myBeersCtrl', ["$http", "$rootScope", "$scope", "$location","$route", function ($http, $rootScope, $scope, $location,$route) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

        $scope.homeEsc = function(){
            $location.path('/home');
        };

        $scope.logout = function () {
            $http.post('/logout');
            $rootScope.userObj = undefined;
            $location.path('/');
        };

        $scope.bar = function(){
            $location.path('/bars');
        };


        $scope.deleteChecked = function (name) {

            var deletestats = {username: $rootScope.userObj.username, bname: name};

            console.log(deletestats);

            $http.put('/deletebeer', deletestats).success(function (response) {
                console.log(response);

                if(response){
                    $route.reload();
                }
            });
        };

        $scope.deleteWished = function (name) {

            var deletestats = {username: $rootScope.userObj.username, bname: name};

            console.log(deletestats);

            $http.put('/deletewish', deletestats).success(function (response) {
                console.log(response);

                if(response){
                    $route.reload();
                }
            });
        };


        $scope.checkin = function (name, label, style, abv, desc) {

            console.log("NOT WISHLIST");

            var beerstats = {
                type: "checkin",
                username: $rootScope.userObj.username,
                bname: name,
                blabel: label,
                bstyle: style,
                babv: abv,
                bdesc: desc
            };

            $http.put('/addcheckin', beerstats).success(function (response) {
                console.log(response);

                if(response){
                    $location.path('/mybeers')
                }
            });
        };

        $scope.wishList = function(name, label, style, abv, desc){

            console.log("WISHLIST");

            var wdata = $rootScope.userObj.username;

            var beerstats = {
                type: "wishlist",
                username: $rootScope.userObj.username,
                bname: name,
                blabel: label,
                bstyle: style,
                babv: abv,
                bdesc: desc
            };

            $http.put('/addwishlist', beerstats).success(function (response) {
                console.log(response);

                if(response){
                     $location.path('/mybeers')
                }
            })
        };

        $scope.checkedData = function(){

            var id = $rootScope.userObj._id;

            $http.get('/beerdata/' + id).success(function (response) {

                console.log("Front End:",response);

                $scope.checked = response.beers;
                $scope.wished = response.wishList;
            });
        };

    }])

.controller('wishListCtrl', ["$http", "$rootScope", "$scope", "$location", function ($http, $rootScope, $scope, $location) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

        $scope.homeEsc = function(){
            $location.path('/home');
        }

}])


.controller('barCtrl', ["$http", "$rootScope", "$scope", "$location", function ($http, $rootScope, $scope, $location) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

        $scope.homeEsc = function(){
            $location.path('/home');
        };


        $scope.logout = function () {
            $http.post('/logout');
            $rootScope.userObj = undefined;
            $location.path('/');
        };

        $scope.beerLocation = function(){
            $location.path('/mybeers');

        };



}]);