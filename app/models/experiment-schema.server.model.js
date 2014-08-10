'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ExperimentSchema Schema
 */
var ExperimentSchemaSchema = new Schema({
	trial_count: {
    type: Number,
    required: true
  }
});

mongoose.model('ExperimentSchema', ExperimentSchemaSchema);