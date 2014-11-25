'use strict';

var controller = require('../../app/controllers/trial');

module.exports = function(app) {
  app.route('/api/trials').post(controller.create);
};