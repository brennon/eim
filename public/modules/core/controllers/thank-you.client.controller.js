'use strict';

angular.module('core').controller('ThankYouController', ['$scope', 'TrialData', 'ExperimentManager',
  function($scope, TrialData, ExperimentManager) {

    // Bind $scope.advanceSlide to ExperimentManager functionality
    $scope.advanceSlide = ExperimentManager.advanceSlide;

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);