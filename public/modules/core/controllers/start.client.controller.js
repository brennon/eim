'use strict';

angular.module('core').controller('StartController', ['$scope', '$http', 'TrialData',
  function($scope, $http, TrialData) {

    TrialData.reset();

    // When the StartController is loaded, get a new experiment setup
    $http.get('/api/experiment-schemas/random')
      .success(function(data) {
        $scope.experimentSchema = data;

        for (var i in data.media) {
          TrialData.data.media.push(data.media[i].label);
        }
      })
      .error(function(data) {
        console.error('Error: ' + data);
      });
  }
]);