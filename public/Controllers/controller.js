angular.module('myApp',['ngRoute']).config(["$routeProvider",function ($routeProvider) {
        $routeProvider
              .when('/', {
                templateUrl: '/views/signUp.html',
                controller: 'AppCtrl'
            }).when('/home', {
                templateUrl: '/views/homepage.html',
                controller: 'homepageCtrl'
            })
 }])

.run(['$rootScope','$http', function($rootScope, $http) {
        $http.get('/userCheck').success(function(response){
            console.log(response);
            $rootScope.userObj = response;
        });
}])
.controller('AppCtrl',["$scope","$rootScope","$http","$location", function ($scope,$rootScope,$http,$location) {
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

        $scope.login = function(){
                $http.post('/login',$scope.user).success(function(response){//*data flow 3* $http(ajax call) to server.js file
                $rootScope.userObj = response;
                $location.path('/home');
            })
        };
}])

.controller('homepageCtrl',["$http","$rootScope","$scope","$location", function ($http,$rootScope,$scope,$location) {
    if($rootScope.userObj == undefined){
        $location.path('/')
    }

    console.log($rootScope.userObj);
    $scope.logout = function(){
          $http.post('/logout');
          $rootScope.userObj = undefined;
          $location.path('/');
      };

      $scope.getLocation = function() {
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
                      $http.get('https://api.foursquare.com/v2/venues/search?client_id='+clientId+'&client_secret='+clientSecret+'&v=20130815&ll='+la+','+lo+'&oauth_token=L2H43J5FGR3HFTNXFQP5OSYRZDDSUI4HXXW422QGT2JGO2W5&v=20151209&query=craft beer').success(function(response){
                          $rootScope.objArr = [];
//                          $rootScope.objArr.push(response.response.venues);
                          $rootScope.locations = response.response.venues;
                      });
              }
      };


}]);