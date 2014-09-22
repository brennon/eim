'use strict';

// TODO: Add ability to show textual descriptions of extremes
// TODO: Add textual descriptions of extremes to all slides

angular.module('core').directive('sliderScale', function() {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      controllerValueChanged: '&'
    },
    template: function(element, attrs) {

      var htmlString = '';

      var associated;
      if (attrs.associatedToMedia.toLowerCase() === 'true') {
        associated = true;
      } else {
        associated = false;
      }

      switch (attrs.imageType) {
        case 'single':
          htmlString = '<div class="row"><div class="col-md-12 slider-image text-center"><img src="' + attrs.singleImageSrc + '" /></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="controllerValueChanged({path: \'' + attrs.controllerDataPath + '\', value: sliderModel, associated: ' + associated + '})" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>';
          return htmlString;
        case 'extremes':
          htmlString = '<div class="row"><div class="col-md-2 text-center slider-image"></div><div class="col-md-2 slider-image text-center"><img src="' + attrs.leftImageSrc + '" /></div><!----><div class="col-md-4 slider-image"></div><!----><div class="col-md-2 slider-image text-center"><img src="' + attrs.rightImageSrc + '" /></div><!----><div class="col-md-2 text-center slider-image"></div><div class="clearBoth"></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="controllerValueChanged({path: \'' + attrs.controllerDataPath + '\', value: sliderModel, associated: ' + associated + '})" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>';
          return htmlString;
        default:
          htmlString = '<div class="row"><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="controllerValueChanged({path: \'' + attrs.controllerDataPath + '\', value: sliderModel, associated: ' + associated + '})" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>';
          return htmlString;
      }
    }
  };
});