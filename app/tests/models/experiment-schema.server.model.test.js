'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  util = require('util'),
  ExperimentSchema, Media;

/**
 * Globals
 */
var experimentSchema, mediaA;

/**
 * Unit tests
 */
describe('ExperimentSchema Model Unit Tests:', function () {

  // Ensure that we are connected to the database
  // before running any tests
  before(function(done) {

    var connectedCallback = function() {
      ExperimentSchema = mongoose.model('ExperimentSchema');
      Media = mongoose.model('Media');
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

    mediaA = new Media({
      type: 'audio',
        artist: 'The Verve',
      title: 'Bittersweet Symphony',
      label: 'R005'
    });

    mediaA.save(function() {
      experimentSchema = new ExperimentSchema({
        trialCount: 3,
        mediaPool: [mediaA._id]
      });

      experimentSchema.save(function() {
        done();
      });
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
          trialCount: 3,
          mediaPool: [mediaA.id]
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

      it('should require a mediaPool property', function(done) {
        shouldRequireProperty('mediaPool', validExperimentSchemaDoc, done);
      });

      it('should require a non-empty mediaPool property', function (done) {
        shouldRequireNonemptyProperty('mediaPool', validExperimentSchemaDoc, done);
      });

      it('should reference Media objects through the mediaPool property', function(done) {
        var Experiment = mongoose.model('ExperimentSchema');
        Experiment.findOne({}).populate('mediaPool').exec(function(err, person) {
          if (err) {
            done(err);
          } else {
            person.mediaPool[0].title.should.equal(mediaA.title);
            done();
          }
        });
      });
    });
  });

  describe('#build', function() {

    var firstMedia, secondMedia, thirdMedia, fullExperimentSchema;

    before(function(done) {
      firstMedia = new Media({
        type: 'audio',
        artist: 'The Verve',
        title: 'Bittersweet Symphony',
        label: 'R005'
      });

      secondMedia = new Media({
        type: 'audio',
        artist: 'Pearl Jam',
        title: 'Nothingman',
        label: 'S003'
      });

      thirdMedia = new Media({
        type: 'audio',
        artist: 'Neil Young',
        title: 'My My, Hey Hey',
        label: 'R010'
      });

      firstMedia.save(function(err) {
        if (err) {
          done(err);
        } else {
          secondMedia.save(function(err) {
            if (err) {
              done(err);
            } else {
              thirdMedia.save(function(err) {
                if (err) {
                  done(err);
                } else {
                  fullExperimentSchema = new ExperimentSchema({
                    trials: 3,
                    mediaPool: [firstMedia._id, secondMedia._id, thirdMedia._id]
                  });
                  fullExperimentSchema.save(function(err) {
                    if (err) {
                      done(err);
                    } else {
                      done();
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    it('should build an experiment of the correct length', function(done) {


//      mediaA.save(function() {
//        experimentSchema = new ExperimentSchema({
//          trialCount: 3,
//          mediaPool: [mediaA._id]
//        });
//
//        experimentSchema.save(function() {
//          done();
//        });
//      });
    });
  });

  afterEach(function (done) {
    ExperimentSchema.remove().exec();
    done();
  });
});