'use strict';
var express     = require('express');
var common      = require('../../internals/common');
var logger      = require('../../internals/logger').githubbot;
var dispatcher  = require('../../internals/dispatcher');
var router      = express.Router();
var _           = require('lodash');
var Jira        = require('../../internals/jiraProvider');
var q           = require('q');

//  For dealing with a pull request and sending to the correct chat
//
//  @param body {object} the body of the request
//
function handle_pull_request(body) {
    var _message_options = {
        username: 'GitHub',
        color: '#333',
        icon_url: 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png'
    }

    if ("pull_request" in body) {
        var pullrequest     = body.pull_request,
            branch          = pullrequest.head.ref,
            default_branch  = body.repository.default_branch,
            message         = new dispatcher('#pull-requests', _message_options),
            jira            = new Jira();

        // start constructing the pull request message
        message.write(pullrequest.user.login)
               .write('has made a pull request to merge branch')
               .link(branch, pullrequest.html_url)
               .write('into')
               .write(default_branch)
               .write('['+pullrequest.commits+' commits]');

        // find the feature in Jira so we can add the feature info to the
        // message, otherwise just send the message without the jira link
        jira.getFeatureFromString(branch).then(function(feature) {
            var feature_title = feature.fields.summary,
                feature_key = feature.key,
                jiraURL = 'http://jira.metabroadcast.com/browse/'+feature_key;

            message.write('in the feature')
                   .link(feature_title, jiraURL)
                   .send();
        }, function(err) {
            if (err) logger.error(err);
            message.send();
        });
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

    // based on github event header, decide what to do with the request
    switch (_event) {
        case 'pull_request':
            handle_pull_request(_body);
            break;

        case 'ping':
            logger.log('Ping');
            break;
    }
    res.end();
});

module.exports = router;
