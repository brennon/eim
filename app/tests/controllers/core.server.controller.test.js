/**
 * Created by Brennon Bortz on 8/6/14.
 */

'use strict';

// Config module
var config = require('../../../config/config');

// Testing tools
var request = require('supertest');
var should = require('chai').should();

describe('Core Controller Tests', function() {

  describe('sessions', function() {

    var agent = request.agent('localhost:' + config.port);
    var cookieA, cookieB;

    it('should be in use', function(done) {
      agent.get('/').expect('set-cookie', /connect\.sid.*/).end(function(err, res) {
        if (err) {
            return done(err);
        }
        cookieA = res.header['set-cookie'];
        done();
      });
    });

    it('should be reset on any visit to the index', function(done) {
      agent.get('/').expect('set-cookie', /connect\.sid.*/).end(function(err, res) {
        if (err) {
            return done(err);
        }
        cookieB = res.header['set-cookie'];
        cookieA.should.not.equal(cookieB);
        done();
      });
    });
  });
});
