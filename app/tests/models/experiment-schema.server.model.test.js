'use strict';

/**
 * Module dependencies.
 */
var should = require('chai').should();
var mongoose = require('mongoose');
//  util = require('util'),
//  ExperimentSchema, Media;
var Media,
    ExperimentSchema;

/**
 * Test helpers
 */
var rewire = require('rewire');

/**
 * Globals
 */
var experimentSchema,
    mediaA;

// Server
var server = require('../../../server');
var app;

/**
 * Unit tests
 */
describe('ExperimentSchema Model Unit Tests:', function() {

    // Make sure app is fully started
    before(function(done) {
        server.then(function(startedApp) {
            app = startedApp;
            done();
        });
    });

//  //// Ensure that we are connected to the database
//  //// before running any tests
//  //before(function (done) {
//  //
//  //  var connectedCallback = function () {
//  //    ExperimentSchema = mongoose.model('ExperimentSchema');
//  //    Media = mongoose.model('Media');
//  //    done();
//  //    mongoose.connection.removeListener('connected', connectedCallback);
//  //  };
//  //
//  //  if (mongoose.connection.readyState !== 1) {
//  //
//  //    mongoose.connection.on('connected', connectedCallback);
//  //
//  //  } else {
//  //    connectedCallback();
//  //  }
//  //});
//  //
    beforeEach(function(done) {
        ExperimentSchema = mongoose.model('ExperimentSchema');
        Media = mongoose.model('Media');

        mediaA = new Media({
            type: 'audio',
            artist: 'The Verve',
            title: 'Bittersweet Symphony',
            label: 'R005'
        });

        mediaA.save(function() {
            experimentSchema = new ExperimentSchema({
                trialCount: 3,
                mediaPool: [mediaA._id],
                structure: [
                    {
                        name: 'welcome',
                    },
                    {
                        name: 'media-playback',
                        mediaType: 'random'
                    }
                ]
            });

            experimentSchema.save(function() {
                done();
            });
        });
    });

    afterEach(function(done) {
        Media.remove().exec();
        ExperimentSchema.remove().exec();
        done();
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return experimentSchema.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
    });

    describe('Schema', function() {

        describe('validations', function() {

            var validExperimentSchemaDoc;

            beforeEach(function() {
                validExperimentSchemaDoc = {
                    trialCount: 3,
                    mediaPool: [mediaA.id],
                    structure: [
                        {
                            name: 'welcome',
                        },
                        {
                            name: 'media-playback',
                            mediaType: 'random'
                        }
                    ]
                };
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
                return invalidInstance.save(function(err) {
                    should.exist(err);
                    if (typeof done === 'function') {
                        done();
                    }
                });
            }

            it('should require a type property', function(done) {
                shouldRequireProperty('trialCount', validExperimentSchemaDoc, done);
            });

            it('should require a non-empty type property', function(done) {
                shouldRequireNonemptyProperty('trialCount', validExperimentSchemaDoc, done);
            });

            it('should require a mediaPool property', function(done) {
                shouldRequireProperty('mediaPool', validExperimentSchemaDoc, done);
            });

            it('should require a non-empty mediaPool property', function(done) {
                shouldRequireNonemptyProperty('mediaPool', validExperimentSchemaDoc, done);
            });

            it('should require a structure property', function(done) {
                shouldRequireProperty('structure', validExperimentSchemaDoc, done);
            });

            it('should require a non-empty structure property', function(done) {
                shouldRequireNonemptyProperty('structure', validExperimentSchemaDoc, done);
            });

            it('should reference Media objects through the mediaPool property', function(done) {
                ExperimentSchema.findOne({}).populate('mediaPool').exec(function(err, schema) {
                    should.not.exist(err);
                    schema.mediaPool[0].title.should.equal(mediaA.title);
                    done();
                });
            });

            describe('requiredArrayValidator()', function() {

                var model, testFunction;

                before(function() {
                    delete mongoose.connection.models['ExperimentSchema'];
                    model = rewire('../../models/experiment-schema.server.model');
                    testFunction = model.__get__('requiredArrayValidator');
                });

                it('should require an array', function() {
                    testFunction({}).should.equal(false);
                    testFunction(null).should.equal(false);
                    testFunction('1,2,3').should.equal(false);
                    testFunction(42).should.equal(false);
                    testFunction(function() {}).should.equal(false);
                    testFunction([1,2,3]).should.equal(true);
                });

                it('should require the array to have at least one entry', function() {
                    testFunction([]).should.equal(false);
                });
            });
        });
    });

    describe('#buildExperiment', function() {

        var firstMedia, secondMedia, thirdMedia, fullExperimentSchema;

        beforeEach(function(done) {

            firstMedia = new Media({
                type: 'audio',
                artist: 'Michael Jackson',
                title: 'Thriller',
                label: 'T004'
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
                                        trialCount: 2,
                                        mediaPool: [firstMedia._id, secondMedia._id, thirdMedia._id],
                                        structure: 14
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
            // Get an experiment schema from database
            ExperimentSchema.findOne({_id: fullExperimentSchema._id}, function(err, findResult) {
                if (err) {
                    done(err);
                } else {
                    // Build an experiment based on this schema
                    findResult.buildExperiment(function(err, buildResult) {
                        if (err) {
                            done(err);
                        } else {
                            buildResult.media.length.should.equal(2);
                            done();
                        }
                    });
                }
            });
        });

        it('should contain labels of media files in the media property', function(done) {
            // Get an experiment schema from database
            ExperimentSchema.findOne({_id: fullExperimentSchema._id}).populate('mediaPool').exec(function(err, exp) {

                if (err) {
                    done(err);
                } else {

                    // Build a list of labels from original schema's pool
                    var labels = [];
                    exp.mediaPool.forEach(function(media) {
                        labels.push(media.label);
                    });


                    // Build an experiment based on this schema
                    exp.buildExperiment(function(err, build) {
                        if (err) {
                            done(err);
                        } else {

                            // Check the label of each media entry and make sure it exists in original schema's pool
                            build.media.forEach(function(media) {
                                labels.should.contain(media.label);
                            });

                            done();
                        }
                    });
                }
            });
        });
    });
});