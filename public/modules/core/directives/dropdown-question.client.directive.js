'use strict';

// FIXME: Binding radio options to element's data sucks

angular.module('core').directive('dropdownQuestion', ['$compile', 'TrialData', function($compile, TrialData) {

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

            if (element.data('dropdownOptions')) {
                scope.dropdownOptions = element.data('dropdownOptions');
            }

            var selectElement = angular.element('<div class="row"><div class="col-md-12 form-group"><label for="' + attrs.questionId + '" class="control-label">' + attrs.questionLabel + '</label><select id="'+attrs.questionId+'" name="'+attrs.questionId+'" class="form-control" ng-options="option for option in dropdownOptions" ng-model="'+attrs.questionId+'Select" required></select></div></div>');

            element.append(selectElement);
            $compile(element.contents())(scope);
        }
    };
}]);
