'use strict';

/**
 * Module dependencies.
 */
var applicationConfiguration = require('./config/config');

var jQuerySource = ['public/lib/jquery/dist/jquery.min.js'];


// Karma configuration
module.exports = function(config) {
	config.set({
		// Frameworks to use
		frameworks: ['jasmine','sinon'],

		// List of files / patterns to load in the browser
		files: jQuerySource.concat(applicationConfiguration.assets.lib.js, applicationConfiguration.assets.js, applicationConfiguration.assets.tests),

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		//reporters: ['progress'],
		reporters: ['progress', 'coverage'],

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true,

		// Instrument files for coverage
		preprocessors: {
			//'public/modules/**/*.js': 'coverage'
			'public/modules/core/controllers/*.js': 'coverage',
			'public/modules/core/directives/*.js': 'coverage',
			'public/modules/core/services/*.js': 'coverage'
		},

		// Configure coverage reporter
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		}
	});
};