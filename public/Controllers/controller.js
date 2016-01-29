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
            }).when('/checkInfo/:bname', {
                templateUrl: '/views/checkInfo.html',
                controller: 'checkInfo'
            }).when('/wishListInfo/:bname', {
                templateUrl: '/views/wishListMeta.html',
                controller: 'wishInfo'
            }).when('/trending', {
                templateUrl: '/views/trending.html',
                controller: 'trendingCtrl'
            })
            .otherwise('/')
}])

.run(['$rootScope', '$http', function ($rootScope, $http) {
        $http.get('/userCheck').success(function (response) {
            if(response){
                $rootScope.userObj = response;
            }
        }).error(function(err){
                return err;
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

.directive('ngSlideDown', [
    '$timeout',
    function ($timeout) {
      var getTemplate, link;
      getTemplate = function (tElement, tAttrs) {
        if (tAttrs.lazyRender !== void 0) {
          return '<div ng-if=\'lazyRender\' ng-transclude></div>';
        } else {
          return '<div ng-transclude></div>';
        }
      };
      link = function (scope, element, attrs, ctrl, transclude) {
        var closePromise, duration, elementScope, emitOnClose, getHeight, hide, lazyRender, onClose, show;
        duration = attrs.duration || 1;
        elementScope = element.scope();
        emitOnClose = attrs.emitOnClose;
        onClose = attrs.onClose;
        lazyRender = attrs.lazyRender !== void 0;
        if (lazyRender) {
          scope.lazyRender = scope.expanded;
        }
        closePromise = null;
        element.css({
          overflow: 'hidden',
          transitionProperty: 'height',
          transitionDuration: '' + duration + 's',
          transitionTimingFunction: 'ease-in-out'
        });
        getHeight = function (passedScope) {
          var c, children, height, _i, _len;
          height = 0;
          children = element.children();
          for (_i = 0, _len = children.length; _i < _len; _i++) {
            c = children[_i];
            height += c.clientHeight + 22;
          }
          return '' + height + 'px';
        };
        show = function () {
          if (closePromise) {
            $timeout.cancel(closePromise);
          }
          if (lazyRender) {
            scope.lazyRender = true;
          }
          return element.css('height', getHeight());
        };
        hide = function () {
          element.css('height', '0px');
          if (emitOnClose || onClose || lazyRender) {
            return closePromise = $timeout(function () {
              if (emitOnClose) {
                scope.$emit(emitOnClose, {});
              }
              if (onClose) {
                elementScope.$eval(onClose);
              }
              if (lazyRender) {
                return scope.lazyRender = false;
              }
            }, duration * 1000);
          }
        };
        scope.$watch('expanded', function (value, oldValue) {
          if (value) {
            return $timeout(show);
          } else {
            return $timeout(hide);
          }
        });
        return scope.$watch(getHeight, function (value, oldValue) {
          if (scope.expanded && value !== oldValue) {
            return $timeout(show);
          }
        });
      };
      return {
        restrict: 'A',
        scope: { expanded: '=ngSlideDown' },
        transclude: true,
        link: link,
        template: function (tElement, tAttrs) {
          return getTemplate(tElement, tAttrs);
        }
      };
    }])

.controller('AppCtrl', ["$scope", "$rootScope", "$http", "$location", function ($scope, $rootScope, $http, $location) {
    $scope.errorShow = false;    
    
    if ($rootScope.userObj) {
            $location.path('/home')
        }

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
            }).error(function(err) {
                console.log(err);
                
                if (err === "Unauthorized") {
                    $scope.errorShow = true;
                }
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

        $scope.trendingDirect = function(){
          $location.path('/trending');
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

        $scope.wishListDirect = function(){
            $location.path('/wishlist')

        };

        $scope.recent = function(){
            var id = $rootScope.userObj._id;
            $http.get('/recent/' + id).success(function (response) {
                $scope.recentList = response.beers;
            });
        };
}])

.controller('resultsCtrl', ["$http", "$rootScope", "$scope", "$location","$route","beerApi","$routeParams", function ($http, $rootScope, $scope, $location,$route, beerApi, $routeParams) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        };

        $scope.loading = true;

        $scope.homeEsc = function(){
            $location.path('/home');
        };

        $scope.wishListDirect = function(){
            $location.path('/wishlist')
        };

        $scope.trendingDirect = function(){
            $location.path('/trending');
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
        beerApi.getList($routeParams.searchTerm)
            .success(function(response){
                $scope.loading = false;
                $scope.Data = response.response.beers.items;
                $scope.searchTerm = $routeParams.searchTerm;

            });


}])

.directive('ngEnter', function() {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
})


.directive('starRating',
    function () {
        return {
            restrict: 'A',
            template: '<ul class="rating">' + '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' + '\u2605' + '</li>' + '</ul>',
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
        };
    
    
        $scope.checkedData = function(){
            var id = $rootScope.userObj._id;
            
            $http.get('/beerdata/' + id).success(function (response) {
                console.log("the beer n stuff: ", response.beers);
                $rootScope.checked = response.beers;
                $rootScope.wished = response.wishList;
                
                console.log($scope.checked);
            });
        };
    
        console.log("und", $rootScope.checked);


        $scope.loading = true;


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

        $scope.beerLocation = function(){
            $location.path('/mybeers');
        };

        $scope.bar = function(){
            $location.path('/bars');
        };

        beerApi.getList($routeParams.searchTerm)
            .success(function(response){
                $scope.loading = false;

                $scope.beer = response.response.beers.items[$routeParams.beerIndex].beer;
            });

//        $scope.checkin = function (name, label, style, abv, desc, usercheckin ,rating) {
//            console.log("RATING RAW", rating);
//            
//            var beerstats = {
//                type: "checkin",
//                username: $rootScope.userObj.username,
//                bname: name,
//                blabel: label,
//                bstyle: style,
//                babv: abv,
//                bdesc: desc,
//                blocation : usercheckin.location,
//                buserinput : usercheckin.desc,
//                brating : rating
//            };
//
//            console.log("RATING AFTER", beerstats.brating);
//            
//            
//            $http.put('/addcheckin', beerstats).success(function (response) {
//                if(response){
//                    $location.path('/mybeers')
//                }
//            });
//        };
    
    
    
        $scope.checkin = function (name, label, style, abv, desc, usercheckin, rating) {
            
            var counter = 0;
            
            


            var id = $rootScope.userObj._id;

            $http.get('/beerdata/' + id).success(function (response) {
                console.log("RESPONSE:", response.beers, response.beers.length);

                console.log(name);
                for (i = 0; i < response.beers.length; i++) {
                    
                    console.log(response.beers[i].bname);
                    

                    if (response.beers[i].bname == name) {
                        
                        $scope.message = true;

                        console.log("the same");
                        counter = 1;
                        
                        break;
                        
                    };
                };
                
                if (counter == 1) {
                    return;   
                }
                else if (counter == 0) {
                    var beerstats = {
                        type: "checkin",
                        username: $rootScope.userObj.username,
                        bname: name,
                        blabel: label,
                        bstyle: style,
                        babv: abv,
                        bdesc: desc,
                        blocation : usercheckin.location,
                        buserinput : usercheckin.desc,
                        brating : rating
            };

                    $http.put('/addcheckin', beerstats).success(function (response) {
                        if (response) {
                            $location.path('/mybeers')
                        }
                    });
                }
                
                console.log(counter);
            });
            

        };

        $scope.wishList = function(name, label, style, abv, desc){
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
                if(response){
                    $location.path('/wishlist')
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

        $scope.wishListDirect = function(){
            $location.path('/wishlist')
        };

        $scope.trendingDirect = function(){
            $location.path('/trending');
        };

        $scope.logout = function () {
            $http.post('/logout');
            $rootScope.userObj = undefined;
            $location.path('/');
        };

        $scope.bar = function(){
            $location.path('/bars');
        };

        $scope.loading = true;

        $scope.alcMeta = false;

        $scope.deleteChecked = function (name) {
            var deletestats = {username: $rootScope.userObj.username, bname: name};
            $http.put('/deletebeer', deletestats).success(function (response) {
                if(response){

                    $route.reload();
                }
            });
        };

        $scope.getBeerCheck = function(){
            var id = $rootScope.userObj._id;
            var beerObj = { _id : id,
                bname : $routeParams.bname
            };
            $http.put('/brewInfo', beerObj).success(function (response) {
                console.log("the beer: ", response.beers);

                $scope.finalMeta = response.beers;
            })
        };

        $scope.checkin = function (name, label, style, abv, desc) {
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
                if(response){
                    $location.path('/mybeers')
                }
            });
        };

        $scope.checkedData = function(){
            var id = $rootScope.userObj._id;
            $http.get('/beerdata/' + id).success(function (response) {
                console.log("the beer: ", response.beers);

                $scope.loading = false;
                $scope.checked = response.beers;
                $scope.wished = response.wishList;
            });
        };
 }])

.controller('wishListCtrl', ["$http", "$rootScope", "$scope", "$location","$route", function ($http, $rootScope, $scope, $location,$route) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

        $scope.homeEsc = function(){
            $location.path('/home');
        };

        $scope.trendingDirect = function(){
            $location.path('/trending');
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

        $scope.loading = true;


        $scope.deleteWished = function (name) {
            var deletestats = {username: $rootScope.userObj.username, bname: name};
            $http.put('/deletewish', deletestats).success(function (response) {
                if(response){
                    $route.reload();
                }
            });
        };

        $scope.alcMeta = false;

        $scope.wishList = function(name, label, style, abv, desc){
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
                if(response){
                    $location.path('/mybeers')
                }
            })
        };

        $scope.checkedData = function(){
            var id = $rootScope.userObj._id;
            $http.get('/beerdata/' + id).success(function (response) {
                $scope.loading = false;
                $scope.wished = response.wishList;
            });
        };

        $scope.getBeerWish = function(){
            var id = $rootScope.userObj._id;
            var wishObj = { _id : id,
                bname : $routeParams.bname
            };
            $http.put('/brewWish', wishObj).success(function (response) {

                $scope.finalMeta = response.wishList;
            })
        };

}])

.controller('checkInfo', ["$http", "$rootScope", "$scope", "$location","$routeParams", function ($http, $rootScope, $scope, $location, $routeParams) {

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

        console.log($routeParams.bname);
//        $scope.getBeerCheck = function(){
//            var id = $rootScope.userObj._id;
//            var beerObj = { _id : id,
//                bname : $routeParams.bname
//            };
//            $http.put('/brewInfo', beerObj).success(function (response) {
//                console.log("the beer: ", response.beers);
//                $scope.finalMeta = response.beers;
//            })
//        };

    $scope.homeEsc = function(){
        $location.path('/home');
    }

}])

.controller('wishInfo', ["$http", "$rootScope", "$scope", "$location","$routeParams", function ($http, $rootScope, $scope, $location, $routeParams) {

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

        console.log($routeParams.bname);


        $scope.homeEsc = function(){
            $location.path('/home');
        }

}])

.controller('trendingCtrl', ["$http", "$rootScope", "$scope", "$location", function ($http, $rootScope, $scope, $location) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

        $scope.homeEsc = function(){
            $location.path('/home');
        };

        $scope.wishListDirect = function(){
            $location.path('/wishlist')
        };

        $scope.trendingDirect = function(){
            $location.path('/trending');
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

        $scope.trending = function () {

            $scope.loading = true;

            $http.get("https://api.untappd.com/v4/beer/trending?client_id=905F449B2E3DAB14D4138D35623F50858F2D105D&client_secret=B4DEB76167F86248BB68F5CDA7606A8EA2707752")
                .success(function (response) {
                    $scope.loading = false;
                    $scope.trendingBeers = response.response.micro.items;
                    console.log($scope.trendingBeers);
                });
        };

}])

.controller('barCtrl', ["$http", "$rootScope", "$scope", "$location", function ($http, $rootScope, $scope, $location) {

        if ($rootScope.userObj == undefined) {
            $location.path('/')
        }

    $scope.getLocation = function () {

        $scope.loading = true;

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
            
            la = 40.953976; 
            lo = -90.362549;
                
            $http.get('https://api.foursquare.com/v2/venues/explore?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20130815&ll=' + la + '%2C' + lo + '&oauth_token=L2H43J5FGR3HFTNXFQP5OSYRZDDSUI4HXXW422QGT2JGO2W5&v=20151209&mode=url&query=beer&limit=20').success(function (response) {
                $scope.loading = false;

                $rootScope.objArr = [];
                $rootScope.locations = response.response.groups[0].items;
                
                
                for (i = 0; i < $rootScope.locations.length; i++) {
                $rootScope.locations[i].venue.location.distance = Math.round((($rootScope.locations[i].venue.location.distance * 0.000621371192)*100))/100;  
                }
                $rootScope.locations.sort(function (a, b) {
                    return a.venue.location.distance - b.venue.location.distance;
                });
                
                console.log($rootScope.locations);

            });
        }
    };

        $scope.homeEsc = function(){
            $location.path('/home');
        };

        $scope.wishListDirect = function(){
            $location.path('/wishlist')
        };

        $scope.trendingDirect = function(){
            $location.path('/trending');
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