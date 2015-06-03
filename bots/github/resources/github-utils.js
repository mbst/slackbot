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
      username: 'Pull Request - GitHub',
      color: '#333',
      icon_url: 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png'
    };


    if ("pull_request" in body) {
        var pullrequest     = body.pull_request;
        var state           = pullrequest.state;
        var branch          = pullrequest.head.ref;
        var message         = new Dispatcher('#pull-requests', _message_options);
        var jira            = new Jira();

        if (state !== 'open') {
          return;
        }

        // start constructing the pull request message
        message.write(pullrequest.title)
               .break()
               .bold('Branch: ')
               .link(branch, pullrequest.html_url);

        // TODO: User request (to get github username)

        console.log('GH-----');
        console.log(JSON.stringify(body));
        console.log('/GH----');

        // find the feature in Jira so we can add the feature info to the
        // message, otherwise just send the message without the jira link
        jira.getFeatureFromString(branch).then(
        function(feature) {
          var feature_title = feature.fields.summary,
              feature_key = feature.key,
              jiraURL = 'http://jira.metabroadcast.com/browse/'+feature_key;

          message.break()
                 .bold('Feature: ')
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
