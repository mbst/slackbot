'use strict';
var express     = require('express'),
    common      = require('../lib/common'),
    logger      = require('../lib/logger').githubbot,
    router      = express.Router(),
    dispatcher  = require('../lib/dispatcher'),
    _           = require('lodash'),
    q           = require('q');

//  For dealing with a pull request and dispatching to the correct chat
//
//  @param body {object} the body of the request
//
function handle_pull_request(body) {
    var _message_options = {
        username: 'Github',
        color: '#000',
        icon_url: 'https://octodex.github.com/images/bouncercat.png'
    }

    if ("pull_request" in body) {
        var pullrequest = body.pull_request,
            branch = pullrequest.head.ref,
            jiraId = branch.split('-')[1],
            jiraURL= 'http://jira.metabroadcast.com/browse/MBST-'+jiraId;

        var message = new dispatcher('#anything-else', _message_options);
        message.write(pullrequest.user.login)
               .write('has made a pull request')
               .link(pullrequest.title+'.', pullrequest.html_url)
               .link('See this feature in Jira.', jiraURL)
               .send();
    }
}

router.route('/').post(function(req, res) {
    var _body = req.body || null;
    var _event = req.headers['x-github-event'] || null;

    // end the response here if any of the request data is missing
    if (!_body || !_event) {
        res.end('not enough data to continue');
        return;
    }
    if (_event === 'pull_request') {
        handle_pull_request(_body);
    }
    res.end('YaY');
});

module.exports = router;