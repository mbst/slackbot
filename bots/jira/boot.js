'use strict';
var express    = require('express');
var logger     = require('../../internals/logger').jirabot;
var dispatcher = require('../../internals/dispatcher');
var Jira       = require('../../internals/jiraProvider');
var _          = require('lodash');
var router     = express.Router();


//  Used for taking the request body and filtering it to output a
//  message string
//
//  @param taskdata {object}
//  @param featuredata {object} omitting this causes the data
//         to be treated as a parent feature, not an issue
//  @returns {string} slack message or null
//
function formatter(taskdata, featuredata) {
  if (!_.isObject(taskdata)) {
    logger.error('formatter(taskdata, featuredata): taskdata argument must be a object');
    return;
  }

  var output      = [];
  var isFeature   = (_.isObject(featuredata))? false : true;
  var ev          = taskdata.webhookEvent;
  var user        = taskdata.user;
  var issue       = taskdata.issue;
  var resolution  = issue.fields.resolution || null;
  var browseURL   = 'http://jira.metabroadcast.com/browse/';
  var wording     = {};

  // construct the response string
  output.push(user.displayName);

  if ( ev === 'jira:issue_updated' ) {
    if ( _.isEmpty(resolution) ) {
      return;
    }else{
      output.push('has resolved');
    }
  } else {
    return;
  }

  wording.type = isFeature ? 'feature' : 'issue';
  output.push(wording.type);
  output.push('<'+_.escape(browseURL+issue.key)+'|'+_.escape(issue.fields.summary)+'>');

  if (! isFeature) {
    output.push('in the feature');
    output.push('<' + _.escape(browseURL+featuredata.key) + '|' + _.escape(featuredata.fields.summary) + '>');
  }

  return output.join(' ');
}


//  Listen for incoming hooks from jira
router.route('/').post( function(req, res) {
  var taskdata = req.body || null;
  if (_.isEmpty(taskdata)) {
    res.end();
    return;
  }

  var message_options = {
    username: 'Jira',
    color: '#053663',
    icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
  };
  var jira = new Jira();
  var message = new dispatcher('#mb-feeds', message_options);
  var parent_issue = taskdata.issue.fields.customfield_10400 || undefined;

  // determine if this request is for a top level feature or a child issue
  if (_.isString(parent_issue)) {
    // send as issue
    jira.getFeature(parent_issue).then(function(featuredata) {
      var response = formatter(taskdata, featuredata);
      if (response) {
        message.chatname = jira.getChatFromComponent(featuredata.fields.components);
        message.write(response).send();
      }
      res.end();
    }, function(err) {
      if (err) {
        logger.error(err);
      }
    });
  }else{
    // send as feature
    if (! _.has(taskdata.fields, 'components')) {
      logger.log('No components key in taskdata', taskdata);
      res.end();
      return;
    }
    var components = taskdata.fields.components ? taskdata.fields.components : null;
    message.chatname = jira.getChatFromComponent(components);
    var response = formatter(taskdata);
    if (response) {
      message.write(response).send();
    }
    res.end();
  }
});

// Listen for incoming hooks from jira support
router.route('/support').post( function(req, res) {
  var supportdata = req.body || null;
  if (_.isEmpty(supportdata)) {
    res.end();
    return;
  }

  var message_options = {
    username: 'Jira',
    color: '#053663',
    icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
  };
  var jira = new Jira();
  var message = new dispatcher('#mb-feeds', message_options);
  var parent_issue = supportdata.issue.fields.customfield_10400 || undefined;

  message.chatname = '#support';

  // determine if this request is for a top level feature or a child issue
  if (_.isString(parent_issue)) {
    // send as issue
    jira.getFeature(parent_issue).then(function(featuredata) {
      var response = formatter(supportdata, featuredata);
      if (response) {
        message.write(response).send();
      }
      res.end();
    }, function(err) {
      if (err) {
        logger.error(err);
      }
    });
  }else{
    // send as feature
    var response = formatter(supportdata);
    if (response) {
      message.write(response).send();
    }
    res.end();
  }
});

module.exports = router;
