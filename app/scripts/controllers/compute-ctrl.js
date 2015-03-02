'use strict';

angular.module('controllers.compute', [])

.controller('ComputeCtrl', [
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
  $scope.user.playlists = [];
  $scope.challenger.playlists = [];

  $scope.status = 'Fetching User data..';


  $q.all([getUserPlaylists($scope.user.id), getUserPlaylists($scope.challenger.id)]).then(function(result){
    $scope.status = 'Fetching Playlists..';

    $scope.user.playlists = result[0];
    $scope.challenger.playlists = result[1];

  }).then(function(){
    var promises = [];

    $scope.status = 'Analyzing Playlist data...';

    promises.push(getAllPlaylistData($scope.user.id, $scope.user.playlists));
    promises.push(getAllPlaylistData($scope.challenger.id, $scope.challenger.playlists));

    $q.all(promises).then(function(result){
      var promises = [];

      $scope.status = 'Analyzing popularity data..';

      angular.extend($scope.user, $scope.user, result[0]);
      angular.extend($scope.challenger, $scope.challenger, result[1]);

      promises.push(calculatePopularity($scope.user.playlists));
      promises.push(calculatePopularity($scope.challenger.playlists));
      $q.all(promises).then(function(result){
        $scope.status = 'Finalizing data...';

        $scope.user.popularity = (result[0]/$scope.user.totalSongs).toFixed(2);
        $scope.challenger.popularity = (result[1]/$scope.challenger.totalSongs).toFixed(2);

        //No need to pass these enormous datasets since we already have the data we need for
        //the next view. :D

        delete $scope.user.playlists;
        delete $scope.challenger.playlists;

        $state.go('vizualize', {'user': $scope.user, 'challenger': $scope.challenger});
      })
    });
  })

  function calculatePopularity(playlists) {
    var deferred = $q.defer();
    var totalPopularity = 0;

    playlists.forEach(function(playlist, index){
      playlist.tracks.items.map(function(item){
        totalPopularity += item.track.popularity;
      })

      if(playlists.length-1 == index){
        deferred.resolve(totalPopularity);
      }
    });

    return deferred.promise;
  }

  function getUserPlaylists(id) {
    var promises = [];

    promises.push(delay(0).then(function(){return Spotify.getUserPlaylists(id, {offset: 0})}));
    promises.push(delay(200).then(function(){return Spotify.getUserPlaylists(id, {offset: 25})}));
    promises.push(delay(400).then(function(){return Spotify.getUserPlaylists(id, {offset: 50})}));
    promises.push(delay(600).then(function(){return Spotify.getUserPlaylists(id, {offset: 75})}));
    promises.push(delay(800).then(function(){return Spotify.getUserPlaylists(id, {offset: 100})}));
    promises.push(delay(1000).then(function(){return Spotify.getUserPlaylists(id, {offset: 100})}));
    promises.push(delay(1200).then(function(){return Spotify.getUserPlaylists(id, {offset: 125})}));
    promises.push(delay(1400).then(function(){return Spotify.getUserPlaylists(id, {offset: 150})}));
    promises.push(delay(1800).then(function(){return Spotify.getUserPlaylists(id, {offset: 175})}));
    promises.push(delay(2000).then(function(){return Spotify.getUserPlaylists(id, {offset: 200})}));


    return $q.allSettled(promises).then(function(results){
      var playlists = [];
      results.forEach(function (result) {
        if (result.state === "fulfilled") {
            playlists = playlists.concat(result.value.items);
        }
      });
      return playlists;
    })
  }

  function getAllPlaylistData(userId, playlists) {
    var promises = [];

    var totalSongs = 0;
    var totalCollaboratives = 0;
    var totalPublics = 0;
    var totalPlaylistFollowers = 0;

    var totalOtherPlaylistFollowers = 0;
    var totalOtherPlaylists = 0;
    var totalOtherSongs = 0;

    playlists.forEach(function(playlist, index){


      if(playlist.owner.id == userId){
        totalSongs += playlist.tracks.total;
        totalCollaboratives += playlist.collaborative ? 1 : 0;
        totalPublics += playlist.public ? 1 : 0;

        promises.push(delay(100*index).then(function(){return Spotify.getPlaylist(userId, playlist.id)}));

      }
      else {
        totalOtherPlaylists += 1;
        totalOtherSongs += playlist.tracks.total;
      }
    });

    return $q.allSettled(promises).then(function(results){
      var fullPlaylists = [];
      results.forEach(function (result) {
        if (result.state === "fulfilled") {
            fullPlaylists.push(result.value);

          if(result.value.owner.id == userId){
            totalPlaylistFollowers += result.value.followers.total;
          }
          else {
            totalOtherPlaylistFollowers += result.value.followers.total;
          }
        }
      });

      return {
        playlists: fullPlaylists,
        totalSongs: totalSongs,
        totalCollaboratives: totalCollaboratives,
        totalPublics: totalPublics,
        totalPlaylistFollowers: totalPlaylistFollowers,

        totalOtherPlaylistFollowers: totalOtherPlaylistFollowers,
        totalOtherPlaylists: totalOtherPlaylists,
        totalOtherSongs: totalOtherSongs
      }
    });
  }

  function delay(ms) {
      var deferred = $q.defer();
      $timeout(deferred.resolve, ms);
      return deferred.promise;
  }

  $scope.cancel = function () {
    $state.go('main');
  }
}]);