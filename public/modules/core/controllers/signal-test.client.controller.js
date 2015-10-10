'use strict';

/**
 * The `SignalTestController` coordinates with Max to ensure that the
 * signals being received from connected sensors are of acceptable quality.
 *
 * @class Angular.SignalTestController
 */

angular.module('core').controller('SignalTestController', [
    '$scope',
    'TrialData',
    '$timeout',
    '$log',
    'OSC',
    function($scope, TrialData, $timeout, $log, OSC) {

        $log.debug('Loading SignalTestController.');


        /***** $scope *****/


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


        /***** Inner members *****/


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

            OSC.send({
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

            var stopMessage = {
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
            };

            OSC.send(stopMessage);
        };

        /**
         * This method is called when an EDA quality OSC message is received.
         * {@link
         * Angular.SignalTestController#$scope#edaQuality|$scope#edaQuality}
         * is updated accordingly.
         *
         * @function edaQualityMessageListener
         * @memberof Angular.SignalTestController
         * @instance
         * @param {{}} msg The message sent with the event
         * @return {undefined}
         */
        this.edaQualityMessageListener =
            function edaQualityMessageListenerFn(msg) {
                var edaQuality = msg.args[0].value;
                if (edaQuality === 0) {
                    $log.warn(
                        'Bad EDA signal detected on terminal ' +
                        TrialData.data.metadata.terminal +
                        '.'
                    );
                }

                // Update EDA signal quality
                $scope.$apply(function updateEDAQuality() {
                    $scope.edaQuality = edaQuality;
                });
            };

        /**
         * This method is called when a POX quality OSC message is received.
         * {@link
         * Angular.SignalTestController#$scope#poxQuality|$scope#poxQuality}
         * is updated accordingly.
         *
         * @function poxQualityMessageListener
         * @memberof Angular.SignalTestController
         * @instance
         * @param {{}} msg The data sent with the event
         * @return {undefined}
         */
        this.poxQualityMessageListener =
            function poxQualityMessageListenerFn(msg) {
                var poxQuality = msg.args[0].value;
                if (poxQuality === 0) {
                    $log.warn(
                        'Bad POX signal detected on terminal ' +
                        TrialData.data.metadata.terminal +
                        '.'
                    );
                }

                // Update POX signal quality
                $scope.$apply(function updatePOXQuality() {
                    $scope.poxQuality = poxQuality;
                });
            };

        /**
         * This method is called when an OSC message indicating that the signal
         * test recording is complete is received. {@link
         * Angular.SignalTestController#$scope#testRecordingComplete|$scope#testRecordingComplete}
         * is updated accordingly and {@link
         * Angular.SignalTestController#sendStopSignalTestMessage|sendStopSignalTestMessage}
         * is called.
         *
         * @function recordingCompleteMessageListener
         * @memberof Angular.SignalTestController
         * @instance
         * @return {undefined}
         */
        this.recordingCompleteMessageListener =
            function recordingCompleteMessageListenerFn() {

                // Update continue button
                $scope.$apply(function() {
                    $scope.testRecordingComplete = true;
                });

                this.sendStopSignalTestMessage();
            };


        /***** Initialization logic *****/


        var thisController = this;

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

        // Attach handlers for incoming OSC messages
        OSC.subscribe(
            '/eim/status/signalQuality/eda',
            this.edaQualityMessageListener
        );
        OSC.subscribe(
            '/eim/status/signalQuality/pox',
            this.poxQualityMessageListener
        );
        OSC.subscribe(
            '/eim/status/testRecordingComplete',
            this.recordingCompleteMessageListener
        );

        // Destroy handler for incoming OSC messages when $scope is destroyed,
        // and send stop signal test message
        var controller = this;
        $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
            OSC.unsubscribe(
                '/eim/status/signalQuality/eda',
                controller.edaQualityMessageListener
            );
            OSC.unsubscribe(
                '/eim/status/signalQuality/pox',
                controller.poxQualityMessageListener
            );
            OSC.unsubscribe(
                '/eim/status/testRecordingComplete',
                controller.recordingCompleteMessageListener
            );

            controller.sendStopSignalTestMessage();
        });

        this.sendStartSignalTestMessage();
    }
]);
