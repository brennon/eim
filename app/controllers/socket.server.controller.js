'use strict';

/**
 * Socket Controller module
 *
 * This module provides functionality for allowing clients to send and
 * receive [Open Sound Control](http://opensoundcontrol.org/) (OSC) messages
 * through a [socket.io](http://socket.io/) connection.
 *
 * In general, the OSC message flow is as follows:
 *
 * - Outgoing messages:
 *
 *  1. A client connects to the server over socket.io
 *  2. Client emits the 'sendOSCMessage' event
 *  2. SocketServerController module sends message
 *  3. After sending the message, SocketServerController emits the
 *  'oscMessageSent' event on the client socket
 *
 * - Incoming messages:
 *
 *  1. SocketServerController module listens for `oscMessageReceived` events
 *  emitted by the {@link Node.module:OSCServerController|OSCServerController}
 *  module
 *  2. SocketServerController module emits its own
 *  `oscMessageReceived` event on client sockets with the same data
 *
 * @module {{}} Node.SocketServerController
 * @memberof Node
 */

// Module dependencies
var osc = require('./osc.server.controller.js');
var util = require('util');

var io;

// Logging function for incoming events
function logEventReceived(event, data) {
    console.log(event + ' event received from client.', data);
}

/**
 * Initializes the module. Once initialized, clients that connect over
 * socket.io receive the messages this module emits, as described above. The
 * server then also listens on each client connection for OSC messages to be
 * sent using the {@link Node.module:OSCServerController|OSCServerController}
 * module, also as described above.
 *
 * @param {http.Server} httpServer A Node.js HTTP server
 * @return {undefined}
 */
exports.init = function(httpServer) {

    // Require Socket.IO and start listening
    io = require('socket.io')(httpServer);

    // Setup event handlers
    io.on('connection', function(socket) {

        // Attach sendOSCMessage event handler
        socket.on('sendOSCMessage', function(data) {

            logEventReceived('sendOSCMessage', data);

            // Send OSC message
            osc.sendJSONMessage(data, function() {

                /**
                 * This event is fired when the module sends an OSC message
                 * using the
                 * {@link Node.module:OSCServerController|OSCServerController}
                 * module.
                 *
                 * The object sent with this event is a JavaScript object
                 * representation of the OSC message.
                 *
                 * @event oscMessageSent
                 * @type {{}}
                 */
                socket.emit('oscMessageSent', data);
            });
        });

        // Listen for OSC module's 'oscMessageReceived' events
        osc.eventEmitter.on('oscMessageReceived', function(data) {

            /**
             * This event is fired when the module receives an OSC message from
             * the {@link Node.module:OSCServerController|OSCServerController}
             * module.
             *
             * The object sent with this event is a JavaScript object
             * representation of the OSC message.
             *
             * @event oscMessageReceived
             * @type {{}}
             */

            // Just pass the data on to the socket
            socket.emit('oscMessageReceived', data);
        });
    });
};

