'use strict';

var dgram = require('dgram');
var osc = require('osc-min');

/* jshint ignore:start */
var sinon = require('sinon');
/* jshint ignore:end */

var should = require('should');
var controller = require('../../controllers/osc.server.controller.js');
var path = require('path');

describe('OSCController', function() {

  //it('should set the outgoing port', function() {
  //  controller.outgoingPort.should.be(7000);
  //});
  //
  //it('should set the outgoing host', function() {
  //  controller.outgoingHost.should.be('127.0.0.1');
  //});
  //
  //it('should set the incoming port', function() {
  //  controller.incomingPort.should.be(7001);
  //});
  //
  //describe('#init', function() {
  //
  //  it('should open a new pair of sockets', function(done) {
  //    var spy = sinon.spy(dgram, 'createSocket');
  //
  //    controller.init(function() {
  //      spy.calledTwice.should.equal(true);
  //
  //      // Restore original method after spying on it
  //      dgram.createSocket.restore();
  //      done();
  //    });
  //  });
  //});
  //
  //describe('#sendJSONMessage', function() {
  //
  //  var message = {
  //    oscType: 'message',
  //    address: '/address/pattern',
  //    args: [{
  //      type: 'string',
  //      value: 'howdy'
  //    }]
  //  };
  //
  //  it('should ensure that the socket has been initialized', function(done) {
  //
  //    // Need to remove the cached module to ensure that the socket is undefined
  //    delete require.cache[require.resolve('../../controllers/osc.server.controller.js')];
  //    controller = require('../../controllers/osc.server.controller.js');
  //    var spy = sinon.spy(dgram, 'createSocket');
  //    controller.sendJSONMessage(message, function() {
  //      spy.calledWith('udp4').should.equal(true);
  //
  //      // Restore original method after spying on it
  //      dgram.createSocket.restore();
  //      done();
  //    });
  //  });
  //
  //  it('should format the message using osc-min', function(done) {
  //    var spy = sinon.spy(osc, 'toBuffer');
  //    controller.sendJSONMessage(message, function() {
  //      spy.calledWith(message).should.equal(true);
  //      osc.toBuffer.restore();
  //      done();
  //    });
  //  });
  //
  //  it('should send the message via the outgoing port', function(done) {
  //
  //    // Setup a simple UDP listener
  //    var listener = dgram.createSocket('udp4');
  //
  //    listener.bind(controller.outgoingPort, function afterBindCallback() {
  //      listener.on('message', function onMessageCallback(msg, rinfo) {
  //        listener.close();
  //        var receivedMessage = osc.fromBuffer(msg);
  //        receivedMessage.should.eql(message);
  //        done();
  //      });
  //
  //      controller.sendJSONMessage(message);
  //    });
  //  });
  //});
});