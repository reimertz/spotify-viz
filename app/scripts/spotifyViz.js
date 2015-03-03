'use strict';

angular.module('spotifyViz', [
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ui.router',
  'ngMaterial',
  'controllers.logout',
  'controllers.home',
  'controllers.splash',
  'controllers.compute',
  'controllers.vizualize',
  'spotify',
  'qAllSettled'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider, SpotifyProvider) {

  SpotifyProvider.setClientId('835d8a553e434b99b9f2314d3fe6d90d');
  //SpotifyProvider.setRedirectUri('http://localhost:3000/callback.html');
  SpotifyProvider.setRedirectUri('https://reimertz.github.io/spotify-viz/callback.html');
  SpotifyProvider.setScope('playlist-read-private user-follow-read user-library-read');

  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('yellow');

  $stateProvider
  .state('splash', {
      url: '/',
      templateUrl: 'partials/splash.html',
      controller: 'SplashCtrl',
      authenticate: false
    })
    .state('main', {
      url: '/main',
      templateUrl: 'partials/main.html',
      controller: 'MainCtrl',
      authenticate: true
    })
    .state('computeHack', {
      url: '/compute',
      templateUrl: 'partials/compute.html',
      controller: 'ComputeCtrl',
      authenticate: true
    })
    .state('compute', {
      url: '/compute',
      templateUrl: 'partials/compute.html',
      controller: 'ComputeCtrl',
      params:      {'user': undefined, 'challenger': undefined},
      authenticate: true
    })
    .state('vizualizeHack', {
      url: '/vizualize',
      templateUrl: 'partials/vizualize.html',
      controller: 'VizualizeCtrl',
      authenticate: true
    })
    .state('vizualize', {
      url: '/vizualize',
      templateUrl: 'partials/vizualize.html',
      controller: 'VizualizeCtrl',
      params:      {'user': undefined, 'challenger': undefined},
      authenticate: true
    })
    .state('logout', {
      url: '/logout',
      templateUrl: 'partials/splash.html',
      controller: 'LogoutCtrl',
      authenticate: true
    });

  $urlRouterProvider.otherwise('/');

}).run(function($state, $rootScope) {

  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

    if(!toState.authenticate && !!localStorage['userId']) {
      event.preventDefault();

      $state.go('main');
    }
    else if(toState.authenticate && !localStorage['userId']) {
      event.preventDefault();

      $state.go('splash');
    }
  });

  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script');
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());

})

angular.module('qAllSettled', []).config(function($provide) {
  $provide.decorator('$q', function($delegate) {
    var $q = $delegate;
    $q.allSettled = function(promises) {
      return $q.all(promises.map(function(promise) {
        return promise.then(function(value) {
          return { state: 'fulfilled', value: value };
        }, function(reason) {
          return { state: 'rejected', reason: reason };
        });
      }));
    };
    return $q;
  });
});
