'use strict';

angular.module('core').directive('questionnaire', ['$compile', function($compile) {

    var buildScaleQuestion = function(item) {
        var questionElement = angular.element('<scale-question></scale-question>');

        if (item.questionId) {
            questionElement.attr('question-id', item.questionId);
        }

        if (item.questionLabel) {
            questionElement.attr('question-label', item.questionLabel);
        }

        if (item.questionLabelType) {
            questionElement.attr('label-type', item.questionLabelType);
        }

        if (item.questionLikertMinimumDescription) {
            questionElement.attr('minimum-description', item.questionLikertMinimumDescription);
        }

        if (item.questionLikertMaximumDescription) {
            questionElement.attr('maximum-description', item.questionLikertMaximumDescription);
        }

        if (item.questionLikertSingleImageSrc) {
            questionElement.attr('single-img-src', item.questionLikertSingleImageSrc);
        }

        if (item.questionLikertLeftImageSrc) {
            questionElement.attr('left-img-src', item.questionLikertLeftImageSrc);
        }

        if (item.questionLikertRightImageSrc) {
            questionElement.attr('right-img-src', item.questionLikertRightImageSrc);
        }

        if (item.questionStoragePath) {
            questionElement.attr('controller-data-path', item.questionStoragePath);
        }

        if (item.questionIsAssociatedToMedia) {
            questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia);
        }

        return questionElement;
    };

    var buildRadioQuestion = function(item) {
        var questionElement = angular.element('<radio-question></radio-question>');

        if (item.questionId) {
            questionElement.attr('question-id', item.questionId);
        }

        if (item.questionLabel) {
            questionElement.attr('question-label', item.questionLabel);
        }

        if (item.questionStoragePath) {
            questionElement.attr('controller-data-path', item.questionStoragePath);
        }

        if (item.questionIsAssociatedToMedia) {
            questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia);
        }

        if (item.questionRadioOptions) {
            questionElement.data('radioOptions', item.questionRadioOptions);
        }

        return questionElement;
    };

    var buildDropdownQuestion = function(item) {
        var questionElement = angular.element('<dropdown-question></dropdown-question>');

        if (item.questionId) {
            questionElement.attr('question-id', item.questionId);
        }

        if (item.questionLabel) {
            questionElement.attr('question-label', item.questionLabel);
        }

        if (item.questionIsAssociatedToMedia) {
            questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia);
        }

        if (item.questionStoragePath) {
            questionElement.attr('controller-data-path', item.questionStoragePath);
        }

        if (item.questionDropdownOptions) {
            questionElement.data('dropdownOptions', item.questionDropdownOptions);
        }

        return questionElement;
    };

    var buildCheckboxQuestion = function(item) {
        var questionElement = angular.element('<checkbox-question></checkbox-question>');

        if (item.questionId) {
            questionElement.attr('question-id', item.questionId);
        }

        if (item.questionLabel) {
            questionElement.attr('question-label', item.questionLabel);
        }

        if (item.questionIsAssociatedToMedia) {
            questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia);
        }

        if (item.questionStoragePath) {
            questionElement.attr('controller-data-path', item.questionStoragePath);
        }

        if (item.questionCheckboxOptions) {
            questionElement.data('checkboxOptions', item.questionCheckboxOptions);
        }

        return questionElement;
    };

    return {
        restrict: 'E',
        scope: {
            questionnaireData: '='
        },

        link: function(scope, element, attrs) {

            var data = scope.questionnaireData;

            // Create an element for the title
            var title = angular.element('<h1>' + data.title + '</h1>');
            element.append(title);

            var formElement = angular.element('<form class="form" name="questionnaireForm" novalidate></form>');//('<form name="questionnaireForm" class="form" novalidate></form>');
            element.append(formElement);

            // Iterate over structure
            for (var i = 0; i < data.structure.length; i++) {

                // Create an element for each structure entry
                var questionElement;
                var item = data.structure[i];

                switch (item.questionType) {
                    case 'likert':
                        questionElement = buildScaleQuestion(item);
                        break;
                    case 'radio':
                        questionElement = buildRadioQuestion(item);
                        break;
                    case 'dropdown':
                        questionElement = buildDropdownQuestion(item);
                        break;
                    case 'checkbox':
                        questionElement = buildCheckboxQuestion(item);
                        break;
                }

                // Append a spacer row
                var spacerElement = angular.element('<div class="row"><div class="col-md-12 questionSpacer"></div></div>');

                formElement.append(questionElement);

                formElement.append(spacerElement);
            }

            $compile(formElement)(scope);
        }
    };
}]);