/**
 * Created by patrickhalton on 12/1/15.
 */

var myApp = angular.module('myApp',[]);

myApp.controller('AppCtrl',['$scope','$http', function($scope,$http){
        console.log("controller");


    //*data flow 2* controller receives data from view when button is clicked below
    $scope.signUp = function(){

            if($scope.user.password != $scope.user.confirm){
                console.log("u suck")
            }else{
                console.log($scope.user);
                $http.post('/beerdata',$scope.user).success(function(response){//*data flow 3* $http(ajax call) to server.js file
                    console.log(response);
                })

                 }
           };

}]);
