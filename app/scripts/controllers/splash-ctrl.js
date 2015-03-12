/* jshint ignore:start */
'use strict';

angular.module('controllers.splash', [])

.controller('SplashCtrl', [
  '$scope',
  '$state',
  '$interval',
  'Spotify',

function ($scope, $state, $interval, Spotify) {

  $scope.currentCategory = 0;

  function rotateCategory(){
    $scope.currentCategory += 1;
    console.log($scope.currentCategory);
  }

  $interval(rotateCategory, 2500);

  $scope.login = function () {
    Spotify.login().then(function (data) {
      Spotify.getCurrentUser().then(function (currentUser) {

        localStorage.userId = currentUser.id;

        $state.go('main');
      });
    })
  };

}]);
