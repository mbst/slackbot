'use strict';
var express     = require('express'),
    common      = require('../lib/common'),
    logger      = require('../lib/logger').githubbot,
    router      = express.Router(),
    dispatcher  = require('../lib/dispatcher'),
    _           = require('lodash'),
    Jira        = require('../lib/jiraProvider'),
    q           = require('q');

//  For dealing with a pull request and sending to the correct chat
//
//  @param body {object} the body of the request
//
function handle_pull_request(body) {
    var _message_options = {
        username: 'Github',
        color: '#333',
        icon_url: 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png'
    }
    if ("pull_request" in body) {
        var pullrequest     = body.pull_request,
            branch          = pullrequest.head.ref,
            default_branch  = body.repository.default_branch,
            jiraId          = branch.split('-')[1],
            jiraURL         = 'http://jira.metabroadcast.com/browse/MBST-'+jiraId,
            jira            = new Jira(),
            message         = new dispatcher('#pull-requests', _message_options);

        // start constructing the pull request message
        message.write(pullrequest.user.login)
               .write('has made a pull request to merge branch')
               .link(branch, pullrequest.html_url)
               .write('into')
               .write(default_branch)
               .write('['+pullrequest.commits+' commits]')

        console.log('hero');
        // find the feature in Jira so we can add the feature info to the message
        jira.getFeature('MBST-'+jiraId).then(function(feature) {
            var feature_title = feature.fields.summary;
            message.write('in the feature')
                   .link(feature_title, jiraURL)
                   .send();
        }, function(err) {
            logger.log(err);
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
    if (_event === 'pull_request') {
        handle_pull_request(_body);
    }
    res.end();
});

module.exports = router;