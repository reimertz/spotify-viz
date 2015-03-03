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

  $scope.user.wins = 0;
  $scope.challenger.wins = 0;

  $scope.user.name = $scope.user.display_name || $scope.user.id;
  $scope.challenger.name = $scope.challenger.display_name || $scope.challenger.id;


  $scope.hide = false;

  getImages();
  calculateHipsterValues();
  calculateSuperstarValues();
  calculateGiverValues();
  calculateCollaboratorValues();
  calculateHoarderValues();
  calculateTrendsetterValues();
  calculateCopycatValues();
  calculateSummaryValues();

  function getImages(){
    $scope.user.image = ($scope.user.images[0]) ? $scope.user.images[0].url.replace('https://', '//') : "../images/user.svg";
    $scope.challenger.image = ($scope.challenger.images[0]) ? $scope.challenger.images[0].url.replace('https://', '//') : "../images/challenger.svg";
  }

  //The Hipster

  function calculateHipsterValues(){

    $scope.user.popularity = parseInt($scope.user.popularity);
    $scope.challenger.popularity = parseInt($scope.challenger.popularity);

    $scope.hipsterClass = ($scope.user.popularity < $scope.challenger.popularity) ? "user" : "challenger";

    $scope.wonHipster =  $scope[$scope.hipsterClass];
    $scope.wonHipsterName = $scope.wonHipster.name;

    $scope.lostHipster = ($scope.wonHipster === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostHipsterName = $scope.lostHipster.name;

    $scope.wonHipster.wins +=1;

    $scope.userHipsterPercentage = ($scope.user.popularity / ($scope.user.popularity + $scope.challenger.popularity)) * 100;
    $scope.challengerHipsterPercentage = ($scope.challenger.popularity / ($scope.user.popularity + $scope.challenger.popularity)) * 100;

    $scope.userHipsterPercentage = mEGo($scope.userHipsterPercentage);
    $scope.challengerHipsterPercentage = mEGo($scope.challengerHipsterPercentage);
  }


  function calculateSuperstarValues(){

    $scope.superstarClass = ($scope.user.followers.total > $scope.challenger.followers.total) ? "user" : "challenger";

    $scope.wonSuperstar =  $scope[$scope.superstarClass];
    $scope.wonSuperstarName = $scope.wonSuperstar.name;

    $scope.lostSuperstar = ($scope.wonSuperstar === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostSuperstarName = $scope.lostSuperstar.name;

    $scope.wonSuperstar.wins +=1;

    $scope.userSuperstarPercentage = ($scope.user.followers.total / ($scope.user.followers.total + $scope.challenger.followers.total)) * 100;
    $scope.challengerSuperstarPercentage = ($scope.challenger.followers.total / ($scope.user.followers.total + $scope.challenger.followers.total)) * 100;

    $scope.userSuperstarPercentage = mEGo($scope.userSuperstarPercentage);
    $scope.challengerSuperstarPercentage = mEGo($scope.challengerSuperstarPercentage);
  }


  function calculateGiverValues(){

    $scope.giverClass = ($scope.user.totalPublics > $scope.challenger.totalPublics) ? "user" : "challenger";

    $scope.wonGiver =  $scope[$scope.giverClass];
    $scope.wonGiverName = $scope.wonGiver.name;

    $scope.lostGiver = ($scope.wonGiver === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostGiverName = $scope.lostGiver.name;

    $scope.wonGiver.wins +=1;

    $scope.userGiverPercentage = ($scope.user.totalPublics / ($scope.user.totalPublics + $scope.challenger.totalPublics)) * 100;
    $scope.challengerGiverPercentage = ($scope.challenger.totalPublics / ($scope.user.totalPublics + $scope.challenger.totalPublics)) * 100;

    $scope.userGiverPercentage = mEGo($scope.userGiverPercentage);
    $scope.challengerGiverPercentage = mEGo($scope.challengerGiverPercentage);
  }

  //The Collaborator
  function calculateCollaboratorValues(){
    $scope.collaboratorClass = ($scope.user.totalCollaboratives > $scope.challenger.totalCollaboratives) ? "user" : "challenger";


    $scope.wonCollaborator = $scope[$scope.collaboratorClass];
    $scope.wonCollaboratorName = $scope.wonCollaborator.name || false;

    $scope.lostCollaborator = ($scope.wonCollaborator === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostCollaboratorName = $scope.lostCollaborator.name;

    $scope.wonCollaborator.wins +=1;

    $scope.userCollaboratorPercentage = ($scope.user.totalCollaboratives / ($scope.user.totalCollaboratives + $scope.challenger.totalCollaboratives)) * 100;
    $scope.challengerCollaboratorPercentage = ($scope.challenger.totalCollaboratives / ($scope.user.totalCollaboratives + $scope.challenger.totalCollaboratives)) * 100;

    $scope.userCollaboratorPercentage = mEGo($scope.userCollaboratorPercentage);
    $scope.challengerCollaboratorPercentage = mEGo($scope.challengerCollaboratorPercentage);
  }


  function calculateHoarderValues(){
    $scope.hoarderClass = ($scope.user.totalSongs > $scope.challenger.totalSongs) ? "user" : "challenger";

    $scope.wonHoarder =  $scope[$scope.hoarderClass];
    $scope.wonHoarderName = $scope.wonHoarder.name;

    $scope.lostHoarder = ($scope.wonHoarder === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostHoarderName = $scope.lostHoarder.name;

    $scope.wonHoarder.wins +=1;

    $scope.userHoarderPercentage = ($scope.user.totalSongs / ($scope.user.totalSongs + $scope.challenger.totalSongs)) * 100;
    $scope.challengerHoarderPercentage = ($scope.challenger.totalSongs / ($scope.user.totalSongs + $scope.challenger.totalSongs)) * 100;

    $scope.userHoarderPercentage = mEGo($scope.userHoarderPercentage);
    $scope.challengerHoarderPercentage = mEGo($scope.challengerHoarderPercentage);
  }

  function calculateTrendsetterValues(){
    $scope.trendsetterClass = ($scope.user.totalPlaylistFollowers > $scope.challenger.totalPlaylistFollowers) ? "user" : "challenger";

    $scope.wonTrendsetter =  $scope[$scope.trendsetterClass];
    $scope.wonTrendsetterName = $scope.wonTrendsetter.name;

    $scope.lostTrendsetter = ($scope.wonTrendsetter === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostTrendsetterName = $scope.lostTrendsetter.name;

    $scope.wonTrendsetter.wins +=1;

    $scope.userTrendsetterPercentage = ($scope.user.totalPlaylistFollowers / ($scope.user.totalPlaylistFollowers + $scope.challenger.totalPlaylistFollowers)) * 100;
    $scope.challengerTrendsetterPercentage = ($scope.challenger.totalPlaylistFollowers / ($scope.user.totalPlaylistFollowers + $scope.challenger.totalPlaylistFollowers)) * 100;

    $scope.userTrendsetterPercentage = mEGo($scope.userTrendsetterPercentage);
    $scope.challengerTrendsetterPercentage = mEGo($scope.challengerTrendsetterPercentage);
  }

  function calculateCopycatValues(){
    $scope.copycatClass = ($scope.user.totalOtherPlaylistFollowers < $scope.challenger.totalOtherPlaylistFollowers) ? "user" : "challenger";

    $scope.wonCopycat =  $scope[$scope.copycatClass];
    $scope.wonCopycatName = $scope.wonCopycat.name;

    $scope.lostCopycat = ($scope.wonCopycat === $scope.user) ?   $scope.challenger :  $scope.user;
    $scope.lostCopycatName = $scope.lostCopycat.name;

    $scope.wonCopycat.wins +=1;

    $scope.userCopycatPercentage = ($scope.user.totalOtherPlaylists / ($scope.user.totalOtherPlaylists + $scope.challenger.totalOtherPlaylists)) * 100;
    $scope.challengerCopycatPercentage = ($scope.challenger.totalOtherPlaylists / ($scope.user.totalOtherPlaylists + $scope.challenger.totalOtherPlaylists)) * 100;

    $scope.userCopycatPercentage = mEGo($scope.userCopycatPercentage);
    $scope.challengerCopycatPercentage = mEGo($scope.challengerCopycatPercentage);
  }


    function calculateSummaryValues(){
      $scope.summaryClass = ($scope.user.wins > $scope.challenger.wins) ? "user" : "challenger";
      $scope.wonSummary =  $scope[$scope.summaryClass];
    }



  function mEGo(integer){
    return ((integer % 5) > 2.5) ? integer - (integer % 5) + 5 : integer - (integer % 5);
  }

  $scope.again = function () {
    $state.go('main');
  }


  var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, i, range, resizeWindow, xpos;

  NUM_CONFETTI = 350;

  COLORS = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];

  PI_2 = 2 * Math.PI;

  canvas = document.getElementById("world");

  context = canvas.getContext("2d");

  window.w = 0;

  window.h = 0;

  resizeWindow = function() {
    window.w = canvas.width = window.innerWidth;
    return window.h = canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeWindow, false);

  window.onload = function() {
    return setTimeout(resizeWindow, 0);
  };

  range = function(a, b) {
    return (b - a) * Math.random() + a;
  };

  drawCircle = function(x, y, r, style) {
    context.beginPath();
    context.arc(x, y, r, 0, PI_2, false);
    context.fillStyle = style;
    return context.fill();
  };

  xpos = 0.5;

  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  Confetti = (function() {
    function Confetti() {
      this.style = COLORS[~~range(0, 5)];
      this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
      this.r = ~~range(2, 6);
      this.r2 = 2 * this.r;
      this.replace();
    }

    Confetti.prototype.replace = function() {
      this.opacity = 0;
      this.dop = 0.03 * range(1, 4);
      this.x = range(-this.r2, w - this.r2);
      this.y = range(-20, h - this.r2);
      this.xmax = w - this.r;
      this.ymax = h - this.r;
      this.vx = range(0, 2) + 8 * xpos - 5;
      return this.vy = 0.7 * this.r + range(-1, 1);
    };

    Confetti.prototype.draw = function() {
      var _ref;
      this.x += this.vx;
      this.y += this.vy;
      this.opacity += this.dop;
      if (this.opacity > 1) {
        this.opacity = 1;
        this.dop *= -1;
      }
      if (this.opacity < 0 || this.y > this.ymax) {
        this.replace();
      }
      if (!((0 < (_ref = this.x) && _ref < this.xmax))) {
        this.x = (this.x + this.xmax) % this.xmax;
      }
      return drawCircle(~~this.x, ~~this.y, this.r, "" + this.rgb + "," + this.opacity + ")");
    };

    return Confetti;

  })();

  confetti = (function() {
    var _i, _results;
    _results = [];
    for (i = _i = 1; 1 <= NUM_CONFETTI ? _i <= NUM_CONFETTI : _i >= NUM_CONFETTI; i = 1 <= NUM_CONFETTI ? ++_i : --_i) {
      _results.push(new Confetti);
    }
    return _results;
  })();

  window.step = function() {
    var c, _i, _len, _results;
    requestAnimationFrame(step);
    context.clearRect(0, 0, w, h);
    _results = [];
    for (_i = 0, _len = confetti.length; _i < _len; _i++) {
      c = confetti[_i];
      _results.push(c.draw());
    }
    return _results;
  };

  step();



}])