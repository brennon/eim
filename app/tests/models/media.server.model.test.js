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
      type: 'audio',
      artist: 'The Verve'
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

  describe('Schema', function() {

    describe('validations', function() {

      var validMediaDoc, invalidMedia;

      beforeEach(function(done) {
        validMediaDoc = {
          type: 'audio',
          artist: 'The Verve'
        };
        done();
      });

      function shouldRequireProperty(propertyName, done) {
        delete validMediaDoc[propertyName];
        invalidMedia = new Media(validMediaDoc);
        invalidMedia.save(function(err) {
          should.exist(err);
          if (typeof done === 'function') {
            done();
          }
        });
      }

      function shouldRequireNonemptyProperty(propertyName, done) {
        validMediaDoc[propertyName] = null;
        invalidMedia = new Media(validMediaDoc);
        return invalidMedia.save(function (err) {
          should.exist(err);
          if (typeof done === 'function') {
            done();
          }
        });
      }

      it('should require a type property', function(done) {
        shouldRequireProperty('type', done);
      });

      it('should require a non-empty type property', function (done) {
        shouldRequireNonemptyProperty('type', done);
      });

      it('should require an artist property', function (done) {
        shouldRequireProperty('artist', done);
      });

      it('should require a non-empty artist property', function (done) {
        shouldRequireNonemptyProperty('artist', done);
      });
    });
  });

  afterEach(function (done) {
    Media.remove().exec();

    done();
  });
});