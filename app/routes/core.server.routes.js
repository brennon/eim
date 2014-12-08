'use strict';

module.exports = function(app) {
    // Root routing
    var core = require('../../app/controllers/core');
    app.route('/').get(core.index);
    app.route('/api/nodeenv').get(function(req, res, next) {
        return res.json({ env: app.get('env') });
    });
};