'use strict';
var _          = require('lodash');
var logger     = require('../../../internals/logger').jirabot;

//  Used for taking the request body and converting it to output a message string
//
//  @param taskdata {object}
//  @param featuredata {object} omitting this causes the data
//         to be treated as a parent feature, not an issue
//  @returns {string} slack message or null
//
module.exports.formatter = function formatter (taskdata, featuredata) {
  if (!_.isObject(taskdata)) {
    logger.warn('formatter(*taskdata*, featuredata): taskdata argument must be a object');
    return '';
  }

  var output      = [];
  var hasFeature   = _.isObject(featuredata);
  var ev          = taskdata.webhookEvent;
  var user        = taskdata.user;
  var issue       = taskdata.issue;
  var resolution  = issue.fields.resolution || null;
  var browseURL   = 'http://jira.metabroadcast.com/browse/';

  // construct the response string
  output.push(user.displayName);

  if ( ev !== 'jira:issue_updated' ||
      _.isEmpty(resolution) ||
      ! _.has(issue, 'fields')) {
    return;
  }

  var statusString = issue.fields.status.name;

  if (statusString !== 'Closed' ||
      statusString !== 'Resolved') {
    logger.log({ 'Status': statusString, 'notSent': taskdata });
    return;
  }

  console.log(statusString.toLowerCase());
  logger.log({'Sending': taskdata });
  output.push('has ' + statusString.toLowerCase());
  output.push('issue');
  output.push('<' + _.escape(browseURL+issue.key) + '|' + _.escape(issue.fields.summary) + '>');

  if (hasFeature) {
    output.push('in the feature');
    output.push('<' + _.escape(browseURL + featuredata.key) + '|' + _.escape(featuredata.fields.summary) + '>');
  }

  return output.join(' ');
};
