'use strict';

/**
 * Custom configuration module
 * @module config/custom
 */

// The customConfiguration object is included as a property on the object
// that is returned when /app/config/config.js is required. To make custom
// properties available to the rest of your application that may differ for
// your particular deployment, add them as properties of the
// customConfiguration object and require() the config.js file.

var customConfiguration = {};

// Metadata are stored on the trial data that the application saves for each
// experiment session.

customConfiguration.metadata = {};
customConfiguration.metadata.terminal = 1;

module.exports = exports = {
    customConfiguration: customConfiguration
};