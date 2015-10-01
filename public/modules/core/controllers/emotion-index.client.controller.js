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
    }
]);
