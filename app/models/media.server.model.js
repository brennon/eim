'use strict';

/*
 Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * The Mongoose `Schema` for a `Media` document. This schema is used in
 * creating the Mongoose `Model` for a `Media` document.
 *
 * @module MediaServerModel
 * @namespace MediaSchema
 * @type {mongoose.Schema}
 */
var MediaSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    has_lyrics: Boolean,
    comments: String,
    year: Date,
    excerpt_start_time: Number,
    excerpt_end_time: Number,
    bpm: Number,
    source: String,
    key: String,
    emotion_tags: [Schema.Types.ObjectId],
    genres: [Schema.Types.ObjectId],
    file: Schema.Types.ObjectId
});

mongoose.model('Media', MediaSchema);
console.debug(
    'Registered schema for Media model.',
    MediaSchema
);

module.exports.schema = MediaSchema;
