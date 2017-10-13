'use strict';

/**
 * In the demo application, the `DemographicsController` is the primary
 * controller used for the `'emotion-index'` state. This controller makes
 * emotion index information available on its `$scope`.
 *
 * @class Angular.EmotionIndexController
 */

angular.module('core').controller('EmotionIndexController', [
    '$scope',
    'TrialData',
    '$log',
    function($scope, TrialData, $log) {

        $log.debug('Loading EmotionIndexController.');

        /**
         * The `EmotionIndexController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.EmotionIndexController
         * @type {{}}
         */

        /**
         * Available emotion indices.
         *
         * If defined, this array contains the emotion indices for the
         * listenings conducted during this experiment session (retrieved
         * from `TrialData.data.answers.emotion_indices`).
         *
         * @name emotionIndices
         * @memberof Angular.EmotionIndexController#$scope
         * @instance
         * @type {number[]}
         */
        $scope.emotionIndices = TrialData.data.answers.emotion_indices;

        if ($scope.emotionIndices === undefined) {
            var min = 25;
            var max = 65;
            var randomIndex = Math.floor(Math.random() * (max - min)) + min;
            $scope.emotionIndices = [0, randomIndex, 0];
        }

        var emotionIndex = $scope.emotionIndices[1];
        $scope.qrCode = "modules/core/img/qr1.png";
        if (emotionIndex <= 20) {
            $scope.qrCode = "modules/core/img/qr1.jpg";
        } else if (emotionIndex > 20 && emotionIndex <= 40) {
            $scope.qrCode = "modules/core/img/qr2.jpg";
        } else if (emotionIndex > 40 && emotionIndex <= 60) {
            $scope.qrCode = "modules/core/img/qr3.jpg";
        } else if (emotionIndex > 60 && emotionIndex <= 80) {
            $scope.qrCode = "modules/core/img/qr4.jpg";
        } else if (emotionIndex > 80) {
            $scope.qrCode = "modules/core/img/qr5.jpg";
        }
    }
]);
