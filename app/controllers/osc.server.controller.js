'use strict';

var udp = require('dgram');
var osc = require('osc-min');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var oscSender, oscReceiver;

exports.outgoingPort = 7000;
exports.incomingPort = 7001;
exports.outgoingHost = 'localhost';

function buildLogMessageFromMessage(msg) {

    // Bail and log an error message if we didn't get an array
    if (!Array.isArray(msg) || msg.length === 0) {
        console.error('Malformed OSC error message received.', msg);
        return;
    }

    var level = msg[0].value.toUpperCase();

    var logMessageParts = msg.splice(1);

    var logMessage = '';

    for (var i = 0; i < logMessageParts.length; i++) {
        logMessage += logMessageParts[i].value;
        if (i !== logMessageParts.length - 1) {
            logMessage += ' ';
        }
    }

    if (level === 'INFO') {
        console.info('MaxMSP: ' + logMessage);
    } else if (level === 'ERROR') {
        console.error('MaxMSP: ' + logMessage);
    }
}

// Incoming message handler
function incomingMessageHandler(msg) {

    var oscFromBuffer = osc.fromBuffer(msg, false);

    // Check if this is a log message coming from Max
    if (oscFromBuffer.address === '/eim/status/log') {

        // Log the message
        buildLogMessageFromMessage(oscFromBuffer.args);

    } else {

        exports.eventEmitter.emit('oscMessageReceived', oscFromBuffer);
    }
}

// Create listener socket
function createOSCReceiver(callback) {
    setTimeout(function() {

        // Create socket and bind to port
        //noinspection JSUnresolvedFunction
        oscReceiver = udp.createSocket('udp4');
        oscReceiver.bind(exports.incomingPort, function() {

            // Attach incoming message handler callback
            oscReceiver.on('message', incomingMessageHandler);

            if (typeof callback === 'function') {
                callback();
            }
        });
    }, 0);
}

// Socket management

// Close sockets
exports.closeSockets = function() {
    try {
        oscReceiver.close();
    } catch (e) {
    }

    try {
        oscSender.close();
    } catch (e) {
    }
};

// Main initialization
exports.init = function(callback) {
    setTimeout(function createSocket() {

        // Try to close the sockets
        try {
            exports.init.closeSockets();
        } catch (e) {
        }

        // Open outgoing socket
        //noinspection JSUnresolvedFunction
        oscSender = udp.createSocket('udp4');

        // Open incoming socket
        createOSCReceiver(callback);

    }, 0);
};

// Consumers of this module can listen here for OSC-related events
exports.eventEmitter = new EventEmitter();

// Send an OSC message that meets osc-min's message definition over the
// outgoing socket
exports.sendJSONMessage = function(data, callback) {

    function sendMessage() {

        var buffer = osc.toBuffer(data);

        oscSender.send(
            buffer,
            0,
            buffer.length,
            exports.outgoingPort,
            exports.outgoingHost,
            callback
        );

        console.info('Sent OSC message.', data);
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

    exports.sendJSONMessage(message, function() {
        res.json(200, {sentMessage: message});
    });
};