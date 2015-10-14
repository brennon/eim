'use strict';

var util = require('util'),
    winston = require('winston'),
    logger = new winston.Logger(),
    production = (process.env.NODE_ENV || '').toLowerCase() === 'production',
    customConfig = require('./custom').customConfiguration;

// Check if a Loggly key was provided
var useLoggly = false;
if (customConfig.hasOwnProperty('logglyToken') &&
    typeof customConfig.logglyToken === 'string' &&
    customConfig.logglyToken.length > 0) {

    useLoggly = true;

    // Add winston-loggly
    require('winston-loggly');
}

module.exports = {
    middleware: function(req, res, next) {
        console.info(req.method, req.url, res.statusCode);
        next();
    },
    production: production
};

// Override the built-in console methods with winston hooks
switch ((process.env.NODE_ENV || '').toLowerCase()) {
    case 'production':
        production = true;
        logger.add(winston.transports.Console, {
            colorize: true,
            timestamp: true,
            level: 'debug'
        });
        logger.add(winston.transports.File, {
            filename: require('path').join(__dirname, '..', 'application.log'),
            handleExceptions: true,
            exitOnError: false,
            level: 'debug'
        });
        if (useLoggly) {
            logger.add(winston.transports.Loggly, {
                level: 'info',
                subdomain: 'brennon',
                inputToken: customConfig.logglyToken,
                json: true,
                tags: ['Node.js']
            });
        }
        break;
    case 'test':
        logger.add(winston.transports.Console, {
            colorize: true,
            timestamp: true,
            level: 'debug'
        });
        break;
    default:
        logger.add(winston.transports.Console, {
            colorize: true,
            timestamp: true,
            level: 'debug'
        });
        if (useLoggly) {
            logger.add(winston.transports.Loggly, {
                level: 'info',
                subdomain: 'brennon',
                inputToken: customConfig.logglyToken,
                json: true,
                tags: ['Node.js']
            });
        }
        break;
}

// The following stolen from https://gist.github.com/spmason/1670196
function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function() {
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function() {
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function() {
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function() {
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function() {
    logger.debug.apply(logger, formatArgs(arguments));
};
