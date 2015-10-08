'use strict';

/**
 * The `dropdownQuestion` directive is used to dynamically create a dropdown
 * question into a view. It is used by the {@link
 * Angular.questionnaireDirective|questionnaire} directive to build whole
 * questionnaires.
 *
 * @class Angular.dropdownQuestionDirective
 * @see Angular.questionnaireDirective
 */

angular.module('core').directive('dropdownQuestion', [
    '$compile',
    'TrialData',
    '$log',
    function($compile, TrialData, $log) {

        $log.debug('Compiling dropdownQuestion directive.');

        /**
         * The data used to build the dropdown question is found in the `scope`
         * argument passed to the directive's `#link` function. When a
         * {@link Angular.questionnaireDirective|questionnaire} directive
         * employs a `dropdownQuestion` directive, it passes
         * the appropriate {@link Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry}
         * for this parameter.
         *
         * @name scope
         * @memberof Angular.dropdownQuestionDirective
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

                scope[attrs.questionId + 'Select'] = null;

                scope.$watch(attrs.questionId + 'Select', function(newValue) {
                    scope.sendToTrialData(attrs.controllerDataPath, newValue);
                });

                var rowDiv = angular.element('<div class="row well"></div>');

                var formDiv = angular.element(
                    '<div class="col-md-12 form-group"></div>'
                );

                rowDiv.append(formDiv);

                var label = angular.element(
                    '<label class="control-label" translate>' +
                    attrs.questionLabel +
                    '</label>'
                );
                label.prop('for', attrs.questionId);

                formDiv.append(label);

                // Create select element
                var select = angular.element(
                    '<select class="form-control" required></select>'
                );

                // Remove 'required' attribute if this was specified in data
                if (element.data('questionRequired') === false) {
                    select.removeAttr('required');
                }

                select.attr('id', attrs.questionId);
                select.attr('name', attrs.questionId);
                select.attr('ng-model', attrs.questionId + 'Select');

                if (element.data('questionOptions')) {

                    scope.dropdownOptions = element.data('questionOptions').choices;

                    for (var i in scope.dropdownOptions) {
                        var optionText = scope.dropdownOptions[i];
                        var option = angular.element(
                            '<option>{{ "' + optionText.label + '" |' +
                            ' translate }}' +
                            '</option>'
                        );
                        option.attr('value', optionText.value);
                        select.append(option);
                    }
                }

                formDiv.append(select);

                element.append(rowDiv);
                $compile(element.contents())(scope);
            }
        };
    }]);
