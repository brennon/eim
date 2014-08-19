'use strict';

var request = require('supertest');
var config = require('../../../config/config');
var mongoose = require('mongoose');
var util = require('util');
var controller, ExperimentSchema, Media;
var firstMedia, secondMedia, thirdMedia, fullExperimentSchema;

describe('ExperimentSchema Route Tests', function() {

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

    if (mongoose.connection.readyState !== 1) {

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

  describe('GET /api/experiment-schemas/random', function () {

    it('responds with success', function (done) {
      request('localhost:' + config.port)
        .get('/api/experiment-schemas/random')
        .end(function(err, res) {
          res.statusCode.should.equal(200, 'Response status was not 200 OK');
          done();
        });
    });
  });

  after(function() {
    ExperimentSchema.remove().exec();
    Media.remove().exec();
  });
});