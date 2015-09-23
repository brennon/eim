'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ExperimentSchema = mongoose.model('ExperimentSchema');

/**
 * List of Experiment schemas
 */
exports.list = function(req, res) {

    ExperimentSchema.find({}, function(err, schemae) {

        // TODO: Test both branches as part of route testing
        if (err) {
            res.json(500, {error: err});
        } else {
            res.json(200, schemae);
        }
    });
};

/**
 * Build a random experiment from a random ExperimentSchema
 */
// TODO: The actual pulling of a random schema should move into the model
exports.random = function(req, res) {

    function errorHandler(message) {
        res.json(500, {error: message});
    }

    ExperimentSchema.count({}, function(err, count) {

        // TODO: Test as part of route testing
        if (err) {
            return errorHandler(err);
        } else if (count < 1) {
            return errorHandler('no experiment schema found in database');
        } else {

            // Get a random number from [0, number of schema)
            var rand = Math.floor(Math.random() * count);

            // Get a random schema
            ExperimentSchema.find({}).skip(rand).limit(1).populate('mediaPool', 'artist title label').exec(function(err, schema) {

                // TODO: Can't really test this as part of the controller
                // Using the controller, build an experiment from this schema
                schema[0].buildExperiment(function(err, builtExperiment) {

                    // TODO: Test as part of route testing
                    // Send the response
                    res.json(200, builtExperiment);
                });
            });
        }
    });
};