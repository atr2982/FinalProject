var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {

    
    //GET USER DATA
    //GET USER DATA
    var refresh = function() {
        $http.get('/beerdata').success(function (response) {
            console.log("i got the data i requested");
            $scope.userList = response;
            $scope.user = "";
        });
    };
    
    refresh();
    
    
    //SIGN-UP
    //SIGN-UP    
    //*data flow 2* controller receives data from view when button is clicked below
    $scope.signUp = function() {

        if ($scope.user.password != $scope.user.confirm) {
            console.log("passwords don't match");
            return;
        }
            
        console.log($scope.user);
        $http.post('/beerdata', $scope.user).success(function (response) { //*data flow 3* $http(ajax call) to server.js file
            console.log(response);
            refresh();
        });
    };
    
    //REMOVE
    //REMOVE  
    $scope.remove = function(id) {
        console.log(id);  
        $http.delete('/beerdata/' + id).success(function(response) {
            refresh();
        });
    };
    
    //EDIT
    //EDIT    
    $scope.edit = function(id) {
        console.log(id);  
        $http.get('/beerdata/' + id).success(function(response) {
            console.log(response);
            $scope.user = response;
        });
    };
    
    //UPDATE
    //UPDATE     
    $scope.update = function() {
        console.log($scope.user._id);
        $http.put('/beerdata/' + $scope.user._id, $scope.user).success(function(response) {
            refresh();  
        })
    };
    
    //CLEAR
    //CLEAR     
    $scope.clear = function() {
        console.log("deselect");
        $scope.user = "";   
    }
    
    
    //SEARCH
    //SEARCH    
    //*data flow 2* controller receives data from view when button is clicked below
    $scope.search = function() {
            
        console.log($scope.search.term);
            $http.get("https://api.untappd.com/v4/search/beer?q=" + $scope.search.term + "&limit=10&client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
            .success(function(response){
                $scope.details = response;
                console.log(response);
            });
    };
    
    
    
    
    
}]);