'use strict';

var util = require('util'),
  winston = require('winston'),
  logger = new winston.Logger(),
  production = (process.env.NODE_ENV || '').toLowerCase() === 'production',
  metadata = require('./terminal');

// Add winston-loggly
require('winston-loggly');

module.exports = {
  middleware: function(req, res, next){
    console.info(req.method, req.url, res.statusCode);
    next();
  },
  production: production
};

// Override the built-in console methods with winston hooks
switch((process.env.NODE_ENV || '').toLowerCase()){
  case 'production':
    production = true;
    logger.add(winston.transports.File, {
      filename: __dirname + '/application.log',
      handleExceptions: true,
      exitOnError: false,
      level: 'warn'
    });
    break;
  case 'test':
    // Don't set up the logger overrides
    return;
  default:
    logger.add(winston.transports.Console, {
      colorize: true,
      timestamp: true,
      level: 'info'
    });
    logger.add(winston.transports.Loggly, {
      level: 'info',
      subdomain: 'brennon',
      inputToken: '81009487-63da-400f-af48-4b3f91d3bbd5',
      json: true,
      tags: ['Node.js']
    });
    break;
}

function formatArgs(args){
  return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function(){
  logger.info.apply(logger, [formatArgs(arguments), metadata]);
};
console.info = function(){
  logger.info.apply(logger, [formatArgs(arguments), metadata]);
};
console.warn = function(){
  logger.warn.apply(logger, [formatArgs(arguments), metadata]);
};
console.error = function(){
  logger.error.apply(logger, [formatArgs(arguments), metadata]);
};
console.debug = function(){
  logger.debug.apply(logger, [formatArgs(arguments), metadata]);
};