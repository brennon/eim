'use strict';

/**
 * OSC Controller module
 *
 * This module provides functionality for communication to and from the
 * server over [Open Sound Control](http://opensoundcontrol.org/).
 *
 * @module {{}} OSCServerController
 */

/*
  Helper modules
 */
var udp = require('dgram');
var osc = require('osc-min');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var oscSender, oscReceiver;

/**
 * The port over which OSC messages will be sent.
 *
 * @type {number}
 */
exports.outgoingPort = 7000;

/**
 * The port over which OSC messages will be received.
 *
 * @type {number}
 */
exports.incomingPort = 7001;

/**
 * The hostname of the host to which OSC messages will be sent.
 *
 * @type {string}
 */
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

/**
 * Close both the incoming socket and the outgoing socket.
 *
 * @return {undefined}
 */
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

/**
 * Initialize the module.
 *
 * This method first ensures that both sockets are closed, then opens each
 * socket on the ports specified in {@link
 * module:OSCServerController.outgoingPort|outgoingPort} and {@link
 * module:OSCServerController.incomingPort|incomingPort}.
 *
 * @param {function} callback Will be called after initialization is complete
 */
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

/**
 * This event is fired when the server receives an OSC message.
 *
 * The object sent with this event is a JavaScript object representation of
 * the OSC message.
 *
 * @event oscMessageReceived
 * @type {{}}
 */

/**
 * This `EventEmitter` emits OSC-related events. Consumers can listen here
 * to be notified when OSC messages are sent or received.
 *
 * @type {EventEmitter}
 * @fires oscMessageReceived
 */
exports.eventEmitter = new EventEmitter();

/**
 * Sends an object over OSC.
 *
 * The object to be sent must match the requirements for an OSC message or
 * bundle as specified by [osc-min](https://www.npmjs.com/package/osc-min/).
 * The message will be sent to the host in {@link
 * module:OSCServerController.outgoingHost|outgoingHost} on the port in {@link
 * module:OSCServerController.outgoingPort|outgoingPort}.
 *
 * @param {{}} data The object to be sent over OSC
 * @param {function} callback The function to be called after the message
 * has been sent
 * @return {undefined}
 */
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

/**
 * Sends an object from an `http.ClientRequest` params over OSC.
 *
 * The object to be sent must match the requirements for an OSC message or
 * bundle as specified by [osc-min](https://www.npmjs.com/package/osc-min/).
 * The message will be sent to the host in {@link
 * module:OSCServerController.outgoingHost|outgoingHost} on the port in {@link
 * module:OSCServerController.outgoingPort|outgoingPort}. The response
 * is augmented to include the message that was sent.
 *
 * @param {http.ClientRequest} req The client request
 * @param {http.ServerResponse} res The server response
 * @return {undefined}
 */
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