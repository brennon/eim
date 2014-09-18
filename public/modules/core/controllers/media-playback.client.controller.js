'use strict';

// TODO: Address OSC error when message sent without session ID
// TODO: Remove blackout when returning home
// TODO: Use different button colors for Playback and Continue
// TODO: Find a better way to listen for socket messages and clean up listeners

angular.module('core').controller('MediaPlaybackController', ['$scope', 'TrialData', '$state',
  function ($scope, TrialData, $state) {

    /* global io */
    var socket = io();

    $scope.currentButtonLabel = 'Begin Playback';
    $scope.mediaHasPlayed = false;

    // Log incoming OSC messages
    function oscMessageSentListener(data) {
      console.log('media-playback.client.controller.js: oscMessageSent');
      console.log('socket "oscMessageSent" event received with data: ' + data);
    }
    socket.on('oscMessageSent', oscMessageSentListener);

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
            value: mediaLabel
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

    // Determine next state and send the user there
    $scope.gotoNextState = function () {
      if (!$scope.mediaHasPlayed) {
        console.log('media has not played');
        $scope.startMediaPlayback();
      } else if (TrialData.data.state.mediaPlayCount >= TrialData.data.media.length) {
        console.log('all media have played');
        $state.go('home');
      } else if (TrialData.data.state.mediaPlayCount !== TrialData.data.media.length) {
        console.log('more media remain');
        $state.go('media-playback', {}, {reload: true});
      }
    };

    // Send a message to stop media playback when this controller is destroyed
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
      socket.removeListener('oscMessageSent', oscMessageSentListener);
    });

    /**
     * Incoming Max messages
     */

    // Setup listener for incoming OSC messages
    function oscMessageReceivedListener(data) {
      console.log('media-playback.client.controller.js: oscMessageReceived');
      // If it was a media playback message
      if (data.address === '/eim/status/playback') {

        console.log('was playback message');

        // If it was a start message
        if (parseInt(data.args[0].value) === 1) {

          console.log('was start');

          // Fade out screen
          $scope.hideBody();

          // Otherwise, if it was a stop message
        } else if (parseInt(data.args[0].value) === 0) {

          console.log('was stop');

          // Fade in screen
          $scope.showBody();

          if (!$scope.mediaHasPlayed) {
            // Increment media play count
            TrialData.data.state.mediaPlayCount++;

            $scope.currentButtoneLabel = 'Continue';
            $scope.mediaHasPlayed = true;
          }
        }
      }
    }
    socket.on('oscMessageReceived', oscMessageReceivedListener);
  }
]);