var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log("controller");

    
    
    var refresh = function() {
        $http.get('/beerdata').success(function (response) {
            console.log("i got the data i requested");
            $scope.userList = response;
            $scope.user = "";
        });
    };
    
    refresh();
    
    
    

    //SIGN-UP    SIGN-UP
    //*data flow 2* controller receives data from view when button is clicked below
    $scope.signUp = function () {

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
    
    
    $scope.remove = function(id) {
        console.log(id);  
        $http.delete('/beerdata/' + id).success(function(response) {
            refresh();
        });
    };
    
    
    $scope.edit = function(id) {
        console.log(id);  
        $http.get('/beerdata/' + id).success(function(response) {
            console.log(response);
            $scope.user = response;
        });
    };
    
    
    $scope.update = function() {
        console.log($scope.user._id);
        $http.put('/beerdata/' + $scope.user._id, $scope.user).success(function(response) {
            refresh();  
        })
    };
    
    
    $scope.clear = function() {
        console.log("deselect");
        $scope.user = "";   
    }
    
    
    
    
    
}]);