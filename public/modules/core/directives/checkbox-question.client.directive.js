'use strict';

angular.module('core').directive('checkboxQuestion', [
    '$compile',
    'TrialData',
    function($compile, TrialData) {

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
                        if (input.attr('name') === attrs.questionId + 'Checkbox') {
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
                    scope.sendToTrialData(attrs.controllerDataPath, checkedOptions);
                };

                var questionText = '<div class="row well"><div class="col-md-12"><label for="' + attrs.questionId + 'Checkbox" translate>' + attrs.questionLabel + '</label><div>';

                var innerQuestionText = '';

                if (element.data('checkboxOptions')) {

                    // Iterate over checkbox options
                    for (var i = 0; i < element.data('checkboxOptions').length; i++) {

                        var thisOption = element.data('checkboxOptions')[i];

                        innerQuestionText += '<label class="checkbox-inline">';

                        innerQuestionText += '<input type="checkbox" name="' + attrs.questionId + 'Checkbox" id="' + attrs.questionId + 'Checkbox' + thisOption + '" value="' + thisOption + '" ng-model="' + attrs.questionId + 'Checkbox' + thisOption + '" ng-change="updateCheckboxes()"';

                        if (attrs.questionRequired) {
                            innerQuestionText += 'ng-required="!someSelected"';
                        }

                        innerQuestionText += '>{{\'' + thisOption + '\' | translate}}</input>';

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
