/**
 * Created by brennon on 8/6/14.
 */

'use strict';

var should = require('should');
var request = require('supertest');
var config = require('../../../config/config');
var oscController = require('../../controllers/osc.server.controller.js');
var sinon = require('sinon');
var mongoose = require('mongoose');
var util = require('util');

describe('Core Controller Tests', function() {

  // Ensure that we are connected to the database
  // before running any tests
  before(function(done) {

    var connectedCallback = function() {
      done();
      mongoose.connection.removeListener('connected', connectedCallback);
    };

    if (mongoose.connection.readyState !== 1) {

      mongoose.connection.on('connected', connectedCallback);

    } else {
      connectedCallback();
    }
  });

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

      var jsonSpy = sinon.spy(oscController, 'sendJSONMessage');

      // Get index
      request('localhost:' + config.port).get('/').end(function(err) {
        if (err) {
          oscController.sendJSONMessage.restore();
          done(err);
        }

        jsonSpy.called.should.equal(true);
        oscController.sendJSONMessage.restore();
        done();
      });
    });
  });
});
