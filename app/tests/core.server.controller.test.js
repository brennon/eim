/**
 * Created by brennon on 8/6/14.
 */

'use strict';

//var assert = require('should');
var request = require('supertest');
var config = require('../../config/config');
var util = require('util');

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
        if (cookieA === cookieB) throw new Error('session was not regenerated');
        done();
      });
    });
  });
});
