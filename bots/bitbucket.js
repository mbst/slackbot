'use strict';
var express         = require('express'),
    common          = require('../lib/common'),
    logger          = require('../lib/logger').bitbucketbot,
    router          = express.Router(),
    dispatcher      = require('../lib/dispatcher'),
    Jira            = require('../lib/jiraProvider'),
    _               = require('lodash'),
    q               = require('q');

function handle_pull_request(body) {
    var _pr                 = body.pullrequest_created,
        _pr_title           = _pr.title,
        _branch             = _pr.source.branch.name,
        _destination_branch = _pr.destination.branch.name;

    console.log(_pr_title, _branch, _destination_branch);
}

router.post('/', function(req, res) {
    var _body = req.body || null;

    // decide from the request where to send the data
    if ('pullrequest_created' in _body) {
        handle_pull_request(_body);
    }
    res.end();
})

module.exports = router;