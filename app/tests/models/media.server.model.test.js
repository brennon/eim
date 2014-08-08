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
      type: 'audio'
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

  describe('Schema', function () {

    describe('validations', function () {

      var validMediaDoc, invalidMedia;

      beforeEach(function(done) {
        validMediaDoc = {
          type: 'audio'
        };
        done();
      });

      it('should require a type property', function (done) {
        delete validMediaDoc.type;
        invalidMedia = new Media(validMediaDoc);
        return invalidMedia.save(function (err) {
          should.exist(err);
          done();
        });
      });

      it('should require a non-empty type property', function (done) {
        validMediaDoc.type = '';
        invalidMedia = new Media(validMediaDoc);
        return invalidMedia.save(function (err) {
          should.exist(err);
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    Media.remove().exec();

    done();
  });
});