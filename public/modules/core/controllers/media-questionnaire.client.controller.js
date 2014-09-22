'use strict';

angular.module('core').controller('MediaQuestionnaireController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    // Expose TrialData on scope
    $scope.trialData = TrialData;

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };

    // Save data to Trial Data
    $scope.setResponse = function(path, value, associated) {

      if (associated) {
        TrialData.setValueForPathForCurrentMedia(path, value);
      } else {
        TrialData.setValueForPath(path, value);
      }
    };
  }
]);
