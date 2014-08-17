'use strict';

angular.module('core').controller('StartController', ['$scope', '$http', '$timeout', 'TrialData',
  function($scope, $http, $timeout, TrialData) {

    /**
     * Controller sequence of events:
     *
     * 1. Reset TrialData
     * 2. Send message to reset experiment: /eim/control/reset
     * 2. Wait for message: /eim/status/resetComplete
     * 3. Generate a new session ID
     * 4. Store session ID in TrialData
     * 5. Request experiment setup from backend
     * 6. Wait for message: /eim/status/experimentReady
     * 7.
     */

    // Are all pieces of experiment ready to begin?
    $scope.maxReady = false;
    $scope.backendReady = false;
    $scope.experimentReady = function() {
      if ($scope.debugMode) {
        return true;
      } else {
        return $scope.maxReady && $scope.backendReady;
      }
    };

    // Reset TrialData
    TrialData.reset();

    // Setup socket
    var socket = io();

    // Generate new session identifier
    var sessionID = UUID.generate();
    TrialData.data.metadata.session_number = sessionID;

    // Setup OSC 'message sent' logger
    socket.on('oscMessageSent', function(data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });

    // Configure handlers for incoming OSC messages
    socket.on('oscMessageReceived', function(data) {

      // If we received the resetComplete message
      if (data.address === '/eim/status/resetComplete') {

        // Send experiment start message
        socket.emit('sendOSCMessage', {
          oscType: 'message',
          address: '/eim/control/startExperiment',
          args: {
            type: 'string',
            value: TrialData.data.metadata.session_number
          }
        });
      } else if (data.address === '/eim/status/experimentReady') {
        $scope.$apply(function() {
          $scope.maxReady = true;
        });
      }
    });

    $scope.stopSoundTest = function() {
      oscMessage.args.value = 'stopSoundTest';
      socket.emit('sendOSCMessage', oscMessage);
    };

    // Expose TrialData for debugging
    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };

    // Get a new experiment setup from the backend
    $http.get('/api/experiment-schemas/random')
      .success(function(data) {

        for (var i in data.media) {
          TrialData.data.media.push(data.media[i].label);
        }

        // Only proceed if we've got some media!
        if (data.media.length > 0) {
            $scope.backendReady = true;
        } else {
          throw new Error('No media was found in the fetched experiment schema');
          $scope.addGenericErrorAlert();
        }
      })
      .error(function(data) {
        $scope.addGenericErrorAlert();
        throw new Error('An experiment schema could not be fetched from the server');
      });

    // If we aren't ready to go after 10 seconds, throw an error
    $timeout(function() {
      if (!$scope.experimentReady()) {
        $scope.addGenericErrorAlert();
        throw new Error('The experiment was not setup after 10 seconds');
      }
    }, 10000);
  }
]);