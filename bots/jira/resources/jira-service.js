'use strict';
var common  = require('../../../internals/common');
var logger  = require('../../../internals/logger').jirabot;
var _       = require('lodash');
var https   = require('https');
var Q       = require('q');


// Jira Provider
//
// Used as a client for interacting with the Jira api
//
function JiraProvider() {
  this.host = common.jira.host;
}


// Used for making secure http requests to jira
//
// @param path {string}
// @param type {string} 'GET' by default
//
JiraProvider.prototype.requestWithAuth = function(path, type, payload) {
  var defer = Q.defer();
  if (!_.isString(path)) {
    logger.error('path argument must be string');
    defer.reject();
    return defer.promise;
  }

  var _type = type || 'GET';
  var _host = this.host;
  var _auth = common.jira.auth.user+':'+common.jira.auth.password;
  
  var needsData = (_type === 'POST' || _type === "PUT");

  var options = {
    hostname: _host,
    path: path,
    method: _type,
    auth: _auth
  };
  
  var payloadStr;
  if (payload) {
    payloadStr = JSON.stringify(payload);
  }
  
  if (needsData && payload) {
    options.headers = {
      'Content-Type': 'application/json',
      'Content-Length': payloadStr.length
    };
  }

  var request = https.request(options, function(res) {
    var _body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      _body += chunk;
    });
    res.on('end', function() {
      defer.resolve(JSON.parse(_body));
    });
    res.on('error', function(err) {
      logger.error(err);
      defer.reject(err);
    });
  })
  .on('error', function(err) {
    logger.error(err);
    defer.reject(err);
  });

  if (needsData && payload) {
    request.write(payloadStr);
  }
  
  request.end();
  return defer.promise;
};


// Used for returning information about a feature from Jira
//
// @param featureId {string}
//
JiraProvider.prototype.getFeature = function (featureId) {
    var defer = Q.defer();
    if (!_.isString(featureId)) {
      var error = 'featureId argument must be a string';
      logger.error(error);
      defer.reject(error);
      return defer.promise;
    }

    var _endpoint = '/rest/api/2/issue/';
    this.requestWithAuth(_endpoint+featureId).then(
    function (data) {
      if ('errorMessages' in data) {
        logger.error(data.errorMessages);
        defer.reject(data.errorMessages);
      } else {
        defer.resolve(data);
      }
    },
    defer.reject);

    return defer.promise;
};


// Used for taking a string that might or might not contain a Jira feature
// ID, and spitting out a result if it does
//
// @param string {string}
//
JiraProvider.prototype.getFeatureFromString = function (string) {
  var defer = Q.defer();
  if (!_.isString(string)) {
    var error = 'string must be a ... string';
    logger.error(error);
    defer.reject(new Error(error));
    return defer.promise;
  }
  if (string.toUpperCase().indexOf('MBST-') >= 0) {
    var jiraId  = string.split('-')[1];
    this.getFeature('MBST-'+jiraId).then(defer.resolve, defer.reject);
  }else{
    defer.reject(null);
  }

  return defer.promise;
};


// Used for figuring out the chat name based on the Jira component
//
// @param components {array} the components array sent from Jira
//
JiraProvider.prototype.getChatFromComponent = function (components) {
  if (! _.isArray(components)) {
    return null;
  }
  var name = (components.length) ? components[0].name : null;
  var chatname;
  // turn component name into a chat name string
  // eg. Metabroadcast.com -> #metabroadcast-com
  chatname = '#' + name.toLowerCase().replace(/[\.\s*]/, '-');
  return chatname;
};


// Used for posting to the Jira API, to make a new ticket
//
// @param 
// @param 
// 
JiraProvider.prototype.createTicket = function (summary, projectKey, assignee, estimate) {
  var self = this;
  
  if (! _.isString(summary) || 
      ! _.isString(assignee.firstName) || 
      ! _.isString(estimate)) {
    logger.warn({message: 'Could not create ticket becasue summary, assignee and estimate should all be valid strings', args: arguments, });
    return false;
  }
  
  var payload = {
    fields: {
      summary: summary,
      description: '',
      assignee: { 
        name: assignee.firstName
      },
      project: {
        key: 'MBST'
      },
      issuetype: {
        name: 'Task'
      },
      timetracking: {
        originalEstimate: estimate
      }
    }
  };
  
  if (projectKey) {
    payload.parent = { 
      key: projectKey
    };
  }
  
  var endpoint = '/rest/api/2/issue/';
  
  return new Promise( function (resolve, reject) {
    self.requestWithAuth(endpoint, 'POST', payload).then(function (res) {
      resolve(res);
    }, reject);
  });
};


module.exports = JiraProvider;
