'use strict';

/**
 * Module dependencies.
 */

var osc = require('./osc.server.controller.js');
var util = require('util');
var io;

module.exports = function socketModule(http) {

  // Require Socket.IO and start listening
  io = require('socket.io')(http);

  // Logging function for incoming events
  function logEventReceived(event, data) {
    console.log(event + ' event received from client with data: ' + util.inspect(data));
  }

  // Logging function for emitted events
  function logEventEmitted(event, data) {
    console.log(event + ' event emitted with data: ' + util.inspect(data));
  }

  // Setup event handlers
  io.on('connection', function(socket) {

    // Attach sendOSCMessage event handler
    socket.on('sendOSCMessage', function(data) {
      logEventReceived('sendOSCMessage', data);

      // Send OSC message
      osc.sendJSONMessage(data, function() {
        socket.emit('oscMessageSent', data);
        logEventEmitted('oscMessageSent', data);
      });
    });

  });
};