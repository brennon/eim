'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var trialFileDirectory = './trials/';

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
        console.log('Failed to create trial JSON file. Bad request received.');
        return res.status(500).json({
            error: 'No metadata.session_number property found.',
            request_body: req.body
        });
    }

    //noinspection JSUnresolvedFunction
    fs.writeFile(outputFilename,
        JSON.stringify(req.body, null, 4),
        function(err) {

            if (err) {
                console.error('Could not write new trial JSON file.', err);
                return res.status(500).json({error: err.message});
            } else {
                console.log('Wrote new JSON file to ' + outputFilename);
                return res.json(200);
            }
        });
};
