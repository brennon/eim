/**
 * Created by brennon on 8/6/14.
 */

'use strict';

var should = require('should');
var request = require('supertest');
var config = require('../../../config/config');
var oscController = require('../../controllers/osc.server.controller.js');
var sinon = require('sinon');

describe('CoreServerController', function() {

  describe('sessions', function() {
    var agent = request.agent('localhost:' + config.port);
    var cookieA, cookieB;

    it('should be in use', function(done) {
      agent.get('/').expect('set-cookie', /connect\.sid.*/).end(function(err, res) {
        if (err) return done(err);
        cookieA = res.header['set-cookie'];
        done();
      });
    });

    it('should be reset on any visit to the index', function(done) {
      agent.get('/').expect('set-cookie', /connect\.sid.*/).end(function(err, res) {
        if (err) return done(err);
        cookieB = res.header['set-cookie'];
        cookieA.should.not.equal(cookieB);
        done();
      });
    });
  });

  describe('Max interaction', function() {

    it('should reset Max on any visit to the index', function(done) {

      // Reset message that should be sent to Max
      var resetMessage = {
        oscType: 'message',
        address: '/eim/control',
        args: [{
          type: 'string',
          value: 'reset'
        }]
      };

      var spy = sinon.spy(oscController, 'sendJSONMessage');

      // Get index
      request('localhost:' + config.port).get('/').end(function(err, res) {
        if (err) {
          done(err);
        }

        spy.called.should.be.true;
        oscController.sendJSONMessage.restore();
        done();
      });
    });
  });
});
