'use strict';

// Module under test
var controller;

// Testing tools
var should = require('chai').should();
var rewire = require('rewire');

/* jshint ignore:start */
var sinon = require('sinon');
/* jshint ignore:end */

// Helper modules
var io = require('socket.io-client');

// Globals
var testServer;
var port = 8989;

// Server
var http = require('http');

describe('Socket Controller', function() {

    beforeEach(function() {

        //noinspection JSUnresolvedFunction
        testServer = http.createServer().listen(port);
        controller = rewire('../../controllers/socket.server.controller');
        controller.init(testServer);
    });

    afterEach(function() {
        testServer.close();
    });

    describe('logEventReceived()', function() {
        it('should output the event and data to the console', function() {

            // Mock the console
            var mockLog = sinon.spy();
            controller.__set__({
                console: {
                    log: mockLog
                }
            });

            // Get and call the method
            var fn = controller.__get__('logEventReceived');

            fn('foo', 'bar');

            // Check the spy
            mockLog.calledOnce.should.equal(true);

            var expectedRegex =
                /foo event received from client with data:\n'bar'/;
            mockLog.args[0][0].should.match(expectedRegex);
        });
    });

    describe('init()', function() {
        it('should require the socket.io library', function() {

            // Mock require
            controller.__set__('require', function(lib) {

                // Check required library
                lib.should.equal('socket.io');

                return function() {
                    return {
                        on: function() {}
                    };
                };
            });

            // Call init()
            controller.init();
        });

        it('should pass the server to the socket require call', function() {

            // Mock server
            var server = { foo: 'bar' };

            // Mock require
            controller.__set__('require', function() {
                return function(passedServer) {

                    // Check server that was passed
                    passedServer.should.equal(server);

                    return {
                        on: function() {}
                    };
                };
            });

            // Call init()
            controller.init(server);
        });

        it('should listen for the the connection event on the socket', function() {

            // Mock require
            controller.__set__('require', function() {
                return function() {
                    return {
                        on: function(event) {
                            event.should.equal('connection');
                        }
                    };
                };
            });

            // Call init()
            controller.init();
        });

        describe('sendOSCMessage listener', function() {
            var client, revert;

            beforeEach(function(done) {
                client = io.connect('http://0.0.0.0:' + port, {
                    reconnection: false,
                    multiplex: false,
                    'force new connection': true
                });

                client.on('connect', function() {
                    done();
                });
            });

            afterEach(function(done) {
                if (typeof revert === 'function') {
                    revert();
                }

                client.on('disconnect', function() {
                    done();
                });
                client.disconnect();
            });

            it('should log the event', function(done) {

                // Mock logger
                revert = controller.__set__('logEventReceived', function(event, data) {

                    // Check expectations
                    event.should.equal('sendOSCMessage');
                    data.should.equal('someData');

                    done();
                });

                // Emit message
                client.emit('sendOSCMessage', 'someData');
            });

            it('should send the JSON message', function(done) {

                // Mock OSC controller
                revert = controller.__set__('osc.sendJSONMessage', function(data) {

                        // Check that OSC message was sent
                        data.should.equal('someData');

                        done();
                    }
                );

                // Emit event
                client.emit('sendOSCMessage', 'someData');
            });

            it('should emit an oscMessageSent event', function(done) {

                // Listen for message sent event
                client.on('oscMessageSent', function() {
                    done();
                });

                // Emit sendOSCMessage event
                client.emit('sendOSCMessage', 'emit test');
            });
        });

        describe('oscMessageReceived listener', function() {
            var client, revert;

            beforeEach(function(done) {
                client = io.connect('http://0.0.0.0:' + port, {
                    reconnection: false,
                    multiplex: false,
                    'force new connection': true
                });

                client.on('connect', function() {
                    done();
                });
            });

            afterEach(function(done) {
                if (typeof revert === 'function') {
                    revert();
                }

                client.on('disconnect', function() {
                    done();
                });
                client.disconnect();
            });

            it('should be attached', function(done) {

                // Mock OSC controller
                revert = controller.__set__('osc.eventEmitter.on', function(event) {

                    // Check for the correct event
                    event.should.equal('oscMessageReceived');

                    done();
                });

                // Connect client
                io.connect('http://0.0.0.0:' + port, {
                    reconnection: false,
                    multiplex: false,
                    'force new connection': true
                });
            });

            it('should pass the message on to the socket', function(done) {

                // Listen for message sent event
                client.on('oscMessageReceived', function(data) {
                    data.should.equal('crazy good');
                    done();
                });

                // Emit the message
                var oscEmitter = controller.__get__('osc.eventEmitter');
                oscEmitter.emit('oscMessageReceived', 'crazy good');
            });
        });
    });
});
