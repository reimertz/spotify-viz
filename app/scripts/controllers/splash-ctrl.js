'use strict';

angular.module('controllers.splash', [])

.controller('SplashCtrl', [
  '$scope',
  'Spotify',
  '$state',
function ($scope, Spotify, $state) {

  $scope.login = function () {
    Spotify.login().then(function (data) {
      Spotify.getCurrentUser().then(function (currentUser) {

        localStorage['userId'] = currentUser.id;

        $state.go('main');
      });
    })
  };

}]);
