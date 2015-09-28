'use strict';

// TODO: There are lots of requirements for an ExperimentSchema that we're not enforcing here

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var MediaSchema = require('./media.server.model').schema;
var _ = require('lodash');
var BluebirdPromise = require('bluebird');

/**
 * ExperimentSchema Schema
 */
var ExperimentSchemaSchema = new Schema({
    sensors: [String],
    structure: {
        type: Array,
        required: true
    },
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
    return Array.isArray(value) && value.length > 0;
}

function updateSchemaForFixedMedia(schema, index, mediaId) {
    return new BluebirdPromise(function(resolve, reject) {

        // Get the media entry for the ObjectID in slide.media
        var MediaModel = mongoose.model('Media');
        MediaModel.findOne({_id: mediaId}, {_id:1, artist:1, title: 1, label:1}, function(err, media) {

            if (err) {
                return reject(err);
            }

            if (media) {
                schema.media[index] = media;
                return resolve();
            } else {
                return reject(new Error('Media not found in database for media ID ' + mediaId));
            }
        });
    });
}

// Use the above validator for properties that should contain a non-empty array
ExperimentSchemaSchema.path('mediaPool').validate(requiredArrayValidator);

ExperimentSchemaSchema.methods.buildExperiment = function(callback) {

    // Populate mediaPool
    this.populate('mediaPool');

    var selectedMedia = _.sample(this.mediaPool, this.trialCount);

    var schemaSubset = {
        _id: this._id,
        structure: this.structure,
        sensors: this.sensors,
        media: selectedMedia
    };

    // Iterate over structure to look for fixed media-playback slides
    //var indexInMedia = 0;
    //var promises = [];
    //for (var i = 0; i < schemaSubset.structure.length; i++) {
    //    var slide = schemaSubset.structure[i];
    //
    //    if (slide.name === 'media-playback' && slide.mediaType === 'fixed') {
    //        promises.push(updateSchemaForFixedMedia(schemaSubset, indexInMedia, slide.media));
    //        indexInMedia++;
    //    } else if (slide.name === 'media-playback' && slide.mediaType === 'random') {
    //        indexInMedia++;
    //    }
    //}

    //BluebirdPromise.all(promises).then(function() {
        if (typeof callback === 'function') {
            return callback(null, schemaSubset);
        } else {
            return schemaSubset;
        }
    //});
};

//// Register schema for `ExperimentSchema` model
mongoose.model('ExperimentSchema', ExperimentSchemaSchema);