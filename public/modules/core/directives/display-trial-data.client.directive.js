'use strict';

/**
 * The `displayTrialData` directive is simply a convenient way to display
 * the current {@link Angular.TrialData#data|TrialData#data} anywhere in the
 * view.
 *
 * @example <display-trial-data></display-trial-data>
 *
 * @class Angular.displayTrialDataDirective
 */

angular.module('core').directive('displayTrialData', [
    '$log',
    function($log) {

        $log.debug('Rendering displayTrialData directive.');

        return {
            restrict: 'AE',
            template: '<div class="row trial-data-row">' +
            '<div class="col-md-12">' +
            '<h3>Trial Data</h3>' +
            '<pre>{{trialDataJson()}}</pre>' +
            '</div>' +
            '</div>'
        };
    }]);