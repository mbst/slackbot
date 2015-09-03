'use strict';
var express     = require('express');
var logger      = require('../../internals/logger').githubbot;
var githubUtils = require('./resources/github-utils');

var router = express.Router();

router.route('/').post(function(req, res) {
    var _body = req.body || null;
    var _event = req.headers['x-github-event'] || null;

    // end the response here if any of the request data is missing
    if (! _body || ! _event) {
        res.end('not enough data to continue');
        return;
    }

    // based on github event header, decide what to do with the request
    switch (_event) {
        case 'pull_request':
          githubUtils.handlePullRequest(_body);
          break;

        case 'ping':
          logger.log('Ping');
          break;
    }
    res.end();
});

module.exports = { webhook: router };
