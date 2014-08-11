'use strict';

var request = require('supertest');
var app = require('../../../server');
var config = require('../../../config/config')
var util = require('util');
var mongoose = require('mongoose');

describe('GET /api/experiment-schemas/random', function() {

//  // Ensure that we are connected to the database
//  // before running any tests
//  before(function (done) {
//
//    var connectedCallback = function () {
//      done();
//      mongoose.connection.removeListener('connected', connectedCallback);
//    };
//
//    if (mongoose.connection.readyState != 1) {
//
//      mongoose.connection.on('connected', connectedCallback);
//
//    } else {
//      connectedCallback();
//    }
//  });

  it('responds with success', function(done) {
    request('localhost:' + config.port).get('/api/experiment-schemas/random')
      .expect(200, done)
      .end(function(req, res) {
        console.log(res);
      });
  });
});