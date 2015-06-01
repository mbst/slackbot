'use strict';
var winston = require('winston');
var utils   = require('./utils');
var _       = require('lodash');
var fs      = require('fs');
var Q       = require('q');

var LOG_EXTENTION = '.log';
var LOGS_PATH = __dirname + '/../logs/';;

//  the logger is for... logging. it keeps track of all
//  logging processes in a single location, and uses
//  winston to do most of the hard work
//
//  @param logname {string} name of the log file that will be saved in /logs
function Logger(logname) {
  var self = this;
  var _logname = logname || "global";

  self._checkLog(LOGS_PATH, _logname).then(
  function () {
    self.logname = _logname;
      self.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)(),
          new (winston.transports.File)(
            { filename: LOGS_PATH + _logname + LOG_EXTENTION }
          )
        ]
      });
  });
}


Logger.prototype._checkLog = function (path, file) {
  var self = this;
  var defer = Q.defer();

  var completed = function () {
    fs.open(path + '/' + file + LOG_EXTENTION, 'w',
    function () {
      // self.dev('Creating log file: ' + path + file + LOG_EXTENTION);
      defer.resolve();
    });
  };

  fs.readdir(path, function (err) {
    if (err) {
      self._createLogDir(path).then( completed );
    } else {
      completed();
    }
  });

  return defer.promise;
};


Logger.prototype._createLogDir = function (path) {
  var defer = Q.defer();
  fs.mkdir(path, function () {
    fs.chmod(path, '777', defer.resolve);
  });
  return defer.promise;
};


//  for writing normally to the log. uses winston.info
//
//  @param content {string} what you want to be logged
Logger.prototype.log = function(content) {
  if (!_.isString(content)) {
    return;
  }
  console.log(content);
  return;

  this.logger.info(content);
};


//  For writing when in dev mode. Will only output to the console
//
//  @param content {string} what you want to be logged
Logger.prototype.dev = function(content) {
  if (! _.isString(content) ||
      ! utils.isDev()) {
    return;
  }
  console.log(content);
};


//  for writing a warning to the log. uses winston.info
//
//  @param content {string} what you want to be logged
Logger.prototype.warn = function(content) {
  if (!_.isString(content)) {
    return;
  }
  console.warn(content);
  return;

  this.logger.warn(content);
};


//  for writing errors to the log. uses winston.warn
//
//  @param content {string} what you want to be logged
Logger.prototype.error = function(content) {
  if (!_.isString(content)) {
    return false;
  }
  console.error(content);
  return;

  this.logger.error(content);
};


Logger.prototype.loggers = {
  internals: new Logger('internals'),
  jirabot: new Logger('jirabot'),
  testbot: new Logger('testbot'),
  githubbot: new Logger('github'),
  bitbucketbot: new Logger('bitbucket'),
  pagerdutybot: new Logger('pagerduty')
};


module.exports = Logger.prototype.loggers;
