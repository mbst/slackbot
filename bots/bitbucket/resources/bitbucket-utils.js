'use strict';
var _          = require('lodash');
var logger     = require('../../../internals/logger').bitbucketbot;
var Dispatcher = require('../../../internals/dispatcher');
var Jira       = require('../../jira/resources/jira-service');

module.exports.handlePullRequest = function handlePullRequest (body) {
    var _message_options = {
        username: 'Bitbucket',
        color: '#205081',
        icon_url: 'https://www.vectorbase.org/sites/default/files/ftp/Landing_page_icons/Downloads_icons/bitbucket_logo.png'
    }

    var _pr                 = body.pullrequest_created,
        _pr_title           = _pr.title,
        _branch             = _pr.source.branch.name,
        _destination_branch = _pr.destination.branch.name;

    var message = new Dispatcher('#pull-requests', _message_options),
        jira = new Jira();

    // start constructing the pull request message
    message.write(_pr.author.display_name)
           .write('has made a pull request to merge branch')
           .link(_branch, _pr.links.html.href)
           .write('into')
           .write(_destination_branch);

    // find the feature in jira from the branch name, otherwise just send the message
    jira.getFeatureFromString(_branch).then(function(feature) {
        var feature_title = feature.fields.summary,
            feature_key = feature.key,
            jiraURL = 'http://jira.metabroadcast.com/browse/'+feature_key;
        message.write('in the feature')
               .link(feature_title, jiraURL)
               .send();
    }, function (err) {
        if (err) logger.error(err);
        message.send();
    })
}
