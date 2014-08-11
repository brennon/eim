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
exports.list = function(req, res, next) {
  ExperimentSchema.find({}, function(err, schemae) {
    if (err) {
      res.json(500, { error: 'error reading from database' });

      if (typeof next === 'function') {
        next(err);
      }
    } else {
      res.json(200, schemae);

      if (typeof next === 'function') {
        next();
      }
    }
  });
};

/**
 * Build a random experiment from a random ExperimentSchema
 */
exports.random = function(req, res, next) {

  function errorHandler(err, message) {
    res.json(500, { error: message });
    if (typeof next === 'function') {
      next(err);
    }
  }

  var count = ExperimentSchema.find({}).count();
  ExperimentSchema.count({}, function(err, count) {
    if (err) {
      return errorHandler(err, 'error reading from database');
    } else if (count < 1) {
      return errorHandler(null, 'no experiment schemae found in database');
    } else {
      ExperimentSchema.find({}).skip(count - 1).limit(1).populate('mediaPool').exec(function (err, schema) {
        schema[0].buildExperiment(function(err, builtExperiment) {
          res.json(200, builtExperiment);
          if (typeof next === 'function') {
            next();
          }
        });
      });
    }
  });
};