'use strict';

angular.module('core').controller('MediaPlaybackController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    /* global io */
    var socket = io();

    socket.on('oscMessageSent', function(data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });

    $scope.startMediaPlayback = function() {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/startMediaPlayback',
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