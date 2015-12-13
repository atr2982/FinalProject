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

    $scope.beerLocation = function(){
        $location.path('/mybeers');

    };

    $scope.bar = function(){
        $location.path('/bars');
    };

    //SEARCH
    //SEARCH    
    //*data flow 2* controller receives data from view when button is clicked below


    //TRENDING
    //TRENDING   
    //*data flow 2* controller receives data from view when button is clicked below
    $scope.trending = function () {

        $http.get("https://api.untappd.com/v4/beer/trending?client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
            .success(function (response) {
                $scope.trendingBeers = response.response.micro.items;
            });
    };



}])

.controller('myBeersCtrl', ["$http", "$rootScope", "$scope", "$location","$route", function ($http, $rootScope, $scope, $location,$route) {

        $scope.logout = function () {
            $http.post('/logout');
            $rootScope.userObj = undefined;
            $location.path('/');
        };

        $scope.bar = function(){
            $location.path('/bars');
        }

        $scope.search = function () {

            $http.get("https://api.untappd.com/v4/search/beer?q=" + $scope.search.term + "&limit=10&client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
                .success(function (response) {
                    $scope.beers = response.response.beers.items;
                });
        };

        $scope.checkin = function (name, label, style, abv, desc) {

            var bdata = $rootScope.userObj.username;

            var k = {username: $rootScope.userObj.username,
                bname: name,
                blabel: label,
                bstyle: style,
                babv: abv,
                bdesc: desc};

//        console.log(k);


            $http.put('/beerdata/' + bdata, k).success(function (response) {
                console.log(response);


            });

        };

//        $scope.deleteChecked = function(){
//
//            var id = $rootScope.userObj._id;
//
//            $http.get('/beerdata/' + id).success(function (response) {
//                console.log(response);
//
//            })
//
//        };

        $scope.wishList = function(name, label, style, abv, desc){

            console.log('working');

            var uData = $rootScope.userObj.username;

            var obj = {username: $rootScope.userObj.username,
                wname: name,
                wlabel: label,
                wstyle: style,
                wabv: abv,
                wdesc: desc};


            $http.put('/beerdata/' + uData, obj).success(function (response) {
                console.log('wish: ',response);

            })

        };

        $scope.checkedData = function(){

            console.log('function is working');

            var id = $rootScope.userObj._id

            $http.get('/beerdata/' + id).success(function (response) {
//                console.log(response.beers[0].bname);

                $scope.checked = response.beers;


            });

            $http.get('/beerdata/' + id).success(function (response) {
                console.log('wished:',response.wishBeers);

                $scope.wished = response.wishBeers;

            });



        }



    }])

.controller('wishListCtrl', ["$http", "$rootScope", "$scope", "$location", function ($http, $rootScope, $scope, $location) {


}])


.controller('barCtrl', ["$http", "$rootScope", "$scope", "$location", function ($http, $rootScope, $scope, $location) {

        $scope.logout = function () {
            $http.post('/logout');
            $rootScope.userObj = undefined;
            $location.path('/');
        };

        $scope.beerLocation = function(){
            $location.path('/mybeers');

        };


        //LOCATION
        //LOCATION
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