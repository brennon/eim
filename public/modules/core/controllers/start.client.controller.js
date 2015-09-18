'use strict';

angular.module('core').controller('StartController', ['$scope', '$timeout', 'TrialData', 'ExperimentManager', 'SocketIOService',
    function($scope, $timeout, TrialData, ExperimentManager, SocketIOService) {

        // Ready to advance?
        $scope.readyToAdvance = function() {
            return $scope.maxReady || $scope.debugMode;
        };

        // Set the date on the TrialData service to now
        var now = new Date();
        TrialData.data.date = now.toISOString();

        // Configure handler for incoming OSC messages
        this.oscMessageReceivedListener = function(data) {

            // TODO: Log incoming OSC messages that we don't handle and remove next Istanbul directive
            /* istanbul ignore else */
            if (data.address === '/eim/status/startExperiment') {
                $scope.$apply(function() {
                    $scope.maxReady = true;
                });
            }
        };

        // Attach handler for incoming OSC messages
        SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener);

        // Destroy handler for incoming OSC messages and remove error timeout when $scope is destroyed
        var thisController = this;
        $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
            SocketIOService.removeListener('oscMessageReceived', thisController.oscMessageReceivedListener);
            $timeout.cancel(thisController.errorTimeout);
        });

        this.sendExperimentStartMessage = function() {

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

        this.errorTimeout = $timeout(function() {}, 10000);
        this.errorTimeout.then(function() {
            if (!$scope.readyToAdvance) {
                $scope.addGenericErrorAlert();

                // TODO: Are we handling this error gracefully?

                throw new Error('Max had not responded to startExperiment message after 10 seconds');
            }
        });
    }
]);