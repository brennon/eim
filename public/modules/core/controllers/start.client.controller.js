'use strict';

/**
 * In the demo application, the `StartController` is the primary
 * controller used for the `'start'` state. This controller checks that the
 * Max helper application is responsive, and blocks participants from
 * continuing in the session if Max is not responsive.
 *
 * @class Angular.StartController
 */

angular.module('core').controller('StartController', [
    '$scope',
    '$timeout',
    'TrialData',
    'ExperimentManager',
    '$log',
    'OSC',
    function($scope, $timeout, TrialData, ExperimentManager, $log, OSC) {

        $log.debug('Loading StartController.');

        /**
         * The `StartController`'s `$scope` object. All properties on `$scope`
         * are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.StartController
         * @type {{}}
         */

        /***** $scope *****/

        /**
         * Ready to advance method. Returns try if the Max helper
         * application is ready or if debugging mode has been enabled.
         *
         * @function readyToAdvance
         * @memberof Angular.StartController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.readyToAdvance = function() {
            return $scope.maxReady || $scope.debugMode;
        };

        /**
         * Flag indicating whether or not the Max application is ready.
         *
         * @name maxReady
         * @memberof Angular.StartController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.maxReady = false;


        /***** $scope Events *****/

        // Destroy handler for incoming OSC messages and remove error
        // timeout when $scope is destroyed
        var thisController = this;
        $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
            OSC.unsubscribe(
                '/eim/status/startExperiment',
                thisController.startMessageListener
            );

            $log.debug('Cancelling timeout on StartController.');
            $timeout.cancel(thisController.errorTimeout);
        });


        /***** Inner members *****/

        /**
         * This method is called when the server fires the
         * `OSC` service receives a message with the address
         * /eim/status/startExperiment
         *
         * @function startMessageListener
         * @memberof Angular.StartController#
         * @param {{}} msg The data sent with the event
         * @return {undefined}
         * @see Node.module:SocketServerController
         */
        this.startMessageListener = function startMessageListenerFn(msg) {

            $log.info('StartController received an OSC message.');
            $log.info(msg);

            $scope.$apply(function() {
                $scope.maxReady = true;
            });
        };

        /**
         * Send a message to the server indicating that the client is ready
         * to start the experiment. This method sets {@link
         * Angular.StartController#$scope.maxReady} to `false` before sending
         * the message.
         *
         * @function sendExperimentStartMessage
         * @memberof Angular.StartController#
         * @return {undefined}
         */
        this.sendExperimentStartMessage = function() {

            $log.info('StartController sending experiment start message.');

            // Sanity check
            $scope.maxReady = false;

            OSC.send({
                oscType: 'message',
                address: '/eim/control/startExperiment',
                args: {
                    type: 'string',
                    value: '' + TrialData.data.metadata.session_number
                }
            });
        };

        /**
         * When the controller is instantiated, this timeout is set. The
         * timeout waits ten seconds for Max to respond that it is ready. If
         * Max does not respond within this time, an error is shown to the user.
         *
         * @name errorTimeout
         * @type {$q.Promise}
         * @memberof Angular.StartController#
         */
        this.errorTimeout = $timeout(function() {}, 10000);

        this.errorTimeout.then(function() {
            if (!$scope.readyToAdvance()) {
                $scope.addGenericErrorAlert();

                throw new Error('Max did not responded to the ' +
                    'startExperiment message within 10 seconds.');
            }
        });


        /***** Initialization logic *****/

        // Listen for OSC messages sent to /eim/status/startExperiment
        OSC.subscribe(
            '/eim/status/startExperiment',
            this.startMessageListener
        );

        // Set the date on the TrialData service to now
        var now = new Date();
        $log.info('Setting time on TrialData as ' + now.toISOString());
        TrialData.data.date = now.toISOString();

        // Tell Max to start the experiment
        this.sendExperimentStartMessage();
    }
]);
