'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
  MediaSchema = require('./media.server.model').schema,
  _ = require('lodash');

/**
 * ExperimentSchema Schema
 */
var ExperimentSchemaSchema = new Schema({
	trialCount: {
    type: Number,
    required: true
  },
  mediaPool: [{
      type: Schema.Types.ObjectId,
      ref: 'Media'
  }]
});

// Validator that requires the value is an array and contains at least one entry
function requiredArrayValidator(value) {
  return Object.prototype.toString.call(value) === '[object Array]' && value.length > 0;
}

// Use the above validator for `mediaPool`
ExperimentSchemaSchema.path('mediaPool').validate(requiredArrayValidator);

ExperimentSchemaSchema.methods.buildExperiment = function(callback) {

  // Populate mediaPool
  this.populate('mediaPool');

  var selectedMedia = _.sample(this.mediaPool, this.trialCount);

  if (typeof callback === 'function') {
    return callback(null, {media: selectedMedia});
  } else {
    return builtExperiment;
  }
};

// Register schema for `ExperimentSchema` model
mongoose.model('ExperimentSchema', ExperimentSchemaSchema);