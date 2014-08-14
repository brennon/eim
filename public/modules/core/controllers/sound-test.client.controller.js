'use strict';

angular.module('core').controller('SoundTestController', ['$scope', '$http',
  function($scope, $http) {
//    $scope.trialDataJson = function() {
//      return TrialData.toJson();
//    }
//    var io = io();
//    console.log(io);

    var s = io();

    s.on('oscMessageSent', function(data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });

    var startSoundTestOSCMessage = {
      oscType: 'message',
      address: '/eim/control',
      args: {
        type: 'string',
        value: 'startSoundTest'
      }
    };

    var stopSoundTestOSCMessage = {
      oscType: 'message',
      address: '/eim/control',
      args: {
        type: 'string',
        value: 'stopSoundTest'
      }
    };

    s.emit('sendOSCMessage', startSoundTestOSCMessage);

    $scope.stopSoundTest = function() {
      s.emit('sendOSCMessage', stopSoundTestOSCMessage);
    };
  }
]);