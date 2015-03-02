'use strict';

angular.module('controllers.logout', [])

.controller('LogoutCtrl', [
'$state',
function ($state) {
  localStorage.removeItem('userId');
  localStorage.removeItem('spotify-token');

  $state.go('splash')
}]);
