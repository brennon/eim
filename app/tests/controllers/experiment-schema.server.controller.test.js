'use strict';

var should = require('should');
var httpMocks = require('node-mocks-http');
var _ = require('lodash');
var mongoose = require('mongoose');
var util = require('util');
var controller, ExperimentSchema, Media;
var firstMedia, secondMedia, thirdMedia, fullExperimentSchema;

describe('ExperimentSchemaController tests', function() {

  // Ensure that we are connected to the database
  // before running any tests
  before(function(done) {

    var connectedCallback = function() {
      controller = require('../../controllers/experiment-schema');
      ExperimentSchema = mongoose.model('ExperimentSchema');
      Media = mongoose.model('Media');
      mongoose.connection.removeListener('connected', connectedCallback);
      done();
    };

    if (mongoose.connection.readyState != 1) {

      mongoose.connection.on('connected', connectedCallback);

    } else {
      connectedCallback();
    }
  });

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

    firstMedia.save(function (err) {
      if (err) {
        done(err);
      } else {
        secondMedia.save(function (err) {
          if (err) {
            done(err);
          } else {
            thirdMedia.save(function (err) {
              if (err) {
                done(err);
              } else {
                fullExperimentSchema = new ExperimentSchema({
                  trialCount: 3,
                  mediaPool: [firstMedia._id, secondMedia._id, thirdMedia._id]
                });
                fullExperimentSchema.save(function (err) {
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

  describe('#list', function() {

    it('should respond with JSON', function(done) {
      var mockResponse = httpMocks.createResponse();
      controller.list(null, mockResponse, function() {
        mockResponse._isJSON().should.be.true;
        done();
      });
    });

    it('should respond with success', function(done) {
      var mockResponse = httpMocks.createResponse();
      controller.list(null, mockResponse, function() {
        mockResponse.statusCode.should.equal(200);
        done();
      });
    });

    it('should return a JSON array', function(done) {
      var mockResponse = httpMocks.createResponse();
      controller.list(null, mockResponse, function() {
        var data = JSON.parse(mockResponse._getData());
        _.isArray(data).should.equal(true, 'Response was not a JSON array');
        done();
      });
    });
  });

  describe('#random', function() {

    it('should respond with JSON', function(done) {
      var mockResponse = httpMocks.createResponse();
      controller.random(null, mockResponse, function() {
        mockResponse._isJSON().should.be.true;
        done();
      });
    });

    it('should respond with success', function(done) {
      var mockResponse = httpMocks.createResponse();
      controller.random(null, mockResponse, function() {
        mockResponse.statusCode.should.equal(200);
        done();
      });
    });

    it('should return a built experiment', function(done) {
      var mockResponse = httpMocks.createResponse();
      controller.random(null, mockResponse, function() {
        var data = JSON.parse(mockResponse._getData());
        console.log(data);
        data.media.length.should.equal(fullExperimentSchema.trialCount);
        done();
      });
    });

    after(function() {
      ExperimentSchema.remove().exec();
      Media.remove().exec();
    });
  });
});