'use strict';

/**
 * Module dependencies.
 */

exports.index = function(req, res) {

  req.session.regenerate(function() {
    res.render('index', {
      user: req.user || null
    });
  });
};