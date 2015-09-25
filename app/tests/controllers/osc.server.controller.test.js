'use strict';

// Testing tools
var should = require('chai').should();
var rewire = require('rewire');

/* jshint ignore:start */
var sinon = require('sinon');
/* jshint ignore:end */

// Helper modules
var dgram = require('dgram');
var osc = require('osc-min');

// Server
var server = require('../../../server');
var app;

// Module under test
var controller;

/* globals sinon */

describe('OSCController', function() {
    before(function(done) {
        server.then(function(startedApp) {
            app = startedApp;
            done();
        });
    });

    beforeEach(function() {
        try {
            controller.closeSockets();
        } catch (e) {
        }

        controller = rewire('../../controllers/osc.server.controller.js');
    });

    it('should set the outgoing port', function() {
        controller.outgoingPort.should.equal(7000);
    });

    it('should set the outgoing host', function() {
        controller.outgoingHost.should.equal('localhost');
    });

    it('should set the incoming port', function() {
        controller.incomingPort.should.equal(7001);
    });

    it('should configure an EventEmitter', function() {
        controller.eventEmitter.should.not.equal(undefined);
        controller.eventEmitter.constructor.name.should.equal('EventEmitter');
    });

    describe('#buildLogMessageFromMessage', function() {

        var originalError = console.error;
        var originalLog = console.log;
        var originalInfo = console.info;
        var errorSpy, logSpy, infoSpy;
        var buildLogMessageFromMessage;

        beforeEach(function() {
            buildLogMessageFromMessage = controller.__get__('buildLogMessageFromMessage');

            errorSpy = sinon.spy();
            logSpy = sinon.spy();
            infoSpy = sinon.spy();

            controller.__set__({
                console: {
                    error: errorSpy,
                    log: logSpy,
                    info: infoSpy
                }
            });
        });

        afterEach(function() {
            controller.__set__({
                console: {
                    error: originalError,
                    log: originalLog,
                    info: originalInfo
                }
            });
        });

        it('should only accept an array as its argument', function() {
            buildLogMessageFromMessage('not an array');

            errorSpy.calledOnce.should.equal(true);
            errorSpy.args[0][0].should.match(/Malformed OSC error message received.*/);
        });

        it('should log normal messages with console.info', function() {
            buildLogMessageFromMessage([{value: 'info'}, {}]);

            infoSpy.calledOnce.should.equal(true);
            infoSpy.args[0][0].should.match(/MaxMSP: /);
        });

        it('should log error messages with console.error', function() {
            buildLogMessageFromMessage([{value: 'error'}, {value: 'hi'}]);

            errorSpy.calledOnce.should.equal(true);
            errorSpy.args[0][0].should.match(/MaxMSP: /);
        });

        it('should build the log message', function() {
            buildLogMessageFromMessage([{value: 'error'}, {value: 'an error'}]);

            errorSpy.calledOnce.should.equal(true);
            errorSpy.args[0][0].should.match(/MaxMSP: an error/);
        });

        it('should concatenate multiple values', function() {
            buildLogMessageFromMessage([
                {value: 'error'},
                {value: 'an error'},
                {value: 'a second part'}
            ]);
            errorSpy.args[0][0].should.match(/MaxMSP: an error a second part/);
        });
    });

    describe('#createOSCReceiver', function() {
        var createOSCReceiver;

        beforeEach(function() {
            createOSCReceiver = controller.__get__('createOSCReceiver');
            controller.incomingPort = 9999;
        });

        it('should bind the socket to the incoming port and the correct callback', function(done) {

            createOSCReceiver();

            var originalIncomingMessageHandler = controller.__get__('incomingMessageHandler');
            var incomingMessageHandlerSpy = sinon.spy();
            controller.__set__({
                incomingMessageHandler: incomingMessageHandlerSpy
            });

            var buf;
            buf = osc.toBuffer({
                address: '/heartbeat',
                args: [12]
            });

            var socket = dgram.createSocket('udp4');
            socket.send(buf, 0, buf.length, controller.incomingPort, 'localhost');

            setTimeout(function() {
                incomingMessageHandlerSpy.calledOnce.should.equal(true);
                controller.__set__({
                    incomingMessageHandler: originalIncomingMessageHandler
                });
                socket.close();
                done();
            }, 50);
        });
    });

    describe('#incomingMessageHandler', function() {
        it('should send log messages from Max to the log', function() {

            // Spy on buildLogMessage...
            var buildSpy = sinon.spy();
            var revert = controller.__set__({
                buildLogMessageFromMessage: buildSpy
            });

            // Create an OSC buffer
            var buf;
            buf = osc.toBuffer({
                address: '/eim/status/log',
                args: [12]
            });

            // Send buffer to message handler
            var incomingMessageHandler = controller.__get__('incomingMessageHandler');
            incomingMessageHandler(buf);

            // Check expectations
            buildSpy.calledOnce.should.equal(true);

            //noinspection JSUnresolvedVariable
            buildSpy.args[0][0][0].should.deep.equal({type: 'float', value: 12});

            // Revert controller
            revert();
        });

        it('should emit an event for other messages', function(done) {

            // Listen for the right event
            controller.eventEmitter.on('oscMessageReceived', function() {
                done();
            });

            // Create an OSC buffer
            var buf;
            buf = osc.toBuffer({
                address: '/eim/status/starting',
                args: [12]
            });

            // Send buffer to message handler
            var incomingMessageHandler = controller.__get__('incomingMessageHandler');
            incomingMessageHandler(buf);
        });
    });

    describe('#closeSockets', function() {
        it('should close the incoming and outgoing sockets', function() {
            var outgoingSpy = sinon.spy();
            var incomingSpy = sinon.spy();

            var revert = controller.__set__({
                oscSender: {
                    close: outgoingSpy
                },
                oscReceiver: {
                    close: incomingSpy
                }
            });

            controller.closeSockets();

            outgoingSpy.calledOnce.should.equal(true);
            incomingSpy.calledOnce.should.equal(true);

            revert();
        });
    });

    describe('#init', function() {
        beforeEach(function() {
            controller.incomingPort = 9999;
        });

        it('should open a new pair of sockets', function(done) {
            controller.init(function() {
                controller.__get__('oscSender').constructor.name.should.equal('Socket');
                controller.__get__('oscReceiver').constructor.name.should.equal('Socket');
                done();
            });
        });
    });

    describe('#sendJSONMessage', function() {

        var message = {
            oscType: 'message',
            address: '/address/pattern',
            args: [{
                type: 'string',
                value: 'howdy'
            }]
        };

        beforeEach(function() {
            controller.__set__({
                console: {
                    log: function() {
                    },
                    info: function() {
                    }
                }
            });
            controller.incomingPort = 9999;
        });

        it('should ensure that the socket has been initialized', function(done) {

            var spy = sinon.spy();
            controller.init = spy;

            controller.sendJSONMessage(message);

            this.timeout(50);
            setTimeout(function() {
                spy.callCount.should.equal(1);
                done();
            }, 10);
        });

        it('should format the message using osc-min', function(done) {
            var oscMock = {
                toBuffer: function() {
                    revert();
                    done();
                    return 'a string';
                }
            };

            var revert = controller.__set__({
                osc: oscMock
            });

            controller.sendJSONMessage(message);
        });

        it('should send the message via the outgoing port', function(done) {

            // Setup a simple UDP listener
            var listener = dgram.createSocket('udp4');

            listener.bind(controller.outgoingPort, function afterBindCallback() {
                listener.on('message', function onMessageCallback(msg) {
                    listener.close();
                    var receivedMessage = osc.fromBuffer(msg);
                    receivedMessage.should.eql(message);
                    done();
                });

                controller.sendJSONMessage(message);
            });
        });
    });

    describe('message sending endpoint', function() {
        beforeEach(function() {
            controller.__set__({
                console: {
                    log: function() {
                    },
                    info: function() {
                    }
                }
            });
            controller.incomingPort = 9999;
        });

        it('should call sendJSONMessage with the message from the request parameters', function() {
            var request = {
                params: {
                    message: 'Boy, howdy!'
                }
            };

            var spy = sinon.spy(controller, 'sendJSONMessage');

            controller.sendMessage(request, {json: function() {}});

            spy.callCount.should.equal(1);

            var args = spy.args[0][0];

            //noinspection JSUnresolvedVariable
            args.should.deep.equal({
                oscType: 'message',
                address: '/eim/control',
                args: {
                    type: 'string',
                    value: 'Boy, howdy!'
                }
            });
        });
    });
});