'use strict';

// FIXME: Address OSC error when message sent without session ID
// TODO: Use different button colors for Playback and Continue
// TODO: Request and save emotion indices

angular.module('core').controller('MediaPlaybackController', ['$scope', 'TrialData', 'SocketIOService', '$timeout', 'ExperimentManager',
    function($scope, TrialData, SocketIOService, $timeout, ExperimentManager) {
        var thisController = this;

        // State to control button behavior
        $scope.currentButtonLabel = 'Begin Playback';
        $scope.mediaHasPlayed = false;
        $scope.buttonDisabled = false;

        // Send media playback message to Max
        $scope.startMediaPlayback = function() {

            var mediaIndex = TrialData.data.state.mediaPlayCount;
            var mediaLabel = TrialData.data.media[mediaIndex].label;

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/mediaID',
                args: [
                    {
                        type: 'string',
                        value: '' + mediaLabel
                    },
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });

            $scope.buttonAction = ExperimentManager.advanceSlide;
        };

        // Initially set button action to #startMediaPlayback
        $scope.buttonAction = $scope.startMediaPlayback;

        // Request emotion indices from server
        this.requestEmotionIndex = function() {
            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/emotionIndex',
                args: [
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });
        };

        // Setup listener for incoming OSC messages
        this.oscMessageReceivedListener = function(data) {

            // If it was a media playback message
            if (data.address === '/eim/status/playback') {

                // If it was a start message
                if (parseInt(data.args[0].value) === 1) {

                    // Fade out screen
                    $scope.hideBody();

                    // Otherwise, if it was a stop message
                } else if (parseInt(data.args[0].value) === 0) {

                    // Request emotion index from Max
                    thisController.requestEmotionIndex();

                    // Fade in screen
                    $scope.showBody();

                    // Update state
                    $timeout(function() {
                        $scope.$apply(function() {
                            $scope.currentButtonLabel = 'Continue';
                            $scope.mediaHasPlayed = true;
                            $scope.buttonDisabled = true;
                        });
                    });
                }
            } else if (data.address === '/eim/status/emotionIndex') {
				
                var emotionIndex = parseInt(data.args[0].value);
				
                // Increment media play count
                TrialData.data.state.mediaPlayCount++;
				
				// Set emotion index in TrialData
				TrialData.setValueForPathForCurrentMedia('data.answers.emotion_indices', emotionIndex);

                // Update state
                $timeout(function() {
                    $scope.$apply(function() {
                        $scope.buttonDisabled = false;
                        ExperimentManager.advanceSlide();
                    });
                });
            }
        };

        // Attach OSC message received listener
        SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener);

        // Send a message to stop media playback when this controller is destroyed
        // Also, remove OSC message event listeners
        $scope.$on('$destroy', function stopMediaPlayback() {
            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/stopMedia',
                args: {
                    type: 'string',
                    value: '' + TrialData.data.metadata.session_number
                }
            });

            SocketIOService.removeListener('oscMessageReceived', thisController.oscMessageReceivedListener);

            $scope.showBody();
        });
    }
]);