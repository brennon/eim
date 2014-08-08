'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Media = mongoose.model('Media');

/**
 * Globals
 */
var media;

/**
 * Unit tests
 */
describe('Media Model Unit Tests:', function () {
  beforeEach(function (done) {

    media = new Media({
      // Add model fields
      // ...
    });

    media.save(function () {
      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return media.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Media.remove().exec();

    done();
  });
});