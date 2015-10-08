'use strict';

/**
 * `ExperimentSchema` controller
 *
 * @module {{}} Node.ExperimentSchemaServerController
 * @memberof Node
 */

// Module dependencies
var mongoose = require('mongoose'),
    ExperimentSchema = mongoose.model('ExperimentSchema');

/**
 * Fetch all available `ExperimentSchema`s.
 *
 * The database is queried for all `ExperimentSchema` documents. These are
 * used as the JSON response.
 *
 * @param {http.ClientRequest} req
 * @param {http.ServerResponse} res
 */
exports.list = function(req, res) {

    console.info('Fetching all ExperimentSchemas.');

    ExperimentSchema.find({}, function(err, schemas) {

        if (err) {
            console.error('Error fetching all ExperimentSchemas.', err);
            res.status(500).json({error: err.message});
        } else {
            res.status(200).json(schemas);
        }
    });
};

/**
 * 'Build' a proper experiment from one of the available `ExperimentSchema`s.
 *
 * A random `ExperimentSchema` is fetched from the database. The
 * `ExperimentSchema` model's `buildDocument()` method is used to build out
 * this experiment, and that experiment is used as the JSON response.
 *
 * @param {http.ClientRequest} req
 * @param {http.ServerResponse} res
 */
exports.random = function(req, res) {

    console.info('Building experiment from a random ExperimentSchema.');

    function errorHandler(err) {
        res.status(500).json({error: err.message});
    }

    ExperimentSchema.count({}, function(err, count) {

        if (err) {

            console.error('Error counting ExperimentSchemas.', err);
            return errorHandler(err);

        } else if (count < 1) {

            console.warn('No ExperimentSchemas found in database.');
            return errorHandler(new Error('No experiment schemas in' +
                ' database.'));

        } else {

            // Get a random number from [0, number of schema)
            var rand = Math.floor(Math.random() * count);

            // Get a random schema
            ExperimentSchema.find({})
                .skip(rand)
                .limit(1)
                .populate('mediaPool', 'artist title label')
                .exec(function(err, schema) {

                    if (err) {
                        console.error(
                            'Error fetching one ExperimentSchema.',
                            err
                        );
                        return errorHandler(err);
                    }

                    // Using the controller, build an experiment from this
                    // schema
                    schema[0].buildExperiment(function(err, builtExperiment) {

                        if (err) {

                            // Report the error and set the response
                            console.error('Error building experiment from' +
                                ' ExperimentSchema', err);
                            res.status(500).json({error: err.message});
                        } else {

                            // Send the response
                            res.status(200).json(builtExperiment);
                        }
                    });
                });
        }
    });
};
