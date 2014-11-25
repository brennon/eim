'use strict';

angular.module('core').directive('scaleQuestion', ['$compile', 'TrialData', function($compile, TrialData) {


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

      scope[attrs.questionId+'RadioGroup'] = null;

      scope.$watch(attrs.questionId+'RadioGroup', function(newValue) {
        scope.sendToTrialData(attrs.controllerDataPath, parseInt(newValue));
      });

      var questionHeader;
      if (attrs.labelType === 'labelLeft') {
        questionHeader = angular.element('<div class="row"><div class="col-md-12"><label translate>' + attrs.questionLabel + '</label></div></div>');
      } else {
        questionHeader = angular.element('<div class="row"><div class="col-md-12 text-center"><h3 translate>' + attrs.questionLabel + '</h3></div></div>');
      }

      var image;
      if (attrs.singleImgSrc) {
        image = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-8 text-center"><img src="' + attrs.singleImgSrc + '"></div><div class="col-md-2"></div></div>');
      } else if (attrs.leftImgSrc && attrs.rightImgSrc) {
        image = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-2"><img src="' + attrs.leftImgSrc + '"></div><div class="col-md-4"></div><div class="col-md-2"><img src="' + attrs.rightImgSrc + '"></div><div class="col-md-2"></div></div>');
      }

      var optionLabels;
      if (element.data('questionOptions') && element.data('questionOptions').choices) {
        var choices = element.data('questionOptions').choices;

        optionLabels = angular.element('<div class="row"></div>');

        optionLabels.append('<div class="col-md-2 option-label-spacer"></div>');

        var centerGroup = angular.element('<div class="col-md-8 option-label-container"></div>');

        var innerRow = angular.element('<div class="row"></div>');

        for (var i = 0; i < choices.length; i++) {
          var choiceDiv = angular.element('<div class="col-md-5ths option-label text-center">{{ \'' + choices[i].label + '\' | translate }}</div>');
          innerRow.append(choiceDiv);
        }

        centerGroup.append(innerRow);

        optionLabels.append(centerGroup);

        optionLabels.append('<div class="col-md-2 option-label-spacer"></div>');
      }

      var innerRadioHTML = '';

      for (var j = 1; j <= 5; j++) {
        innerRadioHTML += '<div class="col-md-5ths text-center"><input type="radio" name="'+attrs.questionId+'RadioGroup" id="'+attrs.questionId+'RadioGroup'+j+'" value="'+j+'" required ng-model="'+attrs.questionId+'RadioGroup"></div>';
      }

      var radios = angular.element('<div class="row">\n    <div class="col-md-2"></div>\n    <div class="col-md-8 text-center">\n        '+innerRadioHTML+'<div class="row">\n        </div>\n    </div>\n    <div class="col-md-2"></div>\n</div>');

      var descriptions;
      if (attrs.minimumDescription && attrs.maximumDescription) {
        descriptions = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-2 small text-left" translate>' + attrs.minimumDescription + '</div><div class="col-md-4"></div><div class="col-md-2 small text-right" translate>' + attrs.maximumDescription + '</div><div class="col-md-2"></div></div></div>');
      }

      // Wrap everything in a row div with well class
      var wrapperDiv = angular.element('<div class="row well"></div>');

      wrapperDiv.append(questionHeader);
      wrapperDiv.append(image);
      wrapperDiv.append(optionLabels);
      wrapperDiv.append(radios);

      if (descriptions) {
        wrapperDiv.append(descriptions);
      }

      // Add wrapper div to element
      element.append(wrapperDiv);

      $compile(element.contents())(scope);
    }
  };
}]);