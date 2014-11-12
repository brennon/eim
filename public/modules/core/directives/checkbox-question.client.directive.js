'use strict';

angular.module('core').directive('checkboxQuestion', ['$compile', 'TrialData', function($compile, TrialData) {

    return {
        restrict: 'E',
        scope: {},

        link: function(scope, element, attrs) {
            scope.someSelected = false;

            scope.sendToTrialData = function(path, value) {
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
                    if (input.attr('name') === attrs.questionId + 'Checkbox') {
                        if (input.prop('checked') === true) {
                            newSomeSelectedValue = true;
                            checkedOptions.push(input.attr('value').toLowerCase());
                        }
                    }
                }

                scope.someSelected = newSomeSelectedValue;

                checkedOptions.sort();
                scope.sendToTrialData(attrs.controllerDataPath, checkedOptions);
            };

            var questionText = '<div class="row"><div class="col-md-12"><label for="' + attrs.questionId + 'Checkbox">' + attrs.questionLabel + '</label><div>';

            var innerQuestionText = '';

            if (element.data('checkboxOptions')) {

                // Iterate over checkbox options
                for (var i = 0; i < element.data('checkboxOptions').length; i++) {

                    var thisOption = element.data('checkboxOptions')[i];

                    innerQuestionText += '<label class="checkbox-inline"><input type="checkbox" name="'+attrs.questionId+'Checkbox" id="'+attrs.questionId+'Checkbox'+thisOption+'" value="'+thisOption+'" ng-model="'+attrs.questionId+'Checkbox'+thisOption+'" ng-change="updateCheckboxes()" ng-required="!someSelected">'+thisOption+'</label>';
                }
            }

            questionText += innerQuestionText + '</div></div></div>';

            var questionElement = angular.element(questionText);

            element.append(questionElement);
            $compile(element.contents())(scope);
        }
    };
}]);