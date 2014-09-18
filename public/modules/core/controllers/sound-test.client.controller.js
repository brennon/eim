'use strict';

angular.module('core').controller('SoundTestController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    /* global io */
    var socket = io();

    // Send a message to Max to start the sound test
    socket.emit('sendOSCMessage', {
      oscType: 'message',
      address: '/eim/control/soundTest',
      args: [
        {
          type: 'integer',
          value: 1
        },
        {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      ]
    });

    // Function to send a message to Max to stop the sound test
    $scope.stopSoundTest = function() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/soundTest',
        args: [
          {
            type: 'integer',
            value: 0
          },
          {
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }
        ]
      });
    };

    // Send stop sound test message when controller is destroyed
    $scope.$on('$destroy', $scope.stopSoundTest);

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);