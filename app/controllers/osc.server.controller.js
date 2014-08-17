'use strict';

// TODO: Restructure module to return object

var dgram = require('dgram');
var osc = require('osc-min');
var EventEmitter = require('events').EventEmitter;

var oscSender, oscReceiver;

exports.outgoingPort = 7000;
exports.incomingPort = 7001;
exports.outgoingHost = 'localhost';

// Main initialization
exports.init = function(callback) {
  setTimeout(function createSocket() {

    // Open outgoing socket
    oscSender = dgram.createSocket('udp4');

    // Open incoming socket
    createOSCReceiver(callback);

  }, 0);
};

// Consumers of this module can listen here for OSC-related events
exports.eventEmitter = new EventEmitter();

// Incoming message handler
function incomingMessageHandler(msg, rinfo) {
  var oscFromBuffer = osc.fromBuffer(msg, false);

  // Emit incoming message event with data
  exports.eventEmitter.emit('oscMessageReceived', oscFromBuffer);
};

// Create listener socket
function createOSCReceiver(callback) {
  setTimeout(function() {

    // Create socket and bind to port
    oscReceiver = dgram.createSocket('udp4');
    oscReceiver.bind(exports.incomingPort, function() {

      // Attach incoming message handler callback
      oscReceiver.on('message', incomingMessageHandler);

      if (typeof callback === 'function') {
        callback();
      };
    })
  }, 0);
}

// Send an OSC message that meets osc-min's message definition over the outgoing socket
exports.sendJSONMessage = function(data, callback) {

  function sendMessage() {
    var buffer = osc.toBuffer(data);

    oscSender.send(buffer, 0, buffer.length, exports.outgoingPort, exports.outgoingHost, callback);
  }

  // If outgoing port is not yet open, open it
  if (!oscSender) {
    this.init(sendMessage);
  } else {
    sendMessage();
  }
};

// Expose OSC message send on the API
exports.sendMessage = function(req, res) {
  var message = {
    oscType: 'message',
    address: '/eim/control',
    args: {
      type: 'string',
      value: req.params.message
    }
  };

  exports.sendJSONMessage({
    oscType: 'message',
    address: '/eim/control',
    args: {
      type: 'string',
      value: req.params.message
    }
  }, function() {
    res.json(200, { sentMessage: message });
  });
};