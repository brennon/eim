'use strict';

angular.module('core').controller('QuestionnaireController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    $scope.questionnaireData = TrialData.data.schema[TrialData.data.state.currentSlideIndex].data;
  }
]);
