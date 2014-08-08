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
      artist: 'The Verve',
      title: 'Bittersweet Symphony',
      label: 'R004'
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
          artist: 'The Verve',
          title: 'Bittersweet Symphony',
          label: 'R004'
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

      it('should require a title property', function(done) {
        shouldRequireProperty('title', done);
      });

      it('should require a non-empty title property', function (done) {
        shouldRequireNonemptyProperty('title', done);
      });

      it('should require a label property', function(done) {
        shouldRequireProperty('label', done);
      });

      it('should require a non-empty label property', function (done) {
        shouldRequireNonemptyProperty('label', done);
      });
    });
  });

  afterEach(function (done) {
    Media.remove().exec();

    done();
  });
});