'use strict';

/**
 * Module dependencies.
 */
//var should = require('should'),
//  mongoose = require('mongoose'),
//  ExperimentSchema = mongoose.model('ExperimentSchema');

/**
 * Globals
 */
var experimentSchema;

/**
 * Unit tests
 */
//describe('ExperimentSchema Model Unit Tests:', function () {
//  beforeEach(function (done) {
//
//    experimentSchema = new ExperimentSchema({
//      trial_count: 3
//    });
//
//    experimentSchema.save(function() {
//      done();
//    });
//  });
//
//  describe('Method Save', function () {
//    it('should be able to save without problems', function (done) {
//      return experimentSchema.save(function (err) {
//        should.not.exist(err);
//        done();
//      });
//    });
//  });
//
//  describe('Schema', function() {
//
//    describe('validations', function() {
//
//      var validExperimentSchemaDoc;
//
//      beforeEach(function(done) {
//        validExperimentSchemaDoc = {
//          trial_count: 3
//        };
//        done();
//      });
//
//      function shouldRequireProperty(propertyName, validDocument, done) {
//        var oldValue = validDocument[propertyName];
//        delete validDocument[propertyName];
//        var invalidInstance = new ExperimentSchema(validDocument);
//        validDocument[propertyName] = oldValue;
//        invalidInstance.save(function(err) {
//          should.exist(err);
//          if (typeof done === 'function') {
//            done();
//          }
//        });
//      }
//
//      function shouldRequireNonemptyProperty(propertyName, validDocument, done) {
//        var oldValue = validDocument[propertyName];
//        validDocument[propertyName] = null;
//        var invalidInstance = new ExperimentSchema(validDocument);
//        validDocument[propertyName] = oldValue;
//        return invalidInstance.save(function (err) {
//          should.exist(err);
//          if (typeof done === 'function') {
//            done();
//          }
//        });
//      }
//
//      it('should require a type property', function(done) {
//        shouldRequireProperty('trial_count', validExperimentSchemaDoc, done);
//      });
//
//      it('should require a non-empty type property', function (done) {
//        shouldRequireNonemptyProperty('trial_count', validExperimentSchemaDoc, done);
//      });
//    });
//  });
//
//  afterEach(function (done) {
//    ExperimentSchema.remove().exec();
//    done();
//  });
//});