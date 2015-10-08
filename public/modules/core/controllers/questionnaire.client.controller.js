'use strict';

/**
 * In the demo application, the `QuestionnaireController` is responsible for
 * making questionnaire data (as specified in the [study specification
 * document](index.html) and retrieved through the {@link
 * Angular.TrialData|TrialData} service) available on its `$scope`. All of
 * the 'hard' work of dynamically constructing questionnaires is
 * accomplished through various directives:
 *
 * - {@link Angular.questionnaireDirective|questionnaireDirective}
 * - {@link Angular.checkboxQuestionDirective|checkboxQuestionDirective}
 * - {@link Angular.dropdownQuestionDirective|dropdownQuestionDirective}
 * - {@link Angular.radioQuestionDirective|radioQuestionDirective}
 * - {@link Angular.scaleQuestionDirective|scaleQuestionDirective}
 *
 * @class Angular.QuestionnaireController
 * @see Angular.questionnaireDirective
 * @see Angular.checkboxQuestionDirective
 * @see Angular.dropdownQuestionDirective
 * @see Angular.radioQuestionDirective
 * @see Angular.scaleQuestionDirective
 */

angular.module('core').controller('QuestionnaireController', [
    '$scope',
    'TrialData',
    '$log',
    function($scope, TrialData, $log) {

        $log.info('Loading QuestionnaireController.');

        /**
         * The `QuestionnaireController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.QuestionnaireController
         * @type {{}}
         */

        /**
         * The questionnaire data retrieved from {@link
         * Angular.TrialData|TrialData}.
         *
         * @name questionnaireData
         * @memberof Angular.QuestionnaireController#$scope
         * @instance
         * @type {{}}
         */
        $scope.questionnaireData =
            TrialData.data.schema[TrialData.data.state.currentSlideIndex].data;
    }
]);
