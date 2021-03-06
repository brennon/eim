'use strict';

/**
 * The `radioQuestion` directive is used to dynamically create a radio button
 * question into a view. It is used by the {@link
    * Angular.questionnaireDirective|questionnaire} directive to build whole
 * questionnaires.
 *
 * @class Angular.radioQuestionDirective
 * @see Angular.questionnaireDirective
 */

angular.module('core').directive('radioQuestion', [
    '$compile',
    'TrialData',
    '$log',
    function($compile, TrialData, $log) {

        $log.debug('Compiling radioQuestion directive.');

        /**
         * The data used to build the radio question is found in the `scope`
         * argument passed to the directive's `#link` function. When a
         * {@link Angular.questionnaireDirective|questionnaire} directive
         * employs a `radioQuestion` directive, it passes
         * the appropriate {@link Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry}
         * for this parameter.
         *
         * @name scope
         * @memberof Angular.radioQuestionDirective
         * @inner
         * @type {{}}
         * @see Angular.questionnaireDirective
         */

        return {
            restrict: 'E',
            scope: {},

            link: function(scope, element, attrs) {

                scope.sendToTrialData = function(path, value) {
                    if (!attrs.associatedToMedia) {
                        TrialData.setValueForPath(path, value);
                    } else {
                        TrialData.setValueForPathForCurrentMedia(path, value);
                    }
                };

                scope[attrs.questionId + 'RadioGroup'] = null;

                scope.$watch(
                    attrs.questionId + 'RadioGroup',
                    function(newValue) {

                        // Convert 'true' to true literals and similar for
                        // 'false'
                        if (newValue === 'true') {
                            newValue = true;
                        } else if (newValue === 'false') {
                            newValue = false;
                        }

                        scope.sendToTrialData(
                            attrs.controllerDataPath,
                            newValue
                        );
                    });

                var questionText =
                    '<div class="row">' +
                    '<div class="col-md-12">' +
                    '<label for="' + attrs.questionId + 'Radio" ' +
                    'translate>' +
                    attrs.questionLabel +
                    '</label>' +
                    '<div>';

                var innerQuestionText = '';

                // Don't require question if explicitly told not to do so in
                // data
                var requiredText = '';
                if (element.data('questionRequired') !== false) {
                    requiredText = ' required="required" ';
                }

                if (element.data('questionOptions')) {

                    // Iterate over radio options
                    for (var i = 0;
                         i < element.data('questionOptions').choices.length;
                         i++) {

                        var thisOption = element.data('questionOptions').choices[i];

                        innerQuestionText +=
                            '<label class="radio-inline">' +
                            '<input type="radio" name="' +
                            attrs.questionId + 'RadioGroup" ' +
                            'id="' + attrs.questionId +
                            'Radio' + thisOption.label + '" ' +
                            'value="' + thisOption.value + '" ' +
                            'ng-model="' + attrs.questionId + 'RadioGroup" ' +
                            requiredText +
                            '>' +
                            '{{\'' + thisOption.label + '\' | translate}}' +
                            '</input>' +
                            '</label>';

                    }
                }

                questionText += innerQuestionText + '</div></div></div>';

                var questionElement = angular.element(questionText);

                // Add well class
                questionElement.addClass('well');

                element.append(questionElement);
                $compile(element.contents())(scope);
            }
        };
    }]);
