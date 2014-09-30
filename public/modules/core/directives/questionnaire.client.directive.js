'use strict';

angular.module('core').directive('questionnaire', ['$compile', function($compile) {

  function createLikertQuestion(specification) {

    // Create base element
    var row = angular.element('<div class="row"></div>');

    var label = angular.element('<div class="col-md-12"><label class="questionLabel">' + specification.questionLabel + '</label></div>');

    var cols = angular.element('<div class="col-md-12"></div>');
    var slider = angular.element('<slider-scale></slider-scale>');

    // Default values
    slider.attr('slider-step', 1);
    slider.attr('slider-stretch', 0);
    slider.attr('required', 'true');

    // Persistence properties
    slider.attr('controller-data-path', specification.questionStoragePath);
    slider.attr('associated-to-media', specification.questionIsAssociatedToMedia);

    // Slider range properties
    slider.attr('slider-floor', specification.questionLikertMinimum);
    slider.attr('slider-ceiling', specification.questionLikertMaximum);
    slider.attr('slider-initial-value', specification.questionLikertInitialValue);

    // Image properties
    slider.attr('use-image', specification.questionLikertUseImage);
    slider.attr('image-type', specification.questionLikertImageType);
    slider.attr('left-image-src', specification.questionLikertLeftImageSrc);
    slider.attr('right-image-src', specification.questionLikertRightImageSrc);
    slider.attr('single-image-src', specification.questionLikertSingleImageSrc);

    // Append slider to columns element, and columns element to row element
    cols.append(slider);
    row.append(label);
    row.append(cols);

    return row;
  }

  return {
    replace: false,
    restrict: 'E',
    scope: {
      questionnaireData: '='
    },

    link: function(scope, element, attrs) {

      var data = scope.questionnaireData;

      // Create an element for the title
      var titleElement = angular.element('<div class="row"><div class="col-md-12"><h1>' + data.title + '</h1></div></div>');

      // Append title element
      element.append(titleElement);

      var formElement = angular.element('<form name="questionnaireForm" class="form" novalidate></form>');

      // Iterate over structure
      for (var i = 0; i < data.structure.length; i++) {

        // Create an element for each structure entry
        var questionElement;
        var item = data.structure[i];

        switch (item.questionType) {
          case 'likert':
            questionElement = createLikertQuestion(item);

            // Add max/min descriptions if they are present
            if (item.questionLikertMinimumDescription && item.questionLikertMaximumDescription) {
              var descriptionElement = ('<div class="row">' +
                '<div class="col-md-2 text-center slider-image"></div>' +
                '<div class="col-md-2 sliderAnnotation">' + item.questionLikertMinimumDescription + '</div>' +
                '<div class="col-md-4 slider-image"></div>' +
                '<div class="col-md-2 sliderAnnotation">' + item.questionLikertMaximumDescription + '</div>' +
                '<div class="col-md-2 text-center slider-image"></div>' +
                '</div>');

              questionElement.append(descriptionElement);
            }
        }

        // Append question element to form
        formElement.append(questionElement);

        var spacerElement = angular.element('<div class="row"><div class="col-md-12 questionSpacer"></div></div>');
        formElement.append(spacerElement);

        $compile(questionElement)(scope);
      }

      // Attach form after title
      titleElement.after(formElement);
      element.after(formElement);
    }
  };
}]);