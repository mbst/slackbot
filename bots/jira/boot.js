'use strict';
var express    = require('express');
var _          = require('lodash');
var logger     = require('../../internals/logger').jirabot;
var Dispatcher = require('../../internals/dispatcher');
var Jira       = require('./resources/jira-service');
var jiraUtils  = require('./resources/jira-utils');

var router     = express.Router();


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
  var message = new Dispatcher('#mb-feeds', message_options);
  var parent_issue = taskdata.issue.fields.customfield_10400 || undefined; // <- Who do you blame for a key name like that?

  // determine if this request is for a top level feature or a child issue
  if (_.isString(parent_issue)) {
    // send as issue
    jira.getFeature(parent_issue).then(function(featuredata) {
      var response = jiraUtils.formatter(taskdata, featuredata);
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
    var response = jiraUtils.formatter(taskdata);
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
  var message = new Dispatcher('#mb-feeds', message_options);
  var parent_issue = supportdata.issue.fields.customfield_10400 || undefined;

  message.chatname = '#support';

  // determine if this request is for a top level feature or a child issue
  if (_.isString(parent_issue)) {
    // send as issue
    jira.getFeature(parent_issue).then(function(featuredata) {
      var response = jiraUtils.formatter(supportdata, featuredata);
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
    var response = jiraUtils.formatter(supportdata);
    if (response) {
      message.write(response).send();
    }
    res.end();
  }
});

module.exports = router;
