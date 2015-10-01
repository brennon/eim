'use strict';

/**
 * @class Angular.dropdownQuestionDirective
 */

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

            var rowDiv = angular.element('<div class="row well"></div>');

            var formDiv = angular.element('<div class="col-md-12 form-group"></div>');

            rowDiv.append(formDiv);

            var label = angular.element('<label class="control-label" translate>'+attrs.questionLabel+'</label>');
            label.prop('for', attrs.questionId);

            formDiv.append(label);

            var select = angular.element('<select class="form-control" required></select>');
            select.attr('id', attrs.questionId);
            select.attr('name', attrs.questionId);
            select.attr('ng-model', attrs.questionId + 'Select');

            if (element.data('dropdownOptions')) {

                scope.dropdownOptions = element.data('dropdownOptions');

                for (var i in element.data('dropdownOptions')) {
                    var optionText = element.data('dropdownOptions')[i];
                    var option = angular.element('<option>{{ "'+ optionText +'" | translate }}</option>');
                    option.attr('value', optionText);
                    select.append(option);
                }
            }

            formDiv.append(select);

            element.append(rowDiv);
            $compile(element.contents())(scope);
        }
    };
}]);
