'use strict';
var express     = require('express'),
    common      = require('../lib/common'),
    logger      = require('../lib/logger').bitbucketbot,
    router      = express.Router(),
    dispatcher  = require('../lib/dispatcher'),
    Jira        = require('../lib/jiraProvider'),
    _           = require('lodash'),
    q           = require('q');

router.post('/', function(req, res) {
    var _body = req.body || null;
    console.log(_body);
})

module.exports = router;