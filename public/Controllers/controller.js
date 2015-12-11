angular.module('myApp', ['ngRoute']).config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/signUp.html',
            controller: 'AppCtrl'
        }).when('/home', {
            templateUrl: '/views/homepage.html',
            controller: 'homepageCtrl'
        })
 }])


.run(['$rootScope', '$http', function ($rootScope, $http) {
    $http.get('/userCheck').success(function (response) {
        if(response){
            $rootScope.userObj = response;
        }
    });
}])


.controller('AppCtrl', ["$scope", "$rootScope", "$http", "$location", function ($scope, $rootScope, $http, $location) {
    $scope.signUp1 = false;
    $scope.signUp = function () {
        if ($scope.user.password != $scope.user.confirm) {
            $location.path('/');
            alert("passwords do not match");
        } else {
            $http.post('/beerdata', $scope.user).success(function (response) { //*data flow 3* $http(ajax call) to server.js file
                $location.path('/home');
            })
        }
    };

    $scope.login = function () {
        $http.post('/login', $scope.user).success(function (response) { //*data flow 3* $http(ajax call) to server.js file
            $rootScope.userObj = response;
            $location.path('/home');
        })
    };
}])


.controller('homepageCtrl', ["$http", "$rootScope", "$scope", "$location", function ($http, $rootScope, $scope, $location) {
    if ($rootScope.userObj == undefined) {
        $location.path('/')
    }

    $scope.logout = function () {
        $http.post('/logout');
        $rootScope.userObj = undefined;
        $location.path('/');
    };

    //SEARCH
    //SEARCH    
    //*data flow 2* controller receives data from view when button is clicked below
    $scope.search = function () {

        $http.get("https://api.untappd.com/v4/search/beer?q=" + $scope.search.term + "&limit=10&client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
            .success(function (response) {
                $scope.beers = response.response.beers.items;
            });
    };

    //TRENDING
    //TRENDING   
    //*data flow 2* controller receives data from view when button is clicked below
    $scope.trending = function () {

        $http.get("https://api.untappd.com/v4/beer/trending?client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
            .success(function (response) {
                $scope.trendingBeers = response.response.micro.items;
            });
    };

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
            $http.get('https://api.foursquare.com/v2/venues/search?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20130815&ll=' + la + ',' + lo + '&oauth_token=L2H43J5FGR3HFTNXFQP5OSYRZDDSUI4HXXW422QGT2JGO2W5&v=20151209&query=craft beer').success(function (response) {
                $rootScope.objArr = [];
                //                          $rootScope.objArr.push(response.response.venues);
                $rootScope.locations = response.response.venues;
            });
        }
    };


}]);

//    //GET USER DATA
//    //GET USER DATA
//    var refresh = function () {
//        $http.get('/beerdata').success(function (response) {
//            console.log("i got the data i requested");
//            $scope.userList = response;
//            $scope.user = "";
//        });
//    };
//
//    refresh();
//
//    //REMOVE
//    //REMOVE  
//    $scope.remove = function (id) {
//        console.log(id);
//        $http.delete('/beerdata/' + id).success(function (response) {
//            refresh();
//        });
//    };
//
//    //EDIT
//    //EDIT    
//    $scope.edit = function (id) {
//        console.log(id);
//        $http.get('/beerdata/' + id).success(function (response) {
//            console.log(response);
//            $scope.user = response;
//        });
//    };
//
//    //UPDATE
//    //UPDATE     
//    $scope.update = function () {
//        console.log($scope.user._id);
//        $http.put('/beerdata/' + $scope.user._id, $scope.user).success(function (response) {
//            refresh();
//        })
//    };
//
//    //CLEAR
//    //CLEAR     
//    $scope.clear = function () {
//        console.log("deselect");
//        $scope.user = "";
//    }