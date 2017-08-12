'use strict';

/**
 * `ExperimentSchema` routes
 *
 * @module {function} Node.ExperimentSchemaServerRoutes
 * @memberof Node
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

  app.route('/api/experiment-schemas/:id')
      .get(controller.getExperimentSchemaById);
};
