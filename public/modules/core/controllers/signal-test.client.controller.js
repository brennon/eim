'use strict';

// TODO: Watch for and log sensor issues
// TODO: In the event of sensor issues, still allow user to advance after delay

angular.module('core').controller('SignalTestController', ['$scope', 'SocketIOService', 'TrialData', '$timeout',
    function($scope, SocketIOService, TrialData, $timeout) {

        var thisController = this;

        // Signal quality indicators
        $scope.edaQuality = 0;
        $scope.poxQuality = 0;
        $scope.testRecordingComplete = false;

        $scope.readyToAdvance = function() {
            if ($scope.debugMode) {
                return true;
            } else {
                return $scope.allSignalsGood();
            }
        };

        // Has test recording been completed?
        $scope.allSignalsGood = function() {
            return $scope.edaQuality && $scope.poxQuality;
        };

        // Set a timeout to fire after 15 seconds
        $timeout(
            function() {
                thisController.sendStopSignalTestMessage();
                $scope.edaQuality = 1;
                $scope.poxQuality = 1;
            },
            15 * 1000
        );

        // Function to send start signal test message
        this.sendStartSignalTestMessage = function() {
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

        // Function to send stop signal test message
        this.sendStopSignalTestMessage = function() {
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

        // Configure handler for incoming OSC messages
        this.oscMessageReceivedListener = function(data) {

            // If it was an EDA signal quality message
            if (data.address === '/eim/status/signalQuality/eda') {

                // Update EDA signal quality
                $scope.$apply(function updateEDAQuality() {
                    $scope.edaQuality = data.args[0].value;
                });

                // If it was a POX signal quality message
            } else if (data.address === '/eim/status/signalQuality/pox') {

                // Update POX signal quality
                $scope.$apply(function updatePOXQuality() {
                    $scope.poxQuality = data.args[0].value;
                });

                // If the test recording has complete
            } else if (data.address === '/eim/status/testRecordingComplete') {

                // Update continue button
                $scope.$apply(function() {
                    $scope.testRecordingComplete = true;
                });

                this.sendStopSignalTestMessage();
            }
        };

        // Attach handler for incoming OSC messages
        SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener);

        // Destroy handler for incoming OSC messages when $scope is destroyed,
        // and send stop signal test message
        var controller = this;
        $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
            SocketIOService.removeListener('oscMessageReceived', controller.oscMessageReceivedListener);
            controller.sendStopSignalTestMessage();
        });

        this.sendStartSignalTestMessage();
    }
]);