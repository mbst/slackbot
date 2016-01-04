'use strict';
var express    = require('express');
var _          = require('lodash');
var logger     = require('../../internals/logger').jirabot;
var Dispatcher = require('../../internals/dispatcher');
var Jira       = require('./resources/jira-service');
var jiraUtils  = require('./resources/jira-utils');
var commands   = require('./commands');
var util       = require('util');

var router     = express.Router();

// TODO: refactor this into a single route listener, with :type attribute

var jiraToken = '2284aadb429768ab53a57660b883ff5e';

router.route('/:token').post( function(req, res) {

  var suppliedToken = req.params.token;
  if (suppliedToken !== jiraToken) {
    logger.warn('Incorrect access token provided.');
    res.end();
    return;
  }

  var taskdata = req.body || null;
  if (_.isEmpty(taskdata)) {
    logger.warn('Taskdata object empty. Body:', req.body);
    res.end();
    return;
  }

  console.log(util.inspect(taskdata, false, null));

  var message_options = {
    username: 'Jira',
    color: '#0077c3'
  };
  var message = new Dispatcher('#mb-feeds', message_options);
  message.avatar('http://i.imgur.com/nB41VgE.png');
  
  // logger.log( { 'ticket_data': JSON.stringify(taskdata) } );

  var jira = new Jira();
  var parent_issue = taskdata.issue.fields.customfield_10400 || undefined; // <- Who do you blame for a key name like that?

  var issue       = taskdata.issue;
  var ev          = taskdata.webhookEvent;
  var resolution  = issue.fields.resolution;
  var isReply     = _.has(taskdata, 'comment');
  var isUpdated   = ev === 'jira:issue_updated';

  // Only allow resolutions through
  if (! isUpdated ||
      ! resolution ||
      isReply) {
    res.end();
    return;
  }
  
  // determine if this request is for a top level feature or a child issue
  if (_.isString(parent_issue)) {
    
    jira.getFeature(parent_issue).then(
    function(featuredata) {
      var response = jiraUtils.formatter(taskdata, featuredata);
      
      if (! response) {
        logger.warn({'message': 'No response could be made for ticket'});
        res.end();
        return;
      }
      
      var chatname = jira.getChatFromComponent(featuredata.fields.components);
      message.chat(chatname)
             .write(response)
             .send();
      res.end();
    }, 
    function(err) {
      if (err) {
        logger.error(err);
      }
    });

  } else {

    // send as feature    
    if (! _.has(taskdata.issue.fields, 'components')) {
      logger.log({'message': 'No components key in taskdata', 'webhook_data': taskdata});
      message.chat('mb-feeds');
    } else {
      var components = taskdata.issue.fields.components ? taskdata.issue.fields.components : null;
      var chatname = jira.getChatFromComponent(components);
      message.chat( chatname );
    }
    
    var response = jiraUtils.formatter(taskdata);
    if (! response) {
      logger.warn({'message': 'No response could be made for ticket'});
      res.end();
      return;
    }
    
    message.write(response)
           .send();
    res.end();
  }
});

var jiraSuppToken = '05ce82aaaa4a0d137b57dcb947fbab24';
// Listen for incoming hooks from jira support
router.route('/support/:token').post( function(req, res) {

  var suppliedToken = req.params.token;
  if (suppliedToken !== jiraSuppToken) {
    logger.warn('Incorrect access token provided.');
    res.end();
    return;
  }

  var supportdata = req.body || null;
  if (_.isEmpty(supportdata)) {
    res.end();
    return;
  }

  var message_options = {
    username: 'Support - Jira',
    color: '#053663'
  };
  var message = new Dispatcher('#support', message_options);
  message.avatar('http://i.imgur.com/nB41VgE.png');

  logger.log({'support_data': JSON.stringify(supportdata) });

  var jira = new Jira();
  var parent_issue = supportdata.issue.fields.customfield_10400 || undefined;

  var issue         = supportdata.issue;
  var ev            = supportdata.webhookEvent;
  var resolution    = issue.fields.resolution;
  var isReply       = _.has(supportdata, 'comment');
  var isCreated     = ev === 'jira:issue_created';
  var isUpdated     = ev === 'jira:issue_updated';
  
  // Only allow new issues and resolutions through
  if (! isCreated && ! isUpdated) {
    res.end();
    return;
  }
  if (isUpdated && 
     (! resolution || isReply)) {
    res.end();
    return;
  }
  
  // determine if this request is for a top level feature or a child issue
  if (_.isString(parent_issue)) {
    // send as issue
    jira.getFeature(parent_issue).then(function(featuredata) {
      var response = jiraUtils.formatter(supportdata, featuredata);
      if (response) {
        message.write(response).send();
      }
      res.end();
    }, 
    function(err) {
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

module.exports = { webhook: router, command: commands };
