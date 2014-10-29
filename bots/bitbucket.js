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
    var _message_options = {
        username: 'Bitbucket',
        color: '#205081',
        icon_url: 'https://www.vectorbase.org/sites/default/files/ftp/Landing_page_icons/Downloads_icons/bitbucket_logo.png'
    }

    var _pr                 = body.pullrequest_created,
        _pr_title           = _pr.title,
        _branch             = _pr.source.branch.name,
        _destination_branch = _pr.destination.branch.name;

    var message = new dispatcher('#pull-requests', _message_options);
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