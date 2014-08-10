'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  ExperimentSchema;

/**
 * Globals
 */
var experimentSchema;

/**
 * Unit tests
 */
describe('ExperimentSchema Model Unit Tests:', function () {

  // Ensure that we are connected to the database
  // before running any tests
  before(function(done) {

    var connectedCallback = function() {
      ExperimentSchema = mongoose.model('ExperimentSchema');
      done();
      mongoose.connection.removeListener('connected', connectedCallback);
    };

    if (mongoose.connection.readyState != 1) {

      mongoose.connection.on('connected', connectedCallback);

    } else {
      connectedCallback();
    }
  });

  beforeEach(function (done) {

    experimentSchema = new ExperimentSchema({
      trialCount: 3
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

    describe('validations', function() {

      var validExperimentSchemaDoc;

      beforeEach(function(done) {
        validExperimentSchemaDoc = {
          trialCount: 3
        };
        done();
      });

      function shouldRequireProperty(propertyName, validDocument, done) {
        var oldValue = validDocument[propertyName];
        delete validDocument[propertyName];
        var invalidInstance = new ExperimentSchema(validDocument);
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
        var invalidInstance = new ExperimentSchema(validDocument);
        validDocument[propertyName] = oldValue;
        return invalidInstance.save(function (err) {
          should.exist(err);
          if (typeof done === 'function') {
            done();
          }
        });
      }

      it('should require a type property', function(done) {
        shouldRequireProperty('trialCount', validExperimentSchemaDoc, done);
      });

      it('should require a non-empty type property', function (done) {
        shouldRequireNonemptyProperty('trialCount', validExperimentSchemaDoc, done);
      });
    });
  });

  afterEach(function (done) {
    ExperimentSchema.remove().exec();
    done();
  });
});