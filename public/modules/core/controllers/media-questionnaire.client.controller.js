'use strict';

angular.module('core').controller('MediaQuestionnaireController', ['$scope', 'TrialData', 'ExperimentManager', '$state',
  function($scope, TrialData, ExperimentManager, $state) {

    // Bind $scope.advanceSlide to ExperimentManager functionality
    $scope.advanceSlide = ExperimentManager.advanceSlide;

    // Expose TrialData on scope
    $scope.trialData = TrialData;

    $scope.questionnaireData = TrialData.data.schema[TrialData.data.state.currentSlideIndex].data;

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);
