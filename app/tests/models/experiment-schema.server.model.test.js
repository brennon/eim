'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  ExperimentSchema = mongoose.model('ExperimentSchema');

/**
 * Globals
 */
var experimentSchema;

/**
 * Unit tests
 */
describe('Experiment schema Model Unit Tests:', function () {
  beforeEach(function (done) {

    experimentSchema = new ExperimentSchema({
      // Add model fields
      // ...
    });

    experimentSchema.save(function() {
      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return experimentSchema.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('Schema', function() {
  });

  afterEach(function (done) {
    ExperimentSchema.remove().exec();
    done();
  });
});