'use strict';

module.exports = function(app) {
  var controller = require('../controllers/osc');
  app.route('/api/osc/send/:message').get(controller.sendMessage);
};