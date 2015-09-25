'use strict';

/**
 * Module dependencies.
 */
var osc = require('./osc.server.controller.js');
var util = require('util');

/**
 * OSC message flow:
 *
 * Outgoing message:
 *
 * 1. Consumer of socket module emits 'sendOSCMessage' on socket
 * 2. Socket module sends message
 * 3. On callback, socket emits 'oscMessageSent' event
 *
 * Incoming message:
 *
 * 1. Socket module listens for 'oscMessageReceived' events from OSC module
 * 2. OSC module receives incoming message
 * 3. OSC module emits 'oscMessageReceived' event with parsed message data
 * 4. Socket module emits its own 'oscMessageReceived' event with the same data
 */

var io;

module.exports = function socketModule(http) {

    // Require Socket.IO and start listening
    io = require('socket.io')(http);

    // Logging function for incoming events
    function logEventReceived(event, data) {
        console.log(event + ' event received from client with data: ' + data);
    }

    // Setup event handlers
    io.on('connection', function(socket) {

        // Attach sendOSCMessage event handler
        socket.on('sendOSCMessage', function(data) {
            logEventReceived('sendOSCMessage', data);

            // Send OSC message
            osc.sendJSONMessage(data, function() {
                socket.emit('oscMessageSent', data);
            });
        });

        // Listen for OSC module's 'oscMessageReceived' events
        osc.eventEmitter.on('oscMessageReceived', function(data) {

            // Just pass the data on to the socket
            socket.emit('oscMessageReceived', data);
        });
    });
};