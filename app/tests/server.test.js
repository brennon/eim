/**
 * Created by brennon on 9/29/15.
 */

'use strict';

/**
 * Server
  */
var server = require('../../server');
var app;

/**
 * Helper modules
 */
var config = require('../../config/config');

/**
 * Testing tools
 */
var request = require('supertest');
var should = require('chai').should();

describe('Custom configuration', function() {
    it('should be available', function() {

        // Ensure that the config object includes a customConfiguration property
        config.customConfiguration.should.not.equal(undefined);
    });
});
