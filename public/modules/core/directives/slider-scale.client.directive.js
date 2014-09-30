'use strict';

angular.module('core').directive('sliderScale', ['$compile', 'TrialData', function($compile, TrialData) {
  return {
    replace: false,
    restrict: 'E',
    scope: {},

    link: function(scope, element, attrs) {

      if (attrs.associatedToMedia && attrs.associatedToMedia.toLowerCase() === 'true') {
        scope.associated = true;
      } else {
        scope.associated = false;
      }

      scope.sendToTrialData = function(path, value) {
        if (scope.associated) {
          TrialData.setValueForPathForCurrentMedia(path, value);
        } else {
          TrialData.setValueForPath(path, value);
        }
      };

      var sliderElement;
      switch (attrs.imageType) {
        case 'extremes':
          sliderElement = angular.element('<div class="row"><div class="col-md-2 text-center slider-image"></div><div class="col-md-2 slider-image text-center"><img src="' + attrs.leftImageSrc + '" /></div><!----><div class="col-md-4 slider-image"></div><!----><div class="col-md-2 slider-image text-center"><img src="' + attrs.rightImageSrc + '" /></div><!----><div class="col-md-2 text-center slider-image"></div><div class="clearBoth"></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
          break;
        case 'single':
          sliderElement = angular.element('<div class="row"><div class="col-md-12 slider-image text-center"><img src="' + attrs.singleImageSrc + '" /></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
          break;
        default:
          sliderElement = angular.element('<div class="row"><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
          break;
      }

      $compile(sliderElement)(scope);
      element.after(sliderElement);

      // Send initial values to TrialData
      scope.sendToTrialData(attrs.controllerDataPath, attrs.sliderInitialValue);
    }
  };
}]);