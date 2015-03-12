/* jshint ignore:start */
'use strict';

angular.module('controllers.home', [])

.controller('MainCtrl', [
  '$scope',
  '$state',
  '$q',
  '$timeout',
  'Spotify',
function ($scope, $state, $q, $timeout, Spotify) {

  $scope.invalidUser = false;
  $scope.user = {};
  $scope.challenger = {};

  initiateUser();

  function initiateUser() {
    Spotify.setAuthToken(localStorage['spotify-token']);

    Spotify.getCurrentUser().then(function(currentUser){
      console.log(currentUser)
      $scope.user = currentUser;

    }, function(err){
      $state.go('logout');
    });
  }

  $scope.checkUserId = function (id) {
    Spotify.getUser(id).then(function(userData){
      $scope.challenger = userData;

      Spotify.userFollowingContains('user', id).then(function(isFollowing){
        $scope.challenger.IsFollowingUser = isFollowing;

        $state.go('compute', {'user': $scope.user, 'challenger': $scope.challenger});
      });
    }, function(err){
      $scope.invalidUser = true;
    });
  }

  $scope.logout = function () {
    $state.go('logout');
  }

}]);