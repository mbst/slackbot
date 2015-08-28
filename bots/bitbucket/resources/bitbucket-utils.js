'use strict';
var _          = require('lodash');
var logger     = require('../../../internals/logger').bitbucketbot;
var Dispatcher = require('../../../internals/dispatcher');
var Jira       = require('../../jira/resources/jira-service');

module.exports.handlePullRequest = function handlePullRequest (body) {
    var _message_options = {
        username: 'Pull Request - BitBucket',
        color: '#205081',
        icon_url: 'https://www.vectorbase.org/sites/default/files/ftp/Landing_page_icons/Downloads_icons/bitbucket_logo.png'
    };

    var pr         = body.pullrequest;
    var repo       = body.repository;
    var prTitle    = pr.title;
    var branchName = pr.source.branch.name;

    var message = new Dispatcher('#pull-requests', _message_options);
    var jira = new Jira();

    // start constructing the pull request message
    message.bold(prTitle)
           .break()
           .write('By: ')
           .write(pr.author.display_name)
           .break()
           .write('Repo: ')
           .link(repo.name, repo.links.html.href).bold()
           .break()
           .write('Branch: ')
           .link(branchName, pr.links.html.href);

    // find the feature in jira from the branch name, otherwise just send the message
    jira.getFeatureFromString(branchName).then(
    function(feature) {
      var feature_title = feature.fields.summary;
      var feature_key = feature.key;
      var jiraURL = 'http://jira.metabroadcast.com/browse/' + feature_key;
      
      message.break()
             .bold('Feature: ')
             .link(feature_title, jiraURL)
             .send();
    },
    function (err) {
      if (err) {
        logger.error(err);
      }
      message.send();
    });
};
