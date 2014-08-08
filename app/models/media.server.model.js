'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Media Schema
 */
var MediaSchema = new Schema({
	type: {
    type: String,
    required: true
  }
});

mongoose.model('Media', MediaSchema);