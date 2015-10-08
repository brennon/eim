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
    'SocketIOService',
    '$log',
    function($scope, $timeout, TrialData, ExperimentManager, SocketIOService,
             $log) {

        $log.info('Loading StartController.');

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

        // Set the date on the TrialData service to now
        var now = new Date();
        console.info('Setting time on TrialData as ' + now.toISOString());
        TrialData.data.date = now.toISOString();

        /**
         * This method is called when the server fires the
         * `oscMessageReceived` event on the socket.io socket to which the
         * client is connected. The receipt of unexpected or malformed
         * messages will result in a warning on the console.
         *
         * @function oscMessageReceivedListener
         * @memberof Angular.StartController#
         * @param {{}} data The data sent with the event
         * @return {undefined}
         * @see Node.module:SocketServerController
         */
        this.oscMessageReceivedListener = function(data) {

            console.info('StartController received an OSC message.');
            console.info(data);

            /* istanbul ignore else */
            if (typeof data === 'object' &&
                !Array.isArray(data) &&
                data.hasOwnProperty('address') &&
                data.address === '/eim/status/startExperiment') {
                $scope.$apply(function() {
                    $scope.maxReady = true;
                });
            } else {
                $log.warn(
                    'StartController did not handle an OSC message.',
                    data
                );
            }
        };

        // Attach handler for incoming OSC messages
        SocketIOService.on(
            'oscMessageReceived',
            this.oscMessageReceivedListener
        );

        // Destroy handler for incoming OSC messages and remove error
        // timeout when $scope is destroyed
        var thisController = this;
        $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
            SocketIOService.removeListener(
                'oscMessageReceived',
                thisController.oscMessageReceivedListener
            );

            console.debug('Cancelling timeout on StartController.');
            $timeout.cancel(thisController.errorTimeout);
        });

        /**
         * Send a message to the server indicating that the client is ready
         * to start the experiment. This method sets {@link
            * Angular.StartController#$scope.maxReady} to `false` before
         * sending the message.
         *
         * @function sendExperimentStartMessage
         * @memberof Angular.StartController#
         * @return {undefined}
         */
        this.sendExperimentStartMessage = function() {

            console.info('StartController sending experiment start message.');

            /**
             * Flag indicating whether or not the Max application is ready.
             *
             * @name maxReady
             * @memberof Angular.StartController#$scope
             * @instance
             * @type {boolean}
             */
            $scope.maxReady = false;
            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/startExperiment',
                args: {
                    type: 'string',
                    value: '' + TrialData.data.metadata.session_number
                }
            });
        };

        this.sendExperimentStartMessage();

        /**
         * When the controller is instantiated, this timeout is set. The
         * timeout waits ten seconds for Max to respond that it is ready. If
         * Max does not respond within this time, an error is shown to the user.
         *
         * @name errorTimeout
         * @type {$q.Promise}
         * @memberof Angular.StartController#
         */
        this.errorTimeout = $timeout(function() {
        }, 10000);

        this.errorTimeout.then(function() {
            if (!$scope.readyToAdvance()) {
                $scope.addGenericErrorAlert();

                throw new Error('Max did not responded to the ' +
                    'startExperiment message within 10 seconds.');
            }
        });
    }
]);
