'use strict';

angular.module('core').controller('Control MediaController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    /* global io */
    var socket = io();

    socket.on('oscMessageSent', function(data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });

    socket.emit('sendOSCMessage', {
      oscType: 'message',
      address: '/eim/control/startControlPlayback',
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