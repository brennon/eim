'use strict';

var controller = require('../../app/controllers/core');

module.exports = function(app) {

    // GET the index page
    app.get('/', controller.index);

    // GET the Node environment
    app.get('/api/nodeenv', function(req, res) {
        return res.json({ env: process.env.NODE_ENV });
    });
};