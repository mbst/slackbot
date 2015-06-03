'use strict';
var express    = require('express');
var _          = require('lodash');
var logger     = require('../../internals/logger').jirabot;
var Dispatcher = require('../../internals/dispatcher');
var Jira       = require('./resources/jira-service');
var jiraUtils  = require('./resources/jira-utils');

var router     = express.Router();

var message_options = {
  username: 'Jira',
  color: '#053663'
};
var message = new Dispatcher('#mb-feeds', message_options);
message.avatar('http://i.imgur.com/nB41VgE.png');

router.route('/').post( function(req, res) {
  var taskdata = req.body || null;
  if (_.isEmpty(taskdata)) {
    logger.warn('Taskdata object empty. Body:', req.body);
    res.end();
    return;
  }

  var jira = new Jira();
  var parent_issue = taskdata.issue.fields.customfield_10400 || undefined; // <- Who do you blame for a key name like that?

  // determine if this request is for a top level feature or a child issue
  if (_.isString(parent_issue)) {

    jira.getFeature(parent_issue).then(function(featuredata) {
      var response = jiraUtils.formatter(taskdata, featuredata);
      if (response) {
        var chatname = jira.getChatFromComponent(featuredata.fields.components);
        message.chat(chatname);
        message.write(response)
               .send();
      }
      res.end();
    }, function(err) {
      if (err) {
        logger.error(err);
      }
    });

  } else {

    // send as feature
    if (! _.has(taskdata.fields, 'components')) {
      logger.log('No components key in taskdata', taskdata);
      res.end();
      return;
    }
    var components = taskdata.fields.components ? taskdata.fields.components : null;
    message.chat(jira.getChatFromComponent(components));
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

  // Logging this for now
  logger.log({'support_data': JSON.stringify(supportdata) });

  var jira = new Jira();
  var parent_issue = supportdata.issue.fields.customfield_10400 || undefined;

  message.chat('#support')
         .botname('Support - Jira');

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
