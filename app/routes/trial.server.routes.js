'use strict';


/**
 * `Trial` routes
 *
 * @module {function} TrialServerRoutes
 */

module.exports = function(app) {

    var controller = require('../../app/controllers/trial');

    /**
     * Send a trial document to the server. This document is sent to the
     * `trial.server.controller#create` method.
     *
     * @example http://<ADDRESS>:<PORT>/api/trials
     *
     * @name Upload a trial
     */
    app.route('/api/trials').post(controller.create);
};