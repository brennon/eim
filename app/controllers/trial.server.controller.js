'use strict';

/**
 * Trial Controller module
 *
 * This module provides functionality for saving trial files to disk.
 *
 * @module {{}} TrialServerController
 */

// Module dependencies
var fs = require('fs');

/**
 * The directory on disk, relative to the root of the installation, where
 * trial JSON files will be saved.
 *
 * @private
 * @type {string}
 */
var trialFileDirectory = './trials/';

/**
 * Creates a new trial file. This method requires that the body of the
 * request be a JSON object with the `metadata.session_number` set. The
 * trial is then saved to {@link
 * module:TrialServerController~trialFileDirectory|trialFileDirectory}
 * with the name `<SESSION NUMBER>.trial.json`.
 *
 * @param {http.ClientRequest} req The client request
 * @param {http.ServerResponse} res The server response
 * @return {undefined}
 */
exports.create = function(req, res) {
    console.log('Creating new trial JSON file.');

    var outputFilename;

    if (req.body.hasOwnProperty('metadata') &&
        req.body.metadata.hasOwnProperty('session_number') &&
        typeof req.body.metadata.session_number === 'string' &&
        req.body.metadata.session_number) {

        outputFilename = trialFileDirectory +
            req.body.metadata.session_number + '.trial.json';

    } else {
        console.log('Failed to create trial JSON file. Bad request received.', req);
        return res.status(500).json({
            error: 'No metadata.session_number property found.',
            request_body: req.body
        });
    }

    fs.writeFile(outputFilename,
        JSON.stringify(req.body, null, 4),
        function(err) {

            if (err) {
                console.error('Could not write new trial JSON file.', err);
                res.status(500).json({error: err.message});
            } else {
                console.log('Wrote new JSON file to ' + outputFilename);
                res.status(200).json({});
            }
        });
};
