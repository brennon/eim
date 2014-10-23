'use strict';

angular.module('core').controller('SoundTestController', ['$scope', 'SocketIOService', 'TrialData',
  function($scope, SocketIOService, TrialData) {

    // Send a message to Max to start the sound test
    SocketIOService.emit('sendOSCMessage', {
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
      SocketIOService.emit('sendOSCMessage', {
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

    $scope.destroyed = false;

    // Send stop sound test message when controller is destroyed
    $scope.$on('$destroy', function() {
      $scope.stopSoundTest();
    });
  }
]);