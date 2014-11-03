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

            var questionHeader = angular.element('<div class="row"><div class="col-md-12 text-center"><label for="' + attrs.questionId + 'Radio" class="radio control-label">' + attrs.questionLabel + '</label></div></div>');

            var innerRadioHTML = '';

            if (element.data('radioOptions')) {

                // Iterate over radio options
                for (var i = 0; i < element.data('radioOptions').length; i++) {

                    var thisOption = element.data('radioOptions')[i];

                    innerRadioHTML += '<label class="radio-inline"><input type="radio" name="' + attrs.questionId + 'RadioGroup" id="' + attrs.questionId + 'Radio' + thisOption.label + '" value="' + thisOption.value + '" ng-model="' + attrs.questionId + 'RadioGroup" required="true" />' + thisOption.label + '</label>';
                }
            }

            var radios = angular.element('<div class="row"><div class="col-md-12"><div class="radio-inline">' + innerRadioHTML + '</div></div></div>');

            element.append(questionHeader);
            element.append(radios);
            $compile(element.contents())(scope);
        }
    };
}]);