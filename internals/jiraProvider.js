'use strict';
var common          = require('./common'),
    logger          = require('./logger').jirabot,
    _               = require('lodash'),
    https           = require('https'),
    Q               = require('q');


//  Jira Provider
//
//  Used as a client for interacting with the Jira api
//
function JiraProvider() {
  this.host = common.jira.host;
}


//  Used for making secure http requests to jira
//
//  @param path {string}
//  @param type {string} 'GET' by default
//
JiraProvider.prototype.requestWithAuth = function(path, type) {
  var defer = Q.defer();
  if (!_.isString(path)) {
    var error = 'path argument must be string';
    logger.error(error);
    defer.reject(error);
    return defer.promise;
  }

  var _type = type || 'GET';
  var _host = this.host;
  var _auth = common.jira.auth.user+':'+common.jira.auth.password;

  var options = {
    hostname: _host,
    path: path,
    method: _type,
    auth: _auth
  };

  https.request(options, function(res) {
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
  })
  .end();

  return defer.promise;
};


//  Used for returning information about a feature from Jira
//
//  @param featureId {string}
//
JiraProvider.prototype.getFeature = function(featureId) {
    var defer = Q.defer();
    if (!_.isString(featureId)) {
        var error = 'featureId argument must be a string';
        logger.error(error);
        defer.reject(error);
        return defer.promise;
    }

    var _endpoint = '/rest/api/2/issue/';
    this.requestWithAuth(_endpoint+featureId).then(function(data) {
        if ('errorMessages' in data) {
            defer.reject(data.errorMessages);
        }else{
            defer.resolve(data);
        }
    }, defer.reject);

    return defer.promise;
};


//  Used for taking a string that might or might not contain a Jira feature
//  ID, and spitting out a result if it does
//
//  @param string {string}
//
JiraProvider.prototype.getFeatureFromString = function(string) {
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


//  Used for figuring out the chat name based on the Jira component
//
//  @param components {array} the components array sent from Jira
//
JiraProvider.prototype.getChatFromComponent = function(components) {
  var _default = 'mb-feeds';
  if (!_.isArray(components)) {
    return _default;
  }
  var name = (components.length) ? components[0].name : _default;
  var chatname;
  // turn component name into a chat name string
  // eg. Metabroadcast.com -> #metabroadcast-com
  chatname = '#' + name.toLowerCase().replace(/[\.\s*]/, '-');
  return chatname;
};

module.exports = JiraProvider;
