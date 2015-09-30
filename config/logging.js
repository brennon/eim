'use strict';

var util = require('util'),
  winston = require('winston'),
  logger = new winston.Logger(),
  production = (process.env.NODE_ENV || '').toLowerCase() === 'production',
  customConfig = require('./custom').customConfiguration;

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
    logger.add(winston.transports.Loggly, {
      level: 'info',
      subdomain: 'brennon',
      inputToken: '81009487-63da-400f-af48-4b3f91d3bbd5',
      json: true,
      tags: ['Node.js']
    });
    break;
  case 'test':
    // Don't set up the logger overrides
    return;
  default:
    logger.add(winston.transports.Console, {
      colorize: true,
      timestamp: true,
      level: 'debug'
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

//function formatArgs(args){
//  return util.format.apply(util.format, Array.prototype.slice.call(args));
//}
//
//var appendString = '(Terminal: ' + customConfig.metadata.terminal + ')';
//
//function packageLoggerArguments(args) {
//
//  if (args.length === 1) {
//    return args;
//  }
//
//  if (typeof a[a.length - 1] === 'object') {
//    var popped = a.pop();
//  }
//}

//console.log = function(){
//  logger.info.apply(logger, formatArgs(arguments), appendString]);
//};
//console.info = function(){
//  logger.info.apply(logger, [formatArgs(arguments), appendString]);
//};
//console.warn = function(){
//  logger.warn.apply(logger, [formatArgs(arguments), appendString]);
//};
//console.error = function(){
//  logger.error.apply(logger, [formatArgs(arguments), appendString]);
//};
//console.debug = function(){
//  logger.debug.apply(logger, [formatArgs(arguments), appendString]);
//};

console.log = logger.info;
console.info = logger.info;
console.warn = logger.warn;
console.error = logger.error;
console.debug = logger.debug;
