'use strict';

angular.module('core').controller('MasterController', ['$scope', '$http',
  function($scope, $http) {

    // When the MasterController is loaded, get a new experiment setup
    $http.get('/api/experiment-schemas/random')
      .success(function(data) {
        $scope.experimentSchema = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }
]);