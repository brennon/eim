'use strict';

angular.module('core').controller('StartController', ['$scope', '$http', '$timeout', 'TrialData',
  function($scope, $http, $timeout, TrialData) {

    // Are all pieces of experiment ready to begin?
    $scope.maxReady = false;
    $scope.backendReady = false;
    $scope.readyToAdvance = function() {
      if ($scope.debugMode) {
        return true;
      } else {
        return $scope.maxReady && $scope.backendReady;
      }
    };

    // Reset TrialData
    TrialData.reset();

    // Setup socket
    /* global io */
    var socket = io();

    // Generate new session identifier and store it in TrialData
    /* global UUID */
    var sessionID = UUID.generate();
    TrialData.data.metadata.session_number = sessionID;

    // Configure handler for incoming OSC messages
    var oscMessageReceivedListener = function(data) {
      console.log('start.client.controller.js: oscMessageReceived');

      // If we received the resetComplete message
      if (data.address === '/eim/status/experimentReady') {
        $scope.$apply(function() {
          $scope.maxReady = true;
        });
      }
    };

    // Attach handler for incoming OSC messages
    socket.on('oscMessageReceived', oscMessageReceivedListener);

    // Destroy handler for incoming OSC messages when $scope is destroyed
    $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
      socket.removeListener('oscMessageReceived', oscMessageReceivedListener);
    });

    // Get a new experiment setup from the backend
    $http.get('/api/experiment-schemas/random')
      .success(function(data) {

        // Send experiment start message
        socket.emit('sendOSCMessage', {
          oscType: 'message',
          address: '/eim/control/startExperiment',
          args: {
            type: 'string',
            value: TrialData.data.metadata.session_number
          }
        });

        // Add received media to TrialData
        for (var i in data.media) {
          TrialData.data.media.push(data.media[i].label);
        }

        // Only proceed if we've got some media!
        if (data.media.length > 0) {
            $scope.backendReady = true;
        } else {
          $scope.addGenericErrorAlert();
          throw new Error('No media was found in the fetched experiment schema');
        }
      })
      .error(function(data) {
        $scope.addGenericErrorAlert();
        throw new Error('An experiment schema could not be fetched from the server');
      });

    // If we aren't ready to go after 10 seconds, throw an error
    $timeout(function() {
      if (!$scope.readyToAdvance()) {
        $scope.addGenericErrorAlert();
        throw new Error('The experiment was not setup after 10 seconds');
      }
    }, 10000);
  }
]);