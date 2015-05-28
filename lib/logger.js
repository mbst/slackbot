'use strict';
var winston = require('winston');
var _       = require('lodash');
var fs      = require('fs');
var Q       = require('q');


//  the logger is for... logging. it keeps track of all
//  logging processes in a single location, and uses
//  winston to do most of the hard work
//
//  @param logname {string} name of the log file that will be saved in /logs
function Logger(logname) {
  var self = this;
  var _logspath = './logs/';
  var _logname = logname || "general";

  self._checkLogDir(_logspath).then(
  function () {
    self.logname = _logname;
    self.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)(
              { filename: _logspath+_logname+'.log' }
            )
        ]
    });

  });
}


Logger.prototype._checkLogDir = function (path) {
  var self = this;
  var defer = Q.defer();

  fs.readdir(path, function (err) {
    if (err) {
      self._createLogDir(path).then(
      function () {
        defer.resolve();
      });
    }
    defer.resolve();
  });

  return defer.promise;
};


Logger.prototype._createLogDir = function (path) {
  var defer = Q.defer();
  fs.mkdir(path, defer.resolve);
  return defer.promise;
};


//  for writing normally to the log. uses winston.info
//
//  @param content {string} what you want to be logged
Logger.prototype.log = function(content) {
    if (!_.isString(content)) {
      return;
    }
    this.logger.info(content);
};


//  for writing errors to the log. uses winston.warn
//
//  @param content {string} what you want to be logged
Logger.prototype.error = function(content) {
    if (!_.isString(content)) {
      return false;
    }
    this.logger.warn(content);
};


Logger.prototype.loggers = {
    general: new Logger('slackbot'),
    jirabot: new Logger('jirabot'),
    testbot: new Logger('testbot'),
    githubbot: new Logger('github'),
    bitbucketbot: new Logger('bitbucket'),
    pagerdutybot: new Logger('pagerduty')
};


module.exports = Logger.prototype.loggers;
