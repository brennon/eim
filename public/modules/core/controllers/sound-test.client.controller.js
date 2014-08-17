'use strict';

angular.module('core').controller('SoundTestController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    var socket = io();

    socket.on('oscMessageSent', function(data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });

    socket.emit('sendOSCMessage', {
      oscType: 'message',
      address: '/eim/control/startSoundTest',
      args: {
        type: 'string',
        value: TrialData.data.metadata.session_number
      }
    });

    $scope.stopSoundTest = function() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/stopSoundTest',
        args: {
          type: 'string',
          value: TrialData.data.metadata.session_number
        }
      });
    };

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);