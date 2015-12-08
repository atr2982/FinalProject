
angular.module('myApp', ['ngRoute']).config(["$routeProvider",function ($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: '/views/signUp.html',
                controller: 'AppCtrl'

            }).when('/home', {
                templateUrl: '/views/homepage.html',
                controller: 'homepageCtrl'

            })

    }])

    .controller('AppCtrl',["$scope","$http","$location", function ($scope,$http,$location) {
        $scope.signUp1 = false;

        $scope.signUp = function(){

            if($scope.user.password != $scope.user.confirm){
                $location.path('/');
                alert("passwords do not match");
            }else{
                console.log($scope.user);
                $http.post('/beerdata',$scope.user).success(function(response){//*data flow 3* $http(ajax call) to server.js file
                    console.log(response);
                    $location.path('/home');

                })

            }

        };

    }])



    .controller('homepageCtrl',["$scope","$location", function ($scope,$location) {

      $scope.logout = function(){
          $location.path('/');
      };

    }]);



















//angular.module('myApp',['ngRoute']).config(["$routeProvider",function ($routeProvider) {
//    $routeProvider
//        .when('/', {
//            templateUrl: 'public/views/signUp.html',
//            controller: 'AppCtrl'
//
//        })
//
//
//}])

//.controller('AppCtrl',['$scope','$http','$location', function($scope,$http,$location){
//        console.log("controller");
//
//    //*data flow 2* controller receives data from view when button is clicked below
//    $scope.signUp = function(){
//
//            if($scope.user.password != $scope.user.confirm){
//                console.log("u suck")
//            }else{
//                console.log($scope.user);
//                $http.post('/beerdata',$scope.user).success(function(response){//*data flow 3* $http(ajax call) to server.js file
//                    console.log(response);
//                    $location.path('/homepage');
//
//                })
//
//              }
//
//           };
//
//}])
//
//.controller('homepageCtrl',['$scope','$http', function($scope,$http){
//
//
//
//
//}]);