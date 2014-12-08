'use strict';

// Display Trial Data for debugging
angular.module('core').directive('displayTrialData', function() {

    return {
        restrict: 'AE',
        template: '<div class="row trial-data-row"><div class="col-md-12"><h3>Trial Data</h3><pre>{{trialDataJson()}}</pre></div></div>'
    };
});