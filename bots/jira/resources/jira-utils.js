'use strict';
var _          = require('lodash');
var logger     = require('../../../internals/logger').jirabot;
var slackUtils = require('../../../internals/slack-utils'); 
var Promise    = require('promise');


// Used for taking the request body and converting it to output a message string
//
// @param taskdata {object}
// @param featuredata {object} omitting this causes the data
//        to be treated as a parent feature, not an issue
// @returns {string} slack message or empty string
//
module.exports.formatter = function formatter (taskdata, featuredata) {
  if (!_.isObject(taskdata)) {
    logger.warn('formatter(*taskdata*, featuredata): taskdata argument must be a object');
    return '';
  }

  var output      = [];
  var hasFeature  = _.isObject(featuredata);
  var issue       = taskdata.issue;
  var browseURL   = 'http://jira.metabroadcast.com/browse/';

  // construct the response string
  
  var action = taskdata.webhookEvent.split('_');
  if (action[1]) {
    action = action[1];
  } else {
    action = 'modified';
  }

  try {
    if (action === 'updated' && taskdata.changelog.items[0]['toString'] === 'Resolved') {
      action = 'resolved';
    }
    logger.log(taskdata.changelog.items[0]['toString'])
  } catch(e) {
    logger.log(' could not find toString ');
  }

  if (_.has(taskdata, 'user')) {
    output.push(taskdata.user.displayName);
    output.push(action +' issue');
  } else {
    output.push('Issue ' + action);
  }

  output.push('<' + _.escape(browseURL+issue.key) + '|' + _.escape(issue.fields.summary) + '>');

  if (hasFeature) {
    output.push('in the feature');
    output.push('<' + _.escape(browseURL + featuredata.key) + '|' + _.escape(featuredata.fields.summary) + '>');
  }

  return output.join(' ');
};


// The ticket parser is for taking a string and returning a standard object based
// on the contents of the string
//
// @param ticketString {String}
// @param username {String}
// @returns {Object}
//    summary: {String},
//    projectKey: {String},
//    assignee: {String},
//    estimate: {String}
//
module.exports.ticketParser = function (ticketString, username) {
  if (! _.isString(ticketString)) {
    logger.error({message: 'Can\'t parse ticket, as its not a string', ticket: ticketString });
    return false;
  }
  
  if (! _.isString(username)) {
    logger.error({message: 'Can\'t parse ticket, as username is not a string', username: username });
    return false;
  }
  
  // We know that three arguments, at least, are required
  var parts = ticketString.split(',');
  if (parts.length < 3 ) {
    logger.warn('Not enough args given for ticket');
    return false;
  }
  
  return new Promise(function (resolve, reject) {
    var output = {
      summary: '',
      projectKey: '',
      assignee: '',
      estimate: ''
    };
    
    var assignee = '';
    var summary = ''; 
    var projectKey = ''; 
    var estimate = '';
    
    assignee = parts[0].trim();
    summary = parts[1].trim();
    
    if (parts.length === 3) {
      estimate = parts[2].trim();
    } else {
      projectKey = parts[2].trim();
      estimate = parts[3].trim();
    }
    
    output.summary = summary;
    output.projectKey = projectKey;
    output.estimate = estimate;
    
    if (assignee) {
      if (assignee === 'me') {
        assignee = username;
      }
      
      var getUser = slackUtils.getUser(assignee);
      
      if (! getUser) {
        var err = 'Not able to find user: ' + assignee;
        logger.error(err);
        reject(err);
        return;
      }
      
      getUser.then(
      function (user) {
        output.assignee = {
          firstName: user.profile.first_name,
          lastName: user.profile.last_name,
          fullName: user.real_name
        };
        resolve(output);
      }, reject);
      
    } else {
      reject('Assignee is required');
      return;
    }
  });
};
