'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
  http = require('http');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

var app;

// Bootstrap db connection
var db = mongoose.connect(config.db, function() {

  // Log with winston
  require('./config/logging');

  app = require('./config/express')(db);

  // Start the app by listening on <port>
  var server = http.createServer(app);
  server.listen(config.port);

  // Require OSC
  require('./app/controllers/osc').init();

  // Fire up SocketIO
  require('./app/controllers/socket')(server);

  // Expose app
  exports = module.exports = app;

  // Logging initialization
  console.log('EIM application started on port ' + config.port);
});