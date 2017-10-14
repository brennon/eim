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
    '$timeout',
    'ExperimentManager',
    '$log',
    'OSC',
    function($scope, TrialData, $timeout, ExperimentManager, $log, OSC) {

        $log.debug('Loading MediaPlaybackController.');

        var thisController = this;


        /***** $scope *****/


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

            OSC.send({
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


        /***** $scope Event Handlers *****/


        // Send a message to stop media playback when this controller is
        // destroyed. Also, remove OSC message event listeners.
        $scope.$on('$destroy', function stopMediaPlayback() {

            $log.debug('MediaPlaybackController scope destroyed. Stopping' +
                ' playback, removing OSC listener, and showing body.');

            OSC.send({
                oscType: 'message',
                address: '/eim/control/stopMedia',
                args: {
                    type: 'string',
                    value: '' + TrialData.data.metadata.session_number
                }
            });

            ExperimentManager.generatePlot();

            OSC.unsubscribe(
                '/eim/status/playback',
                thisController.playbackMessageListener
            );

            OSC.unsubscribe(
                '/eim/status/emotionIndex',
                thisController.emotionIndexMessageListener
            );

            $scope.showBody();
        });


        /***** Inner Members *****/


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
        this.requestEmotionIndex = function requestEmotionIndexFn() {

            $log.debug('Requesting emotion index.');

            OSC.send({
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
         * This method is called when the server fires the controller receives
         * a message with the address `/eim/status/playback`. When this
         * occurs, if the message indicates that playback has begun, the page
         * is blacked out. If the message indicates that playback has ended,
         * the blackout is removed, the emotion index is requested, {@link
         * Angular.MediaPlaybackController#$scope#currentButtonLabel|$scope#currentButtonLabel}
         *  is set to `'Continue'`, {@link
         *  Angular.MediaPlaybackController#$scope#mediaHasPlayed|$scope#mediaHasPlayed}
         *  is set to `true`, and {@link
         *  Angular.MediaPlaybackController#$scope#buttonDisabled|$scope#buttonDisabled}
         *  is set to `true`.
         *
         * @function playbackMessageListener
         * @memberof Angular.MediaPlaybackController
         * @instance
         * @param {{}} msg The OSC message
         * @return {undefined}
         */
        this.playbackMessageListener = function playbackMessageListenerFn(msg) {
            switch (parseInt(msg.args[0].value)) {

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
        };

        /**
         * This method is called when the server fires the controller receives
         * a message with the address `/eim/status/emotionIndex`. When this
         * occurs, {@link Angular.TrialData|TrialData} is updated with the
         * received emotion index, {@link
         * Angular.MediaPlaybackController#$scope#buttonDisabled|$scope#buttonDisabled}
         *  is set to `false`, and the slide is advanced by calling
         *  {@link
         *  Angular.ExperimentManager#advanceSlide|ExperimentManager#advanceSlide}.
         *
         * @function emotionIndexMessageListener
         * @memberof Angular.MediaPlaybackController
         * @instance
         * @param {{}} msg The OSC message
         * @return {undefined}
         */
        this.emotionIndexMessageListener =
            function emotionIndexMessageListenerFn(msg) {

                var emotionIndex = parseInt(msg.args[0].value);

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
            };


        /***** Initialization Logic *****/


        // Attach OSC message received listeners
        OSC.subscribe('/eim/status/playback', this.playbackMessageListener);
        OSC.subscribe(
            '/eim/status/emotionIndex',
            this.emotionIndexMessageListener
        );
    }
]);
