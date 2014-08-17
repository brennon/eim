'use strict';

angular.module('core').controller('SignalTestController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    // Signal quality indicators
    $scope.edaQuality = 0;
    $scope.poxQuality = 0;

    // Setup socket
    var socket = io();

    // Log incoming OSC messages
    socket.on('oscMessageSent', function(data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });

    // Function to send start signal test message
    var sendStartSignalTestMessage = function() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/startSignalTest',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });
    };

    // Function to send stop signal test message
    var sendStopSignalTestMessage = function() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/stopSignalTest',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });
    };

    // Setup listener for incoming OSC messages
    socket.on('oscMessageReceived', function(data) {

      console.log('got OSC message');

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
      }
    });

    sendStartSignalTestMessage();
  }
]);