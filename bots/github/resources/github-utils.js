'use strict';
var https        = require('https');
var _           = require('lodash');
var logger      = require('../../../internals/logger').githubbot;
var Dispatcher  = require('../../../internals/dispatcher');
var Jira        = require('../../jira/resources/jira-service');
var Promise     = require('promise');


function getUserDetails (username) {
  return new Promise(function (resolve, reject) {
    if (! _.isString(username)) {
      logger.warn('User details can\'t be gotten. `username` is not a string.');
      reject();
      return;
    }

    var options = {
      method: 'GET',
      hostname: 'api.github.com',
      path: '/users/' + username,
      agent: false,
      headers: {
        'User-Agent': 'mbst/slackbot'
      }
    };

    var usersRequest = https.request(options,
    function (res) {
      res.setEncoding('utf8');
      var responseBody = '';

      res.on('data', function (chunk) {
        responseBody += chunk;
      });

      res.on('end', function () {
        resolve(JSON.parse(responseBody));
      });
    });

    usersRequest.on('error', function (err) {
      logger.error(err);
      reject();
    });

    usersRequest.end();
  });
}



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
      var repo            = body.repository;
      var user            = pullrequest.user;
      var state           = pullrequest.state;
      var action          = body.action;
      var branch          = pullrequest.head.ref;
      var message         = new Dispatcher('#pull-requests', _message_options);
      var jira            = new Jira();

      if (state !== 'open' &&
          action !== 'opened' &&
          action !== 'reopened') {
        return;
      }

      getUserDetails(user.login).then(
      function (userObj) {
        // start constructing the pull request message
        message.write(pullrequest.title)
               .write('By: ')
               .write(userObj.name)
               .break()
               .write('Repo: ')
               .link(repo.full_name, repo.html_url).bold()
               .break()
               .write('Branch: ')
               .link(branch, pullrequest.html_url);
        return;
      }).then(
      function () {
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
      });
    }
};
