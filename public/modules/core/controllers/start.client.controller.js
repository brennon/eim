'use strict';

angular.module('core').controller('StartController', ['$scope', '$http', '$timeout', 'TrialData', 'ExperimentManager',
  function ($scope, $http, $timeout, TrialData, ExperimentManager) {

    // Setup socket
    /* global io */
    var socket = io();

    // Are all pieces of experiment ready to begin?
    $scope.maxReady = false;
    $scope.backendReady = false;
    $scope.readyToAdvance = function () {
      if ($scope.debugMode) {
        return true;
      } else {
        return $scope.maxReady && $scope.backendReady;
      }
    };

    // Configure handler for incoming OSC messages
    var oscMessageReceivedListener = function (data) {
      console.log('start.client.controller.js: oscMessageReceived');

      // If we received the resetComplete message
      if (data.address === '/eim/status/experimentReady') {
        $scope.$apply(function () {
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

    var sendExperimentStartMessage = function () {
        socket.emit('sendOSCMessage', {
          oscType: 'message',
          address: '/eim/control/startExperiment',
          args: {
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }
        });
    };

    // If we aren't ready to go after 10 seconds, throw an error
    $timeout(function () {
      if (!$scope.readyToAdvance()) {
        $scope.addGenericErrorAlert();
        throw new Error('The experiment was not setup after 10 seconds');
      }
    }, 10000);
  }
]);