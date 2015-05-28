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
    logger.error('formatter(*taskdata*, featuredata): taskdata argument must be a object');
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
