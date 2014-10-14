'use strict';

// TODO: Address OSC error when message sent without session ID
// TODO: Remove blackout when returning home
// TODO: Use different button colors for Playback and Continue
// TODO: Find a better way to listen for socket messages and clean up listeners

angular.module('core').controller('MediaPlaybackController', ['$scope', 'TrialData', '$state', 'ExperimentManager',
  function ($scope, TrialData, $state, ExperimentManager) {

    // Bind $scope.advanceSlide to ExperimentManager functionality
    $scope.advanceSlide = ExperimentManager.advanceSlide;

    /* global io */
    var socket = io();

    // State to control button behavior
    $scope.currentButtonLabel = 'Begin Playback';
    $scope.mediaHasPlayed = false;

    // Send media playback message to Max
    $scope.startMediaPlayback = function () {

      var mediaIndex = TrialData.data.state.mediaPlayCount;
      var mediaLabel = TrialData.data.media[mediaIndex];

      socket.emit('sendOSCMessage', {
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
    };

    $scope.trialDataJson = function () {
      return TrialData.toJson();
    };

    /*
    // Determine next state and send the user there
    $scope.gotoNextState = function () {
      if (!$scope.mediaHasPlayed) {
        $scope.startMediaPlayback();
      } else if (TrialData.data.state.mediaPlayCount >= TrialData.data.media.length) {
        $state.go('home');
      } else if (TrialData.data.state.mediaPlayCount !== TrialData.data.media.length) {
        $state.go('media-playback', {}, {reload: true});
      }
    };
    */

    // Setup listener for incoming OSC messages
    function oscMessageReceivedListener(data) {

      console.log('got message');

      // If it was a media playback message
      if (data.address === '/eim/status/playback') {

        console.log('got playback message');

        // If it was a start message
        if (parseInt(data.args[0].value) === 1) {
          console.log('got start message');

          // Fade out screen
          $scope.hideBody();

          // Otherwise, if it was a stop message
        } else if (parseInt(data.args[0].value) === 0) {

          console.log('got stop message');

          // Fade in screen
          $scope.showBody();

          if (!$scope.mediaHasPlayed) {

            // Increment media play count
            TrialData.data.state.mediaPlayCount++;

            // Update state
            $scope.$apply(function() {
              $scope.currentButtonLabel = 'Continue';
              $scope.mediaHasPlayed = true;
            });
          }
        }
      }

      console.log('currentButtonLabel: ' + $scope.currentButtonLabel);
      console.log('mediaHasPlayed: ' + $scope.mediaHasPlayed);
    }

    // Attach OSC message received listener
    socket.on('oscMessageReceived', oscMessageReceivedListener);

    // Send a message to stop media playback when this controller is destroyed
    // Also, remove OSC message event listeners
    $scope.$on('$destroy', function stopMediaPlayback() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/stopMedia',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });

      socket.removeListener('oscMessageReceived', oscMessageReceivedListener);
    });
  }
]);