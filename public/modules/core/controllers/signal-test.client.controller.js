'use strict';

/**
 * The `SignalTestController` coordinates with Max to ensure that the
 * signals being received from connected sensors are of acceptable quality.
 *
 * @class Angular.SignalTestController
 */

angular.module('core').controller('SignalTestController', [
    '$scope',
    'SocketIOService',
    'TrialData',
    '$timeout',
    '$log',
    function($scope, SocketIOService, TrialData, $timeout, $log) {

        $log.debug('Loading SignalTestController.');

        var thisController = this;

        /**
         * The `SignalTestController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.SignalTestController
         * @type {{}}
         */

        /**
         * Indicator of EDA signal quality.
         *
         * @name edaQuality
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @type {number}
         */
        $scope.edaQuality = 0;

        /**
         * Indicator of POX signal quality.
         *
         * @name poxQuality
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @type {number}
         */
        $scope.poxQuality = 0;

        /**
         * Indicates whether or not the test recording has been completed by
         * Max.
         *
         * @name testRecordingComplete
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.testRecordingComplete = false;

        /**
         * Indicates whether or not the session is ready to advance. If the
         * app is either in debugging mode or {@link
         * Angular.SignalTestController#$scope#allSignalsGood|$scope#allSignalsGood}
         * is `true`, this method returns `true`.
         *
         * @function readyToAdvance
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.readyToAdvance = function() {
            if ($scope.debugMode) {
                return true;
            } else {
                return $scope.allSignalsGood();
            }
        };

        /**
         * Indicates whether or not the signals are of acceptable quality.
         *
         * @function allSignalsGood
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @return {boolean} Returns `true` if both {@link
         * Angular.SignalTestController#$scope#edaQuality|$scope#edaQuality}
         * and {@link
         * Angular.SignalTestController#$scope#poxQuality|$scope#poxQuality}
         * are `true`.
         */
        $scope.allSignalsGood = function() {
            return $scope.edaQuality && $scope.poxQuality;
        };

        // Set a timeout to fire after 15 seconds
        $timeout(
            function() {
                thisController.sendStopSignalTestMessage();
                $timeout(
                    function() {
                        $scope.edaQuality = 1;
                        $scope.poxQuality = 1;
                    },
                    2.5 * 1000
                );
            },
            12.5 * 1000
        );

        /**
         * Sends a message to Max to start the signal quality test. This
         * message looks like the following:
         *
         * ```
         * {
         *     oscType: 'message',
         *     address: '/eim/control/signalTest',
         *     args: [
         *         {
         *             type: 'integer',
         *             value: 1
         *         },
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * @function sendStartSignalTestMessage
         * @memberof Angular.SignalTestController
         * @instance
         * @return {undefined}
         */
        this.sendStartSignalTestMessage = function() {

            $log.debug('Sending start signal test message to Max.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/signalTest',
                args: [
                    {
                        type: 'integer',
                        value: 1
                    },
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });
        };

        /**
         * Sends a message to Max to stop the signal quality test. This
         * message looks like the following:
         *
         * ```
         * {
         *     oscType: 'message',
         *     address: '/eim/control/signalTest',
         *     args: [
         *         {
         *             type: 'integer',
         *             value: 0
         *         },
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * @function sendStopSignalTestMessage
         * @memberof Angular.SignalTestController
         * @instance
         * @return {undefined}
         */
        this.sendStopSignalTestMessage = function() {

            $log.debug('Sending stop signal test message to Max.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/signalTest',
                args: [
                    {
                        type: 'integer',
                        value: 0
                    },
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });
        };

        /**
         * This method is called when the server fires the
         * `oscMessageReceived` event on the socket.io socket to which the
         * client is connected.
         *
         * If the message is a signal quality message, {@link
         * Angular.SignalTestController#$scope#edaQuality|$scope#edaQuality} or
         * {@link
         * Angular.SignalTestController#$scope#poxQuality|$scope#poxQuality}
         * is updated accordingly. If the message indicates that the test
         * recording is complete, {@link
         * Angular.SignalTestController#$scope#testRecordingComplete|$scope#testRecordingComplete}
         * is updated accordingly and {@link
         * Angular.SignalTestController#sendStopSignalTestMessage|sendStopSignalTestMessage}
         * is called.
         *
         * The receipt of unexpected or malformed messages will result in a
         * warning on the console.
         *
         * @function oscMessageReceivedListener
         * @memberof Angular.SignalTestController
         * @instance
         * @param {{}} data The data sent with the event
         * @return {undefined}
         * @see Node.module:SocketServerController
         */
        this.oscMessageReceivedListener = function(data) {

            console.info('SignalTesttController received an OSC message.');
            console.info(data);

            var expectedMessageAddresses = [
                '/eim/status/signalQuality/eda',
                '/eim/status/signalQuality/pox',
                '/eim/status/testRecordingComplete'
            ];

            // Make sure data is an object with an address property, and that
            // we expect the message
            if (typeof data === 'object' &&
                !Array.isArray(data) &&
                data.hasOwnProperty('address') &&
                expectedMessageAddresses.indexOf(data.address) >= 0) {

                // If it was an EDA signal quality message
                if (data.address === '/eim/status/signalQuality/eda') {

                    // Update EDA signal quality
                    $scope.$apply(function updateEDAQuality() {
                        $scope.edaQuality = data.args[0].value;
                    });
                }

                // If it was a POX signal quality message
                if (data.address === '/eim/status/signalQuality/pox') {

                    // Update POX signal quality
                    $scope.$apply(function updatePOXQuality() {
                        $scope.poxQuality = data.args[0].value;
                    });
                }

                // If the test recording has complete
                if (data.address === '/eim/status/testRecordingComplete') {

                    // Update continue button
                    $scope.$apply(function() {
                        $scope.testRecordingComplete = true;
                    });

                    this.sendStopSignalTestMessage();
                }
            } else {
                $log.warn('SignalTestController did not handle an OSC message.', data);
            }
        };

        // Attach handler for incoming OSC messages
        SocketIOService.on(
            'oscMessageReceived',
            this.oscMessageReceivedListener
        );

        // Destroy handler for incoming OSC messages when $scope is destroyed,
        // and send stop signal test message
        var controller = this;
        $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
            SocketIOService.removeListener(
                'oscMessageReceived',
                controller.oscMessageReceivedListener
            );
            controller.sendStopSignalTestMessage();
        });

        this.sendStartSignalTestMessage();
    }
]);
