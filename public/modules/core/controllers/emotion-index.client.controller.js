'use strict';

angular.module('core').controller('EmotionIndexController', [
    '$scope',
    'TrialData',
    function($scope, TrialData) {
        $scope.emotionIndices = TrialData.data.answers.emotion_indices;
    }
]);
