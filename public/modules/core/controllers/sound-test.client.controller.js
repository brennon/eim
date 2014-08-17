'use strict';

angular.module('core').controller('SoundTestController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    var socket = io();

    socket.on('oscMessageSent', function(data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });

    var oscMessage = {
      oscType: 'message',
      address: '/eim/control',
      args: {
        type: 'string',
        value: ''
      }
    };

    oscMessage.args.value = 'startSoundTest';
    socket.emit('sendOSCMessage', oscMessage);

    $scope.stopSoundTest = function() {
      oscMessage.args.value = 'stopSoundTest';
      socket.emit('sendOSCMessage', oscMessage);
    };

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);