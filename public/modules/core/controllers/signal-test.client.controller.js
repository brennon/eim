'use strict';

// TODO: Watch for and log sensor issues
// TODO: In the event of sensor issues, still allow user to advance after delay

angular.module('core').controller('SignalTestController', ['$scope', 'TrialData',
  function($scope, TrialData) {

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

    // Setup socket
    /* global io */
    var socket = io();

    // Log incoming OSC messages
    socket.on('oscMessageSent', function(data) {
      console.log('signal-test.client.controller.js: oscMessageSent');
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });

    // Function to send start signal test message
    var sendStartSignalTestMessage = function() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/signalTest',
        args: [
          {
            type: 'integer',
            value: 1
          }
          ,
          {
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }
        ]
      });
    };

    // Function to send stop signal test message
    var sendStopSignalTestMessage = function() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/signalTest',
        args: [
          {
            type: 'integer',
            value: 0
          }
          ,
          {
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }
        ]
      });
    };

    // Function to send stop signal test message
    var sendStartSignalTestRecordingMessage = function() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/startTestRecording',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });
    };

    // Setup listener for incoming OSC messages
    socket.on('oscMessageReceived', function(data) {
      console.log('signal-test.client.controller.js: oscMessageReceived');

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
        $scope.$apply(function (){
          $scope.testRecordingComplete = true;
        });

        sendStopSignalTestMessage();
      }
    });

    // Send stop signal test message when controller is destroyed
    $scope.$on('$destroy', sendStopSignalTestMessage);

    sendStartSignalTestMessage();
  }
]);