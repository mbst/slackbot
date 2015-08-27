'use strict';
var _          = require('lodash');
var logger     = require('../../../internals/logger').jirabot;

//  Used for taking the request body and converting it to output a message string
//
//  @param taskdata {object}
//  @param featuredata {object} omitting this causes the data
//         to be treated as a parent feature, not an issue
//  @returns {string} slack message or empty string
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
  
  logger.log({'Sending': JSON.stringify(taskdata) });

  // construct the response string
  if (_.has(taskdata, 'user')) {
    output.push(taskdata.user.displayName);
    output.push('closed issue');
  } else {
    output.push('Issue closed');
  }

  output.push('<' + _.escape(browseURL+issue.key) + '|' + _.escape(issue.fields.summary) + '>');

  if (hasFeature) {
    output.push('in the feature');
    output.push('<' + _.escape(browseURL + featuredata.key) + '|' + _.escape(featuredata.fields.summary) + '>');
  }

  return output.join(' ');
};
