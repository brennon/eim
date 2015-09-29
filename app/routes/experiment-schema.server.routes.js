'use strict';

/**
 * `ExperimentSchema` routes
 *
 * @module {function} "experiment-schema.server.routes"
 */
module.exports = function(app) {

  var controller = require('../../app/controllers/experiment-schema');

  /**
   * Gets a random experiment schema from the database.
   *
   * @example http://<ADDRESS>:<PORT>/api/experiment-schemas/random
   *
   * @name Random experiment schema
   */
  app.route('/api/experiment-schemas/random').get(controller.random);
};
