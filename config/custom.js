'use strict';

/**
 * Custom configuration module. All custom configuration is set using the
 * {@link
 * Node.module:CustomConfiguration~customConfiguration|customConfiguration}
 * property of the object this module exports.
 *
 * @module {{}} Node.CustomConfiguration
 * @memberof Node
 */

/**
 * The customConfiguration object is included as a property on the object that
 * is returned when `/app/config/config.js` (the {@link
 * Node.module:CustomConfiguration|CustomConfiguration} module) is required. To
 * make custom properties available to the rest of your application that may
 * differ for your particular deployment, add them as properties of the
 * customConfiguration object and require() the config.js file.
 *
 * @name customConfiguration
 * @namespace
 * @type {{}}
 */
var customConfiguration = {};

/**
 * Metadata that are stored on the trial data that the application saves for
 * each experiment session.
 *
 * @name metadata
 * @memberof Node.module:CustomConfiguration~customConfiguration
 * @inner
 * @type {{}}
 * @property {number} metadata.terminal The terminal number that will be
 * recorded for every session on this computer
 */
customConfiguration.metadata = {};
customConfiguration.metadata.terminal = 1;
customConfiguration.metadata.location = 'taichung';
customConfiguration.experimentId = '5987599bdd03906fdb65f333';
customConfiguration.useRandomExperiment = false;

/**
 * The strings in this array specify those inner properties on {@link
 * Angular.TrialData#data|TrialData.data} that will be converted to JSON using
 * {@link
 * Angular.TrialData#toJsonCompact|TrialData.toJsonCompact} of provided on the
 * object returned by {@link Angular.TrialData#toCompact|TrialData.toCompact}.
 * In the default configuration, this means that only the properties specified
 * here will be written to file at the end of a session.
 *
 * @name exportedProperties
 * @memberof Node.module:CustomConfiguration~customConfiguration
 * @inner
 * @type {string[]}
 */
customConfiguration.exportedProperties =
    ['answers', 'date', 'media', 'metadata'];

/**
 * The default language for your installation
 *
 * @name defaultLanguage
 * @memberof Node.module:CustomConfiguration~customConfiguration
 * @inner
 * @type {string}
 */
customConfiguration.defaultLanguage = 'en';

/**
 * Your token for the Loggly service
 *
 * @name logglyToken
 * @memberof Node.module:CustomConfiguration~customConfiguration
 * @inner
 * @type {string}
 */
customConfiguration.logglyToken = '';

module.exports = {
    customConfiguration: customConfiguration
};
