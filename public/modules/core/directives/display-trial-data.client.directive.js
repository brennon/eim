'use strict';

// Display Trial Data for debugging
angular.module('core').directive('displayTrialData', function() {
  return {
    restrict: 'AE',
    template: '<div><h3>Trial Data</h3><pre>Subject: {{trialDataJson()}}</pre></div>'
  }
});