'use strict';

angular.module('controllers.vizualize', [])

.controller('VizualizeCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  '$q',
  '$timeout',
  'Spotify',
  '$mdToast',
function ($scope, $state, $stateParams, $q, $timeout, Spotify, $mdToast) {
  if(!$stateParams.user || !$stateParams.challenger){
    return $state.go('main');
  }
  $scope.user = $stateParams.user;
  $scope.challenger = $stateParams.challenger;

  calculateHipsterValues();
  calculateSuperstarValues();
  calculateGiverValues();
  calculateCollaboratorValues();
  calculateHoarderValues();

  function calculateHipsterValues(){

    $scope.user.popularity = parseInt($scope.user.popularity);
    $scope.challenger.popularity = parseInt($scope.challenger.popularity);

    $scope.hipsterClass = ($scope.user.popularity < $scope.challenger.popularity) ? "user" : "challenger";

    $scope.wonHipster =  $scope[$scope.hipsterClass];
    $scope.wonHipsterName = $scope.wonHipster.display_name || $scope.wonHipster.id;

    $scope.lostHipster = ($scope.wonHipster === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostHipsterName = $scope.lostHipster.display_name || $scope.lostHipster.id;

    $scope.userHipsterPercentage = ($scope.user.popularity / ($scope.user.popularity + $scope.challenger.popularity)) * 100;
    $scope.challengerHipsterPercentage = ($scope.challenger.popularity / ($scope.user.popularity + $scope.challenger.popularity)) * 100;

    $scope.userHipsterPercentage = 100 - mEGo($scope.userHipsterPercentage);
    $scope.challengerHipsterPercentage = 100 -mEGo($scope.challengerHipsterPercentage);
  }


  function calculateSuperstarValues(){

    $scope.superstarClass = ($scope.user.followers.total > $scope.challenger.followers.total) ? "user" : "challenger";

    $scope.wonSuperstar =  $scope[$scope.superstarClass];
    $scope.wonSuperstarName = $scope.wonSuperstar.display_name || $scope.wonSuperstar.id;

    $scope.lostSuperstar = ($scope.wonSuperstar === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostSuperstarName = $scope.lostSuperstar.display_name || $scope.lostSuperstar.id;

    $scope.userSuperstarPercentage = ($scope.user.followers.total / ($scope.user.followers.total + $scope.challenger.followers.total)) * 100;
    $scope.challengerSuperstarPercentage = ($scope.challenger.followers.total / ($scope.user.followers.total + $scope.challenger.followers.total)) * 100;

    $scope.userSuperstarPercentage = mEGo($scope.userSuperstarPercentage);
    $scope.challengerSuperstarPercentage = mEGo($scope.challengerSuperstarPercentage);
  }


  function calculateGiverValues(){
    $scope.giverClass = ($scope.user.totalPublics > $scope.challenger.totalPublics) ? "user" : "challenger";

    $scope.wonGiver =  $scope[$scope.giverClass];
    $scope.wonGiverName = $scope.wonGiver.display_name || $scope.wonGiver.id;

    $scope.lostGiver = ($scope.wonGiver === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostGiverName = $scope.lostGiver.display_name || $scope.lostGiver.id;

    $scope.userGiverPercentage = ($scope.user.totalPublics / ($scope.user.totalPublics + $scope.challenger.totalPublics)) * 100;
    $scope.challengerGiverPercentage = ($scope.challenger.totalPublics / ($scope.user.totalPublics + $scope.challenger.totalPublics)) * 100;

    $scope.userGiverPercentage = mEGo($scope.userGiverPercentage);
    $scope.challengerGiverPercentage = mEGo($scope.challengerGiverPercentage);
  }

  //The Collaborator
  function calculateCollaboratorValues(){
    $scope.collaboratorClass = ($scope.user.totalCollaboratives > $scope.challenger.totalCollaboratives) ? "user" : "challenger";

    $scope.wonCollaborator =  $scope[$scope.collaboratorClass];
    $scope.wonCollaboratorName = $scope.wonCollaborator.display_name || $scope.wonCollaborator.id;

    $scope.lostCollaborator = ($scope.wonCollaborator === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostCollaboratorName = $scope.lostCollaborator.display_name || $scope.lostCollaborator.id;

    $scope.userCollaboratorPercentage = ($scope.user.totalCollaboratives / ($scope.user.totalCollaboratives + $scope.challenger.totalCollaboratives)) * 100;
    $scope.challengerCollaboratorPercentage = ($scope.challenger.totalCollaboratives / ($scope.user.totalCollaboratives + $scope.challenger.totalCollaboratives)) * 100;

    $scope.userCollaboratorPercentage = mEGo($scope.userCollaboratorPercentage);
    $scope.challengerCollaboratorPercentage = mEGo($scope.challengerCollaboratorPercentage);
  }

  function calculateHoarderValues(){

    $scope.hoarderClass = ($scope.user.totalSongs > $scope.challenger.totalSongs) ? "user" : "challenger";

    $scope.wonHoarder =  $scope[$scope.hoarderClass];
    $scope.wonHoarderName = $scope.wonHoarder.display_name || $scope.wonHoarder.id;

    $scope.lostHoarder = ($scope.wonHoarder === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostHoarderName = $scope.lostHoarder.display_name || $scope.lostHoarder.id;

    $scope.userHoarderPercentage = ($scope.user.totalSongs / ($scope.user.totalSongs + $scope.challenger.totalSongs)) * 100;
    $scope.challengerHoarderPercentage = ($scope.challenger.totalSongs / ($scope.user.totalSongs + $scope.challenger.totalSongs)) * 100;

    $scope.userHoarderPercentage = mEGo($scope.userHoarderPercentage);
    $scope.challengerHoarderPercentage = mEGo($scope.challengerHoarderPercentage);
  }

  function mEGo(integer){
    return ((integer % 5) > 2.5) ? integer - (integer % 5) + 5 : integer - (integer % 5);
  }

  $scope.again = function () {
    $state.go('main');
  }

}]);
