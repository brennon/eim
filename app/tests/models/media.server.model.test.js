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

      function shouldRequireProperty(propertyName, validDocument, done) {
        var oldValue = validDocument[propertyName];
        delete validDocument[propertyName];
        var invalidInstance = new Media(validDocument);
        validDocument[propertyName] = oldValue;
        invalidInstance.save(function(err) {
          should.exist(err);
          if (typeof done === 'function') {
            done();
          }
        });
      }

      function shouldRequireNonemptyProperty(propertyName, validDocument, done) {
        var oldValue = validDocument[propertyName];
        validDocument[propertyName] = null;
        var invalidInstance = new Media(validDocument);
        validDocument[propertyName] = oldValue;
        return invalidInstance.save(function (err) {
          should.exist(err);
          if (typeof done === 'function') {
            done();
          }
        });
      }

      it('should require a type property', function(done) {
        shouldRequireProperty('type', validMediaDoc, done);
      });

      it('should require a non-empty type property', function (done) {
        shouldRequireNonemptyProperty('type', validMediaDoc, done);
      });

      it('should require an artist property', function (done) {
        shouldRequireProperty('artist', validMediaDoc, done);
      });

      it('should require a non-empty artist property', function (done) {
        shouldRequireNonemptyProperty('artist', validMediaDoc, done);
      });

      it('should require a title property', function(done) {
        shouldRequireProperty('title', validMediaDoc, done);
      });

      it('should require a non-empty title property', function (done) {
        shouldRequireNonemptyProperty('title', validMediaDoc, done);
      });

      it('should require a label property', function(done) {
        shouldRequireProperty('label', validMediaDoc, done);
      });

      it('should require a non-empty label property', function (done) {
        shouldRequireNonemptyProperty('label', validMediaDoc, done);
      });
    });
  });

  afterEach(function (done) {
    Media.remove().exec();

    done();
  });
});