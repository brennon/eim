'use strict';

/*
    Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var BluebirdPromise = require('bluebird');

/**
 * The [Mongoose](http://mongoosejs.com/) `Schema` for an
 * `ExperimentSchema`. This schema is used in
 * creating the Mongoose `Model` for an `ExperimentSchema`.
 *
 * @module Node.ExperimentSchemaServerModel
 * @memberof Node
 * @type {mongoose.Schema}
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

/**
 * A validator for Mongoose schemas that requires that its single argument
 * be an `Array` of length greater than 0.
 *
 * @private
 * @inner
 * @param {*} value The value to be validated
 * @returns {Boolean} `true` if the validation is successful; `false` otherwise
 */
function requiredArrayValidator(value) {
    return Array.isArray(value) && value.length > 0;
}

/**
 * Given an ExperimentSchema, an index into that schema's `media` array, and
 * the ID of a `Media` document in the database, this function retrieves the
 * document associated with that ID from the database, and updates the media
 * array of the schema with information from this document. A promise is
 * returned that is resolved when the schema is updated.
 *
 * @private
 * @inner
 * @param {ExperimentSchema} schema
 * @param {Number} index The index into `schema`'s `media` array
 * @param {mongoose.ObjectId} mediaId The ID corresponding to the document
 * that should be retrieved from the database
 * @returns {bluebird.BluebirdPromise}
 */
function updateSchemaForFixedMedia(schema, index, mediaId) {

    console.debug(
        'Updating schema for fixed media at index ' +
        index +
        ' using media with ID ' +
        mediaId,
        schema
    );

    return new BluebirdPromise(function(resolve, reject) {

        // Get the media entry for the ObjectID in slide.media
        var MediaModel = mongoose.model('Media');
        MediaModel.findOne({_id: mediaId}, {
            _id: 1,
            artist: 1,
            title: 1,
            label: 1
        }, function(err, media) {

            if (err) {
                return reject(err);
            }

            if (media) {
                schema.media[index] = media;
                return resolve();
            } else {
                var message = 'Media not found in database for media ID ' +
                    mediaId;
                console.error(message);
                return reject(new Error(message));
            }
        });
    });
}

// Use the above validator for properties that should contain a non-empty array
ExperimentSchemaSchema.path('mediaPool').validate(requiredArrayValidator);

/**
 * This method draws one available `ExperimentSchema` document at random
 * from the database. This `media` array of this document is populated. For
 * any fixed media specified in the document, their details are found and
 * inserted directly into the final document. The callback will be called
 * upon completion and provided with the 'built' experiment.
 *
 * @function buildExperiment
 * @instance
 * @param {Node.module:ExperimentSchemaServerModel~buildExperimentCallback} callback Will be called upon completion
 */
ExperimentSchemaSchema.methods.buildExperiment = function(callback) {

    console.info('Building random experiment.');

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
    var indexInMedia = 0;
    var promises = [];
    for (var i = 0; i < schemaSubset.structure.length; i++) {
        var slide = schemaSubset.structure[i];

        if ((slide.name === 'media-playback' && slide.mediaType === 'fixed') || slide.name === 'impulse-playback') {
            promises.push(
                updateSchemaForFixedMedia(
                    schemaSubset,
                    indexInMedia,
                    slide.media
                )
            );
            indexInMedia++;
        } else if (slide.name === 'media-playback' &&
            slide.mediaType === 'random') {
            indexInMedia++;
        }
    }

    BluebirdPromise.all(promises)
        .then(function() {
            return callback(null, schemaSubset);
        })
        .catch(function(err) {
            return callback(err, schemaSubset);
        });
};

/**
 * @callback buildExperimentCallback
 * @param {*} err Any error that `buildExperiment()` encountered
 * @param {ExperimentSchema} schema The built `ExperimentSchema`
 */

// Register schema for ExperimentSchema model
mongoose.model('ExperimentSchema', ExperimentSchemaSchema);
console.debug(
    'Registered schema for ExperimentSchema model.',
    ExperimentSchemaSchema
);

module.exports.schema = ExperimentSchemaSchema;
