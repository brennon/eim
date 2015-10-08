'use strict';

/**
 * The `checkboxQuestion` directive is used to dynamically create a checkbox
 * question into a view. It is used by the {@link
 * Angular.questionnaireDirective|questionnaire} directive to build whole
 * questionnaires.
 *
 * @class Angular.checkboxQuestionDirective
 * @see Angular.questionnaireDirective
 */

angular.module('core').directive('checkboxQuestion', [
    '$compile',
    'TrialData',
    '$log',
    function($compile, TrialData, $log) {

        $log.debug('Compiling checkboxQuestion directive.');

        /**
         * The data used to build the checkbox question is found in the `scope`
         * argument passed to the directive's `#link` function. When a
         * {@link Angular.questionnaireDirective|questionnaire} directive
         * employs a `checkboxQuestion` directive, it passes
         * the appropriate {@link Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry}
         * for this parameter.
         *
         * @name scope
         * @memberof Angular.checkboxQuestionDirective
         * @inner
         * @type {{}}
         * @see Angular.questionnaireDirective
         */

        return {
            restrict: 'E',
            scope: {},

            link: function(scope, element, attrs) {
                scope.someSelected = false;

                scope.sendToTrialData = function(path, value) {

                    //noinspection JSUnresolvedVariable
                    if (!attrs.associatedToMedia) {
                        TrialData.setValueForPath(path, value);
                    } else {
                        TrialData.setValueForPathForCurrentMedia(path, value);
                    }
                };

                scope.updateCheckboxes = function() {
                    var newSomeSelectedValue = false;

                    var checkedOptions = [];
                    var inputs = element.find('input');
                    for (var i = 0; i < inputs.length; i++) {
                        var input = angular.element(inputs[i]);


                        /* istanbul ignore else */
                        if (input.attr('name') === attrs.questionId +
                            'Checkbox') {

                            if (input.prop('checked') === true) {
                                newSomeSelectedValue = true;
                                checkedOptions
                                    .push(input.attr('value').toLowerCase());
                            }
                        }
                    }

                    scope.someSelected = newSomeSelectedValue;

                    checkedOptions.sort();

                    //noinspection JSUnresolvedVariable
                    scope.sendToTrialData(
                        attrs.controllerDataPath,
                        checkedOptions
                    );
                };

                var questionText =
                    '<div class="row well">' +
                    '<div class="col-md-12">' +
                    '<label for="' + attrs.questionId + 'Checkbox" translate>' +
                    attrs.questionLabel +
                    '</label>' +
                    '<div>';

                var innerQuestionText = '';

                if (element.data('questionOptions')) {

                    // Iterate over checkbox options
                    for (var i = 0;
                         i < element.data('questionOptions').choices.length;
                         i++) {

                        var thisOption = element.data('questionOptions').choices[i];

                        innerQuestionText += '<label class="checkbox-inline">';

                        innerQuestionText +=
                            '<input type="checkbox" name="' + attrs.questionId +
                            'Checkbox" id="' + attrs.questionId +
                            'Checkbox' + thisOption.value +
                            '" value="' + thisOption.value +
                            '" ng-model="' + attrs.questionId +
                            'Checkbox' + thisOption.value +
                            '" ng-change="updateCheckboxes()"';

                        if (element.data('questionRequired') !== false) {
                            innerQuestionText += 'ng-required="!someSelected"';
                        }

                        innerQuestionText += '>{{\'' + thisOption.label +
                            '\' | translate}}</input>';

                        innerQuestionText += '</label>';
                    }
                }

                questionText += innerQuestionText + '</div></div></div>';

                var questionElement = angular.element(questionText);

                element.append(questionElement);
                $compile(element.contents())(scope);
            }
        };
    }
]);
