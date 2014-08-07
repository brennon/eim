'use strict';

var assert = require('assert');
var request = require('supertest');
var config = require('../../config/config');

describe('GET /', function() {
  it('responds with success', function(done) {
    request('localhost:' + config.port).get('/')
      .expect(200, done);
  });
});