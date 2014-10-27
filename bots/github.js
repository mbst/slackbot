'use strict';
var express     = require('express'),
    common      = require('../lib/common'),
    logger      = require('../lib/logger').githubbot,
    router      = express.Router(),
    dispatcher  = require('../lib/dispatcher'),
    _           = require('lodash'),
    q           = require('q');

router.route('/').post(function(req, res, next) {
    var _body = req.body || null;
    var _event = req.headers['x-github-event'] || null;

    // end the response here when _event or _body are empty
    if (!!_body || !!_event) {
        res.end('not enough data to continue');
        next();
        return;
    }

    
    res.end('YaY');
    next();
});

module.exports = router;