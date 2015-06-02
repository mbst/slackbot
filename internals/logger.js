'use strict';
var bunyan  = require('bunyan');
var utils   = require('./utils');
var _       = require('lodash');
var fs = require('fs');

var LOG_EXTENTION = '.json';
var LOGS_PATH = __dirname + '/../logs/';

(function _setupLogsDir () {
  fs.mkdir(LOGS_PATH, function () {
    console.log('Logs dir created');
  });
})();

//  the logger is for... logging. it keeps track of all
//  logging processes in a single location, and uses
//  bunyan to do most of the hard work
//
//  @param logname {string} name of the log file that will be saved in /logs
function Logger(logname, options) {
  options = _.isObject(options) ? options : {};
  var self = this;
  var _logname = logname || "internals";

  var logConfig = _.assign({
    name: _logname,
    streams: [{
      type: 'rotating-file',
      path: LOGS_PATH + _logname + LOG_EXTENTION,
      period: '30d'
    }]
  }, options);

  var log = bunyan.createLogger( logConfig );
  self.logger = log;
}


//  for writing normally to the log. uses bunyan info
//
//  @param content {string} what you want to be logged
Logger.prototype.log = function (/*args*/) {
  if (! _.isString(arguments[0])) {
    return;
  }
  this.logger.info(arguments);
};


//  For writing when in dev mode. Will only output to the console
//
//  @param content {string} what you want to be logged
Logger.prototype.dev = function (content) {
  if (! _.isString(content) ||
      ! utils.isDev()) {
    return;
  }
  this.console(content);
};


Logger.prototype.console = function (/*args*/) {
  console.log(arguments);
};


//  for writing a warning to the log. uses bunyan info
//
//  @param content {string} what you want to be logged
Logger.prototype.warn = function (/*args*/) {
  if (!_.isString(arguments[0])) {
    return;
  }
  this.logger.warn(arguments);
};


//  for writing errors to the log. uses bunyan warn
//
//  @param content {string} what you want to be logged
Logger.prototype.error = function (/*args*/) {
  if (!_.isString(arguments[0])) {
    return false;
  }
  this.logger.error(arguments);
};


Logger.prototype.loggers = {
  test: new Logger('test'),
  messages: new Logger('messages'),
  internals: new Logger('internals'),
  jirabot: new Logger('jirabot'),
  testbot: new Logger('testbot'),
  githubbot: new Logger('github'),
  bitbucketbot: new Logger('bitbucket'),
  pagerdutybot: new Logger('pagerduty')
};


module.exports = Logger.prototype.loggers;
