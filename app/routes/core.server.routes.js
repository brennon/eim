'use strict';

/**
 * `Core` routes. These are the 'core' routes made available by the web server
 * that allow access to basic, 'core' functionality.
 *
 * @module {function} Node.CoreServerRoutes
 * @memberof Node
 */

// Controller for these routes
var controller = require('../../app/controllers/core');

// Helper modules
var config = require('../../config/config');

module.exports = function(app) {

    /**
     * Gets the index page
     *
     * @example http://<ADDRESS>:<PORT>/
     *
     * @name Index page route
     * @inner
     */
    app.get('/', controller.index);

    /**
     * Get the current Node.js environment
     *
     * @example http://<ADDRESS>:<PORT>/api/nodeenv
     *
     * @name Node environment route
     * @inner
     */
    app.get('/api/nodeenv', function(req, res) {
        return res.status(200).json({ env: process.env.NODE_ENV });
    });

    /**
     * Get the custom configuration for this machine
     *
     * @example http://<ADDRESS>:<PORT>/api/config
     *
     * @name Custom configuration information route
     * @inner
     */
    app.get('/api/config', function(req, res) {
        return res.status(200).json(config.customConfiguration);
    });

    app.get('/api/generate-plots/:sessionId/:mediaId', controller.generatePlots);
};