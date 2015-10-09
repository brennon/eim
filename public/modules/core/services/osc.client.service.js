/**
 * Created by brennon on 10/8/15.
 */

'use strict';

/**
 * The `OSC` service exposes functionality for listening to incoming messages
 * from the server and sending outgoing messages to the server.
 *
 * @class Angular.OSC
 * @memberof Angular
 */

angular.module('core').factory('OSC', [
    '$log',
    'SocketIOService',
    function($log, SocketIOService) {

        // This service should:
        //  - Listen for all incoming OSC messages from the socket
        //  - Allow consumers to subscribe to receive messages by address
        //  - Forwarded messages to subscribed consumers
        //  - Log incoming messages for which no consumer is subscribed

        $log.debug('Instantiating OSC service.');

        var returnObject = {

            /**
             * Handles OSC messages received over socket.io. These messages are
             * then passed on to any subscribers to the message address.
             * Messages received for which there are no subscribers are logged
             * to the console.
             *
             * @function incomingMessageHandler
             * @param {{}} message Received OSC message
             * @instance
             * @memberof Angular.OSC
             * @return {undefined}
             */
            incomingMessageHandler: function incomingMessageHandlerFn(message) {
                var address = message.address;

                if (returnObject.listeners.hasOwnProperty(address)) {
                    var handlers = returnObject.listeners[address];
                    for (var i = 0; i < handlers.length; i++) {
                        handlers[i](message);
                    }
                } else {
                    $log.info('Unhandled OSC message.', message);
                }
            },

            /**
             * Callback that will be called when a message is received for a
             * specified address.
             *
             * @callback OSCSubscriberCallback
             * @memberof Angular.OSC
             * @param {{}} message The OSC message that was received
             */

            /**
             * Subscribe to receive OSC messages for a particular address.
             *
             * @function subscribe
             * @param {string} address The address of messages for which the
             * caller would like to subscribe
             * @param {Angular.OSC.OSCSubscriberCallback} callback The callback
             * to be called when messages with the address in `address` are
             * received
             * @instance
             * @memberof Angular.OSC
             * @return {undefined}
             */
            subscribe: function subscribeFn(address, callback) {

                if (address === undefined || callback === undefined) {
                    return $log.error('You must specify both an address and ' +
                        'a callback to subscribe.');
                }

                if (typeof address !== 'string') {
                    return $log.error('Address must be a string.');
                }

                if (typeof callback !== 'function') {
                    return $log.error('Callback must be a function.');
                }

                $log.debug('Attaching listener for incoming OSC messages to ' +
                    'address: ' + address);

                if (!this.listeners.hasOwnProperty(address)) {
                    this.listeners[address] = [];
                }

                this.listeners[address].push(callback);
            },

            /**
             * Stop receiving OSC messages with a particular address.
             *
             * @function unsubscribe
             * @instance
             * @memberof Angular.OSC
             * @param {string} address The address of messages for which the
             * caller would like to unsubscribe
             * @param {Angular.OSC.OSCSubscriberCallback} callback The callback
             * that was passed with the original call to Angular.OSC#subscribe}
             * @returns {undefined}
             */
            unsubscribe: function unsubscribeFn(address, callback) {

                if (address === undefined || callback === undefined) {
                    return $log.error('You must specify both an address and ' +
                        'a callback to unsubscribe.');
                }

                if (typeof address !== 'string') {
                    return $log.error('Address must be a string.');
                }

                if (!this.listeners.hasOwnProperty(address) ||
                    this.listeners[address].length === 0) {

                    return $log.error('There are no subscribers for OSC ' +
                        'messages to address: \'' + address + '\'');
                }

                var index = this.listeners[address].indexOf(callback);

                if (index >= 0) {
                    this.listeners[address].splice(index, 1);
                }
            },

            send: function sendFn(message, callback) {
                SocketIOService.emit('sendOSCMessage', message, callback);
            },

            listeners: {}
        };

        // Listen for all oscMessageReceived events
        SocketIOService.on(
            'oscMessageReceived',
            returnObject.incomingMessageHandler
        );

        return returnObject;
    }
]);
