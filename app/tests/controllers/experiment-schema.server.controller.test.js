'use strict';

// Server
//var server = require('../../../server');
//var app;

// Testing tools
var should = require('chai').should();
var rewire = require('rewire');
var httpMocks = require('node-mocks-http');
//var request = require('supertest');

/* jshint ignore:start */
var sinon = require('sinon');
/* jshint ignore:end */

// Need to make sure the schema has been registered
require('../../models/experiment-schema');

// Variables for tests
var controller;

describe('ExperimentSchema Controller Tests', function() {

    //before(function(done) {
    //    server.then(function(startedApp) {
    //        app = startedApp;
    //        done();
    //    });
    //});

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

            // Call #list
            controller.list();

            // Check expectations
            spy.callCount.should.equal(1);

            //noinspection JSUnresolvedVariable
            spy.args[0][0].should.deep.equal({});
        });

        describe('responses', function() {

            describe('when a schema is not available', function() {

                // Mock ExperimentSchema model for controller
                var errorMessage = 'No schema found';
                var experimentSchemaMock = {
                    find: function(filter, callback) {
                        callback(new Error(errorMessage));
                    }
                };

                var req, res;

                beforeEach(function() {
                    controller.__set__({
                        ExperimentSchema: experimentSchemaMock
                    });

                    // Mock request and response
                    req = httpMocks.createRequest();
                    res = httpMocks.createResponse();

                    // Call #list
                    controller.list(req, res);
                });

                it('should return status 500', function() {
                    res.statusCode.should.equal(500);
                });

                it('should return the error in JSON', function() {
                    var data = JSON.parse(res._getData());
                    data.error.should.equal(errorMessage);
                });
            });

            describe('when a schema is available', function() {

                // Mock ExperimentSchema model for controller
                var mockSchema = {foo: 'bar'};
                var experimentSchemaMock = {
                    find: function(filter, callback) {
                        callback(null, mockSchema);
                    }
                };

                var req, res;

                beforeEach(function() {
                    controller.__set__({
                        ExperimentSchema: experimentSchemaMock
                    });

                    // Mock request and response
                    req = httpMocks.createRequest();
                    res = httpMocks.createResponse();

                    // Call #list
                    controller.list(req, res);
                });

                it('should return status 200', function() {
                    res.statusCode.should.equal(200);
                });

                it('should return the error in JSON', function() {
                    var data = JSON.parse(res._getData());

                    //noinspection JSUnresolvedVariable
                    data.should.deep.equal(mockSchema);
                });
            });
        });
    });

    describe('#random', function() {

        describe('responses', function() {

            describe('when the count call fails', function() {

                // Mock ExperimentSchema model for controller
                var errorMessage = 'Count failed.';
                var experimentSchemaMock = {
                    count: function(filter, callback) {
                        callback(new Error(errorMessage));
                    }
                };

                var req, res;

                beforeEach(function() {
                    controller.__set__({
                        ExperimentSchema: experimentSchemaMock
                    });

                    // Mock request and response
                    req = httpMocks.createRequest();
                    res = httpMocks.createResponse();

                    // Call #list
                    controller.random(req, res);
                });

                it('should return status 500', function() {
                    res.statusCode.should.equal(500);
                });

                it('should return the error in JSON', function() {
                    var data = JSON.parse(res._getData());
                    data.error.should.equal(errorMessage);
                });
            });

            describe('when there aren\'t any schemas in the database', function() {
                var experimentSchemaMock = {
                    count: function(filter, callback) {
                        callback(null, 0);
                    }
                };

                var req, res;

                beforeEach(function() {
                    controller.__set__({
                        ExperimentSchema: experimentSchemaMock
                    });

                    // Mock request and response
                    req = httpMocks.createRequest();
                    res = httpMocks.createResponse();

                    // Call #list
                    controller.random(req, res);
                });

                it('should return status 500', function() {
                    res.statusCode.should.equal(500);
                });

                it('should return the error in JSON', function() {
                    var data = JSON.parse(res._getData());
                    data.error.should.not.equal(undefined);
                });
            });

            describe('when the query fails', function() {

                // Mock ExperimentSchema model for controller
                var errorMessage = 'Query failed.';
                var experimentSchemaMock;
                var req, res;

                beforeEach(function() {
                    experimentSchemaMock = {
                        count: function(filter, callback) {
                            return callback(null, 10);
                        },
                        find: function() {
                            return {
                                skip: function() {
                                    return {
                                        limit: function() {
                                            return {
                                                populate: function() {
                                                    return {
                                                        exec: function(callback) {
                                                            callback(new Error(errorMessage));
                                                        }
                                                    };
                                                }
                                            };
                                        }
                                    };
                                }
                            };
                        }
                    };

                    controller.__set__({
                        ExperimentSchema: experimentSchemaMock
                    });

                    // Mock request and response
                    req = httpMocks.createRequest();
                    res = httpMocks.createResponse();

                    // Call #list
                    controller.random(req, res);
                });

                it('should return status 500', function() {
                    res.statusCode.should.equal(500);
                });

                it('should return the error in JSON', function() {
                    var data = JSON.parse(res._getData());
                    data.error.should.equal(errorMessage);
                });
            });

            describe('when the query is unsuccessful', function() {

                // Mock ExperimentSchema model for controller
                var errorMessage = 'Query failed.';
                var experimentSchemaMock;
                var schemaQueryResultMock;
                var req, res;

                beforeEach(function() {
                    schemaQueryResultMock = [{
                        //build
                    }];

                    experimentSchemaMock = {
                        count: function(filter, callback) {
                            return callback(null, 10);
                        },
                        find: function() {
                            return {
                                skip: function() {
                                    return {
                                        limit: function() {
                                            return {
                                                populate: function() {
                                                    return {
                                                        exec: function(callback) {
                                                            callback(new Error(errorMessage));
                                                        }
                                                    };
                                                }
                                            };
                                        }
                                    };
                                }
                            };
                        }
                    };

                    controller.__set__({
                        ExperimentSchema: experimentSchemaMock
                    });

                    // Mock request and response
                    req = httpMocks.createRequest();
                    res = httpMocks.createResponse();

                    // Call #list
                    controller.random(req, res);
                });

                it('should return status 500', function() {
                    res.statusCode.should.equal(500);
                });

                it('should return the error in JSON', function() {
                    var data = JSON.parse(res._getData());
                    data.error.should.equal(errorMessage);
                });
            });

            describe('when the query is successful', function() {

                // Mock ExperimentSchema model for controller
                var experimentSchemaMock;
                var schemaQueryResultMock;
                var builtExperimentMock = {foo: 'bar'};
                var req, res;

                beforeEach(function() {
                    schemaQueryResultMock = [{
                        buildExperiment: function(callback) {
                            return callback(null, builtExperimentMock);
                        }
                    }];

                    experimentSchemaMock = {
                        count: function(filter, callback) {
                            return callback(null, 10);
                        },
                        find: function() {
                            return {
                                skip: function() {
                                    return {
                                        limit: function() {
                                            return {
                                                populate: function() {
                                                    return {
                                                        exec: function(callback) {
                                                            callback(null, schemaQueryResultMock);
                                                        }
                                                    };
                                                }
                                            };
                                        }
                                    };
                                }
                            };
                        }
                    };

                    controller.__set__({
                        ExperimentSchema: experimentSchemaMock
                    });

                    // Mock request and response
                    req = httpMocks.createRequest();
                    res = httpMocks.createResponse();

                    // Call #list
                    controller.random(req, res);
                });

                it('should return status 200', function() {
                    res.statusCode.should.equal(200);
                });

                it('should return the error in JSON', function() {
                    var data = JSON.parse(res._getData());
                    data.should.deep.equal(builtExperimentMock);
                });
            });
        });

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

        it('should build an experiment', function() {

            // Mock the first result in the array stored in schema
            var spy = sinon.spy();
            var mockSchemaArray = [{
                buildExperiment: spy
            }];

            // Return this array when the query is executed
            var mockCount = function(filter, callback) {
                callback(null, 10);
            };

            controller.__set__({
                ExperimentSchema: {
                    count: mockCount,
                    find: function() {
                        return {
                            skip: function() {
                                return {
                                    limit: function() {
                                        return {
                                            populate: function() {
                                                return {
                                                    exec: function(callback) {
                                                        return callback(null, mockSchemaArray);
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

            controller.random();
            spy.callCount.should.equal(1);
        });
    });
});