'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    ExperimentSchema = mongoose.model('ExperimentSchema');

///**
// * Create a Experiment schema
// */
//exports.create = function(req, res) {
//
//};
//
///**
// * Show the current Experiment schema
// */
//exports.read = function(req, res) {
//
//};
//
///**
// * Update a Experiment schema
// */
//exports.update = function(req, res) {
//
//};
//
///**
// * Delete an Experiment schema
// */
//exports.delete = function(req, res) {
//
//};

/**
 * List of Experiment schemas
 */
exports.list = function(req, res) {

  ExperimentSchema.find({}, function(err, schemae) {
    if (err) {
      res.json(500, { error: err });
    } else {
      res.json(200, schemae);
    }
  });
};


/**
 * Build a random experiment from a random ExperimentSchema
 */
exports.random = function(req, res) {

  function errorHandler(message) {
    res.json(500, { error: message });
  }

  ExperimentSchema.count({}, function(err, count) {

    if (err) {
      return errorHandler(err);
    } else if (count < 1) {
      return errorHandler('no experiment schema found in database');
    } else {

      // Get a random number from [0, totalSchemae)
      var rand = Math.floor(Math.random() * count);

      // Get a random schema
      ExperimentSchema.find({}).skip(rand).limit(1).populate('mediaPool', 'artist title label').exec(function (err, schema) {

        // Using the controller, services an experiment from this schema
        schema[0].buildExperiment(function(err, builtExperiment) {

          // Send the response
          res.json(200, builtExperiment);
        });
      });
    }
  });
};