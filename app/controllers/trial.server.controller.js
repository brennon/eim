'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var trialFileDirectory = './trials/';

exports.create = function (req, res) {
    console.log('Creating new trial JSON file.');

    var requestBody = '';

    req.on('data', function(data) {
        requestBody += data;
    });

    req.on('end', function() {

        var receivedObject = JSON.parse(requestBody);
        var outputFilename;

        if (receivedObject.hasOwnProperty('metadata') &&
            receivedObject.metadata.hasOwnProperty('session_number') &&
            typeof receivedObject.metadata.session_number === 'string' &&
            receivedObject.metadata.session_number) {

            outputFilename = trialFileDirectory + receivedObject.metadata.session_number + '.trial.json';

        } else {
            console.log('Failed to create trial JSON file. Bad request received.');
            return res.status(500).json({ error: 'No metadata.session_number property found.', request_body: receivedObject });
        }

        fs.writeFile(outputFilename, JSON.stringify(receivedObject, null, 4), function(err) {
            if (err) {
                console.error('Could not write new trial JSON file.', err);
                res.status(500).json({ error: err });
            } else {
                console.log('Wrote new JSON file to ' + outputFilename);
                return res.json(200);
            }
        });
    });
};