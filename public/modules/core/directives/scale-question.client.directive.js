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

      scope.$watch(attrs.questionId+'RadioGroup', function(newValue, oldValue) {
        scope.sendToTrialData(attrs.controllerDataPath, parseInt(newValue));
      });

      var questionHeader = angular.element('<div class="row"><div class="col-md-12 text-center"><h3>'+attrs.questionLabel+'</h3></div></div>');

      var image;
      if (attrs.singleImgSrc) {
        image = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-8 text-center"><img src="' + attrs.singleImgSrc + '"></div><div class="col-md-2"></div></div>');
      } else if (attrs.leftImgSrc && attrs.rightImgSrc) {
        image = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-2"><img src="' + attrs.leftImgSrc + '"></div><div class="col-md-4"></div><div class="col-md-2"><img src="' + attrs.rightImgSrc + '"></div><div class="col-md-2"></div></div>');
      }

      var innerRadioHTML = '';

      for (var i = 1; i <= 5; i++) {
        innerRadioHTML += '<div class="col-md-5ths"><input type="radio" name="'+attrs.questionId+'RadioGroup" id="'+attrs.questionId+'RadioGroup'+i+'" value="'+i+'" required ng-model="'+attrs.questionId+'RadioGroup"></div>';
      }

      var radios = angular.element('<div class="row">\n    <div class="col-md-2"></div>\n    <div class="col-md-8 text-center">\n        '+innerRadioHTML+'<div class="row">\n        </div>\n    </div>\n    <div class="col-md-2"></div>\n</div>');

      var descriptions = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-2 small text-left">'+attrs.minimumDescription+'</div><div class="col-md-4"></div><div class="col-md-2 small text-right">'+attrs.maximumDescription+'</div><div class="col-md-2"></div></div></div>')

      element.append(questionHeader);
      element.append(image);
      element.append(radios);
      element.append(descriptions);

      $compile(element.contents())(scope);
    }
  };
}]);