'use strict';

// FIXME: Be smarter about what indices to show (fixed vs. random, etc.)

angular.module('core').controller('EmotionIndexController', ['$scope', 'TrialData',
  function($scope, TrialData) {
    $scope.emotionIndices = TrialData.data.answers.emotion_indices;
  }
]);