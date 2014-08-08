'use strict';

/**
 * Module dependencies.
 */
var osc = require('./osc.server.controller.js');

var oscResetMessage = {
  oscType: 'message',
  address: '/eim/control',
  args: [{
    type: 'string',
    value: 'reset'
  }]
};

exports.index = function(req, res) {

  // Send OSC message to reset Max session
  osc.sendJSONMessage(oscResetMessage);

  req.session.regenerate(function() {
    res.render('index', {
      user: req.user || null
    });
  });
};