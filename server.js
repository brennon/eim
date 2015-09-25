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
var execFile = require('child_process').execFile;

// TODO: Use custom settings!
// Import custom settings
//var customSettings = require('./config/custom');

if (process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'production') {
    require('./config/logging');
}

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

var app, server;

// Instead of exporting the app as we did before, export a promise. On
// resolution, the handler for this promise will be passed the started app.
exports = module.exports = mongoose.connectAsync(config.db)
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

        // Expose app--see above comment about exporting a promise instead
        //exports = module.exports = app;

        // Logging initialization
        console.log('EIM application successfully started on port ' +
            config.port);

        // FIXME: This is hacky sh*t
        // If we are in production mode, try and open Chrome
        if (process.env.NODE_ENV === 'production') {
            var chrome = 'C:\\Program' +
                ' Files\\Google\\Chrome\\Application\\chrome.exe';
            execFile(chrome, ['--kiosk', 'http://localhost:3000']);
        }

        return app;
    })
    .catch(function(e) {
        console.error('Error starting EIM application: ', e);
    });
