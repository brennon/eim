'use strict';

/**
 * Module dependencies.
 */

var BluebirdPromise = require('bluebird');
BluebirdPromise.longStackTraces();

var init = require('./config/init')();
var config = require('./config/config');
var mongoose = BluebirdPromise.promisifyAll(require('mongoose'));
var http = BluebirdPromise.promisifyAll(require('http'));
require('./config/logging');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

var app, server;

mongoose.connectAsync(config.db)
  .then(function() {
    console.log('EIM application starting');
    console.log('Connected to database');

    app = require('./config/express')(mongoose);
    console.log('Started Express server');
  })
  .then(function() {
    return http.createServer(app);
  })
  .then(function(createdServer) {
    server = createdServer;
    return server.listenAsync(config.port);
  })
  .then(function() {
    // Require OSC
    require('./app/controllers/osc').init();
    console.log('Initialized OSC');

    // Fire up SocketIO
    require('./app/controllers/socket')(server);
    console.log('Initialized Socket.IO');

    // Expose app
    exports = module.exports = app;

    // Logging initialization
    console.log('EIM application successfully started on port ' + config.port);
  })
  .catch(function(e) {
    console.error('Error starting EIM application: ', e);
  });
