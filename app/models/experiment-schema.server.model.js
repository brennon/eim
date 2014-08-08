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
	// ExperimentSchema model fields   
	// ...
});

mongoose.model('ExperimentSchema', ExperimentSchemaSchema);