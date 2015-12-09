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

.controller('AppCtrl', ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.signUp1 = false;

    $scope.signUp = function () {

        if ($scope.user.password != $scope.user.confirm) {
            $location.path('/');
            alert("passwords do not match");
        } else {
            console.log($scope.user);
            $http.post('/beerdata', $scope.user).success(function (response) { //*data flow 3* $http(ajax call) to server.js file
                console.log(response);
                $location.path('/home');

            })

        }

    };

}])

.controller('homepageCtrl', ["$scope", "$http", "$location", function ($scope, $http, $location) {

    $scope.logout = function () {
        $location.path('/');
    };

    //GET USER DATA
    //GET USER DATA
    var refresh = function () {
        $http.get('/beerdata').success(function (response) {
            console.log("i got the data i requested");
            $scope.userList = response;
            $scope.user = "";
        });
    };

    refresh();

    //REMOVE
    //REMOVE  
    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/beerdata/' + id).success(function (response) {
            refresh();
        });
    };

    //EDIT
    //EDIT    
    $scope.edit = function (id) {
        console.log(id);
        $http.get('/beerdata/' + id).success(function (response) {
            console.log(response);
            $scope.user = response;
        });
    };

    //UPDATE
    //UPDATE     
    $scope.update = function () {
        console.log($scope.user._id);
        $http.put('/beerdata/' + $scope.user._id, $scope.user).success(function (response) {
            refresh();
        })
    };

    //CLEAR
    //CLEAR     
    $scope.clear = function () {
        console.log("deselect");
        $scope.user = "";
    }

    //SEARCH
    //SEARCH    
    //*data flow 2* controller receives data from view when button is clicked below
    $scope.search = function () {

        console.log($scope.search.term);
        $http.get("https://api.untappd.com/v4/search/beer?q=" + $scope.search.term + "&limit=10&client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
            .success(function (response) {
                $scope.beers = response.response.beers.items;
                console.log(response);
            });
    };
    
    //TRENDING
    //TRENDING   
    //*data flow 2* controller receives data from view when button is clicked below
    $scope.trending = function () {

        console.log($scope.search.term);
        $http.get("https://api.untappd.com/v4/beer/trending?client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
            .success(function (response) {
                $scope.trendingBeers = response.response.micro.items;
                console.log(response);
            });
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}]);