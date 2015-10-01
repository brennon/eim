'use strict';

/**
 * In the demo application, the `MediaPlaybackController` is responsible for
 * initiating the playback of media excerpts.
 *
 * @class Angular.MediaPlaybackController
 */

angular.module('core').controller('MediaPlaybackController', [
    '$scope',
    'TrialData',
    'SocketIOService',
    '$timeout',
    'ExperimentManager',
    '$log',
    function($scope, TrialData, SocketIOService, $timeout,
             ExperimentManager, $log) {

        $log.debug('Loading MediaPlaybackController.');

        var thisController = this;

        /**
         * The `MediaPlaybackController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.MediaPlaybackController
         * @type {{}}
         */

        /**
         * The initial label for the button in the view.
         *
         * @name currentButtonLabel
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @type {string}
         */
        $scope.currentButtonLabel = 'Begin Playback';

        /**
         * Indicates whether or not the media excerpt has been played.
         *
         * @name mediaHasPlayed
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.mediaHasPlayed = false;

        /**
         * Indicates whether or not the 'continue' button is disabled.
         *
         * @name buttonDisabled
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.buttonDisabled = false;

        // Send media playback message to Max
        /**
         * Sends a message to the Max helper application to initiate media
         * playback. The message includes the current session number and the
         * media label (according to the [study specification
         * document](index.html)), both retrieved from the {@link
         * Angular.TrialData|TrialData} service. This object sent with this
         * message is formatted like the following:
         *
         * ```
         * {
         *     oscType: 'message,
         *     address: '/eim/control/mediaID',
         *     args: [
         *         {
         *             type: 'string',
         *             value: <MEDIALABEL>
         *         },
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * When this method is called, {@link
         * Angular.MediaPlaybackController#$scope#buttonAction|$scope#buttonAction}
         * is bound to {@link Angular.ExperimentManager#advanceSlide|ExperimentManager#advanceSlide}.
         *
         * @function startMediaPlayback
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @return {undefined}
         */
        $scope.startMediaPlayback = function() {

            var mediaIndex = TrialData.data.state.mediaPlayCount;
            var mediaLabel = TrialData.data.media[mediaIndex].label;

            $log.debug('Requesting playback of \'' + mediaLabel + '\'.');

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

            $log.debug('Binding $scope.buttonAction in' +
                ' MediaPlaybackController to ExperimentManager.advanceSlide');

            $scope.buttonAction = ExperimentManager.advanceSlide;
        };

        /**
         * The method to which the button in the view is bound. Initially,
         * the button is bound to {@link
         * Angular.MediaPlaybackController#$scope#startMediaPlayback|$scope#startMediaPlayback}.
         *
         * @name buttonAction
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @type {function}
         */
        $scope.buttonAction = $scope.startMediaPlayback;

        /**
         * Requests the most recently recorded emotion index from the server
         * over OSC. The message used to retrieve this value is like the
         * following:
         *
         * ```
         * {
         *     oscType: 'message',
         *     address: '/eim/control/emotionIndex',
         *     args: [
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * @function requestEmotionIndex
         * @memberof Angular.MediaPlaybackController
         * @instance
         * @return {undefined}
         */
        this.requestEmotionIndex = function() {

            $log.debug('Requesting emotion index.');

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

        /**
         * This method is called when the server fires the
         * `oscMessageReceived` event on the socket.io socket to which the
         * client is connected.
         *
         * The message may indicate one of three things:
         *
         * 1. Playback has begun
         *  - In this case, the page is simply blacked out.
         * 2. Playback has ended
         *  - Here, the blackout is removed, the emotion index is requestd,
         *  {@link Angular.MediaPlaybackController#$scope#currentButtonLabel|$scope#currentButtonLabel}
         *  is set to `'Continue'`, {@link Angular.MediaPlaybackController#$scope#mediaHasPlayed|$scope#mediaHasPlayed}
         *  is set to `true`, and {@link Angular.MediaPlaybackController#$scope#buttonDisabled|$scope#buttonDisabled} is set to `true`.
         * 3. The emotion index has been received
         *  - In this last case, {@link Angular.TrialData|TrialData} is
         *  updated with the received emotion index, {@link Angular.MediaPlaybackController#$scope#buttonDisabled|$scope#buttonDisabled}
         *  is set to `false`, and the slide is advanced by calling
         *  {@link Angular.ExperimentManager#advanceSlide|ExperimentManager#advanceSlide}.
         *
         * @function oscMessageReceivedListener
         * @memberof Angular.MediaPlaybackController
         * @instance
         * @param {{}} data The data sent with the event
         * @return {undefined}
         * @see Node.module:SocketServerController
         */
        this.oscMessageReceivedListener = function(data) {

            $log.debug('OSC message received.');
            $log.debug(data);

            // If it was a media playback message
            if (data.address === '/eim/status/playback') {

                // Check for start or stop message
                switch (parseInt(data.args[0].value)) {

                    // If it was a stop message
                    case 0:

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
                        break;

                    // If it was a start message
                    case 1:

                        // Fade out screen
                        $scope.hideBody();
                        break;
                }
            }

            // If it was an emotion index message
            if (data.address === '/eim/status/emotionIndex') {
				
                var emotionIndex = parseInt(data.args[0].value);
				
                // Increment media play count
                TrialData.data.state.mediaPlayCount++;
				
				// Set emotion index in TrialData
				TrialData.setValueForPathForCurrentMedia(
                    'data.answers.emotion_indices',
                    emotionIndex
                );

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
        SocketIOService.on(
            'oscMessageReceived',
            this.oscMessageReceivedListener
        );

        // Send a message to stop media playback when this controller is
        // destroyed. Also, remove OSC message event listeners.
        $scope.$on('$destroy', function stopMediaPlayback() {

            $log.debug('MediaPlaybackController scope destroyed. Stopping' +
                ' playback, removing OSC listener, and showing body.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/stopMedia',
                args: {
                    type: 'string',
                    value: '' + TrialData.data.metadata.session_number
                }
            });

            SocketIOService.removeListener(
                'oscMessageReceived',
                thisController.oscMessageReceivedListener
            );

            $scope.showBody();
        });
    }
]);
