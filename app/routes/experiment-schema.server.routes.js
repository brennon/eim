'use strict';

module.exports = function(app) {
  var controller = require('../../app/controllers/experiment-schema');
  app.route('/api/experiment-schemas').get();
};