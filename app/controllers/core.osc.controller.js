'use strict';

var dgram = require('dgram');
var osc = require('osc-min');

var oscSender, oscReceiver;

exports.outgoingPort = 7000;
exports.incomingPort = 7001;
exports.outgoingHost = 'localhost';

exports.init = function(callback) {
  setTimeout(function createSocket() {

    // Open outgoing and incoming sockets
    oscSender = dgram.createSocket('udp4');
    oscReceiver = dgram.createSocket('udp4');

    if (typeof callback === 'function') {
      callback();
    }
  }, 0);
};

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