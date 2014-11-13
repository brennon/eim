'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    MediaSchema = require('./media.server.model').schema,
    _ = require('lodash'),
    BluebirdPromise = require('bluebird');

/**
 * ExperimentSchema Schema
 */
var ExperimentSchemaSchema = new Schema({
    structure: {},
    sensors: [String],
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

    var schemaSubset = {
        _id: this._id,
        structure: this.structure,
        sensors: this.sensors,
        media: selectedMedia,
    };

    // Iterate over structure to look for fixed media-playback slides
    var indexInMedia = 0;
    var promises = [];
    for (var i = 0; i < schemaSubset.structure.length; i++) {
        var slide = schemaSubset.structure[i];

        if (slide.name === 'media-playback' && slide.mediaType === 'fixed') {
            promises.push(updateSchemaForFixedMedia(schemaSubset, indexInMedia, slide.media));
            indexInMedia++;
        } else if (slide.name === 'media-playback' && slide.mediaType === 'random') {
            indexInMedia++;
        }
    }

    BluebirdPromise.all(promises).then(function() {
        if (typeof callback === 'function') {
            return callback(null, schemaSubset);
        } else {
            return schemaSubset;
        }
    });
};

function updateSchemaForFixedMedia(schema, index, mediaId) {
    return new BluebirdPromise(function(resolve, reject) {
        // Get the media entry for the ObjectID in slide.media
        var MediaModel = mongoose.model('Media');
        MediaModel.findOne({_id: mediaId}, {_id:1, artist:1, title: 1, label:1}, function(err, media) {
            if (err) {
                reject();
            }

            if (media) {
                schema.media[index] = media;
                resolve();
            }
        });
    });
}

// Register schema for `ExperimentSchema` model
mongoose.model('ExperimentSchema', ExperimentSchemaSchema);