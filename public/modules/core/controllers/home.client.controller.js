'use strict';

/**
 * In the demo application, the `HomeController` is the primary
 * controller used for the `'home'` state. This controller resets the
 * {@link Angular.ExperimentManager|ExperimentManager} service and, when
 * successful, sets the `readyToAdvance` flag on its `$scope` to `true`.
 *
 * @class Angular.HomeController
 */

angular.module('core').controller('HomeController', ['ExperimentManager', '$scope', '$log', 'OSC',
    function(ExperimentManager, $scope, $log, OSC) {

        $log.debug('Loading HomeController.');

        // Reset ExperimentManager for new trial
        ExperimentManager.masterReset().then(
            function experimentResetSuccessHandler() {
                $scope.readyToAdvance = true;
            },
            function experimentResetErrorHandler() {
                $scope.addGenericErrorAlert();
                throw new Error('An experiment schema could not be fetched ' +
                    'from the server');
            }
        );

        // Start a new physio recording
        OSC.send({
            oscType: 'message',
            address: '/eim/control/startSignalRecording'
        });

        /**
         * The `HomeController`'s `$scope` object. All properties on `$scope`
         * are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.HomeController
         * @type {{}}
         */

        /**
         * Ready to advance flag.
         *
         * On instantiation of the controller, this is set to `false`. Once
         * the {@link Angular.ExperimentManager|ExperimentManager} is reset,
         * this flag is set to `true`.
         *
         * @name readyToAdvance
         * @memberof Angular.HomeController#$scope
         * @instance
         * @type {boolean}
         */

        // Ready to move to next slide?
        $scope.readyToAdvance = false;

    }
]);