'use strict';

// FIXME: Binding radio options to element's data sucks

angular.module('core').directive('radioQuestion', ['$compile', 'TrialData', function($compile, TrialData) {

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

            scope.$watch(attrs.questionId + 'RadioGroup', function(newValue) {

                // Convert 'true' to true literals and similar for 'false'
                if (newValue === 'true') {
                    newValue = true;
                } else if (newValue === 'false') {
                    newValue = false;
                }

                scope.sendToTrialData(attrs.controllerDataPath, newValue);
            });

            var questionText = '<div class="row"><div class="col-md-12"><label for="' + attrs.questionId + 'Radio">' + attrs.questionLabel + '</label><div>';

            var innerQuestionText = '';

            if (element.data('radioOptions')) {

                // Iterate over radio options
                for (var i = 0; i < element.data('radioOptions').length; i++) {

                    var thisOption = element.data('radioOptions')[i];

                    innerQuestionText += '<label class="radio-inline"><input type="radio" name="' + attrs.questionId + 'RadioGroup" id="' + attrs.questionId + 'Radio' + thisOption.label + '" value="' + thisOption.value + '" ng-model="' + attrs.questionId + 'RadioGroup" required="true" />' + thisOption.label + '</label>';
                }
            }

            questionText += innerQuestionText + '</div></div></div>';

            var questionElement = angular.element(questionText);

            element.append(questionElement);
            $compile(element.contents())(scope);

            //<radio-question question-id="gender" question-label="Gender" controller-data-path="data.answers.sex" class="ng-isolate-scope">
            //<div class="row ng-scope">
            //<div class="form-group col-md-12">
            //<label for="genderRadio">Gender</label>
            //<div>
            //<label class="radio-inline">
            //<input type="radio" value="male" class="ng-pristine ng-invalid ng-invalid-required" name="genderRadioGroup" id="genderRadioMale" ng-model="genderRadioGroup" required="true">
            //Male
            //</label>
            //<label class="radio-inline">
            //<input type="radio" class="ng-pristine ng-invalid ng-invalid-required" name="genderRadioGroup" id="genderRadioFemale" value="female" ng-model="genderRadioGroup" required="true">
            //Female
            //</label>
            //</div>
            //</div>
            //</div>
            //</radio-question>
        }
    };
}]);