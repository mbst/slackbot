'use strict';
var _           = require('lodash');
var logger      = require('../../../internals/logger').githubbot;
var Dispatcher  = require('../../../internals/dispatcher');
var Jira        = require('../../jira/resources/jira-service');


//  For dealing with a pull request and sending to the correct chat
//
//  @param body {object} the body of the request
//
module.exports.handlePullRequest = function handlePullRequest (body) {
    var _message_options = {
        username: 'GitHub',
        color: '#333',
        icon_url: 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png'
    };



    if ("pull_request" in body) {
        var pullrequest     = body.pull_request;
        var branch          = pullrequest.head.ref;
        var default_branch  = body.repository.default_branch;
        var message         = new Dispatcher('#pull-requests', _message_options);
        var jira            = new Jira();

        // start constructing the pull request message
        message.write(pullrequest.user.login)
               .write('has made a pull request to merge branch')
               .link(branch, pullrequest.html_url)
               .write('into')
               .write(default_branch)
               .write('['+pullrequest.commits+' commits]');

        // find the feature in Jira so we can add the feature info to the
        // message, otherwise just send the message without the jira link
        jira.getFeatureFromString(branch).then(
        function(feature) {
          var feature_title = feature.fields.summary,
              feature_key = feature.key,
              jiraURL = 'http://jira.metabroadcast.com/browse/'+feature_key;

          message.write('in the feature')
                 .link(feature_title, jiraURL)
                 .send();
        },
        function(err) {
          if (err) {
            logger.error(err);
          }
          message.send();
        });
    }
};
