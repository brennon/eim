'use strict';

angular.module('core').controller('StartController', ['$scope', '$http', '$timeout', 'TrialData', 'ExperimentManager',
  function ($scope, $http, $timeout, TrialData, ExperimentManager) {

    // Setup socket
    /* global io */
    var socket = io();

    // Bind $scope.advanceSlide to ExperimentManager functionality
    $scope.advanceSlide = ExperimentManager.advanceSlide;

    // Ready to advance?
    $scope.readyToAdvance = function () {
      return $scope.maxReady || $scope.debugMode;
    };

    // Configure handler for incoming OSC messages
    var oscMessageReceivedListener = function (data) {

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

        $scope.maxReady = false;
        socket.emit('sendOSCMessage', {
          oscType: 'message',
          address: '/eim/control/startExperiment',
          args: {
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }
        });
    };

    sendExperimentStartMessage();

    // If we aren't ready to go after 10 seconds, throw an error
    $timeout(function () {
      if (!$scope.readyToAdvance) {
        $scope.addGenericErrorAlert();
        throw new Error('Max had not responded to startExperiment message after 10 seconds');
      }
    }, 10000);
  }
]);