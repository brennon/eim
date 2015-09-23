'use strict';

// Testing tools
var should = require('chai').should();
var rewire = require('rewire');
var sinon = require('sinon');

// Need to make sure the schema has been registered
require('../../models/experiment-schema');

// Variables for tests
var controller;

describe('ExperimentSchema Controller Tests', function() {

    beforeEach(function() {
        controller = rewire('../../controllers/experiment-schema');
    });

    // TODO: Test routes separately
    describe('#list', function() {

        it('should use the mongoose model to find all schemas', function() {

            // Spy on calls to ExperimentSchema.find()
            var spy = sinon.spy();
            controller.__set__({
                ExperimentSchema: {
                    find: spy
                }
            });

            // Call the method
            controller.list();

            // Check expectations
            spy.callCount.should.equal(1);

            //noinspection JSUnresolvedVariable
            spy.args[0][0].should.deep.equal({});
        });
    });

    describe('#random', function() {

        it('should count the number of schemas in the database', function() {

            // Spy on calls to ExperimentSchema.count()
            var spy = sinon.spy();
            controller.__set__({
                ExperimentSchema: {
                    count: spy
                }
            });

            // Call the method
            controller.random();

            // Check expectations
            spy.callCount.should.equal(1);

            //noinspection JSUnresolvedVariable
            spy.args[0][0].should.deep.equal({});
        });

        it('should get one schema', function(done) {

            // Mock ExperimentSchema.count() and the chained call to
            // ExperimentSchema.find()
            var mockCount = function(filter, callback) {
                callback(null, 10);
            };

            controller.__set__({
                ExperimentSchema: {
                    count: mockCount,
                    find: function() {
                        return {
                            skip: function(x) {

                                //noinspection JSUnresolvedFunction
                                x.should.be.below(10);
                                return {
                                    limit: function(y) {
                                        y.should.equal(1);
                                        done();
                                        return {
                                            populate: function() {
                                                return {
                                                    exec: function() {
                                                    }
                                                };
                                            }
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            });

            // Call the method
            controller.random();
        });
    });
});