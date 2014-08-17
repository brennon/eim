'use strict';

angular.module('core').controller('SignalTestController', ['$scope',
  function($scope) {


    var oscMessage = {
      oscType: 'message',
      address: '/eim/control',
      args: {
        type: 'string',
        value: null
      }
    };

    // Setup and send start test message
    oscMessage.args.value = 'startSignalTest';
    s.emit('sendOSCMessage', oscMessage);

    // Setup signal status listeners

  }
]);