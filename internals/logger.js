'use strict';
var bunyan  = require('bunyan');
var botUtils= require('./utils');
var _       = require('lodash');
var fs      = require('fs');

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
      period: '7d'
    }]
  }, options);

  var log = bunyan.createLogger( logConfig );
  self.logger = log;
}


//  for writing normally to the log. uses bunyan info
//
//  @param content {string} what you want to be logged
Logger.prototype.log = function (content) {
  if (botUtils.isDev()) {
    console.log(content); // TODO: use arguments with .call()
  } else {
    this.logger.info(content);
  }
};


//  For writing when in dev mode. Will only output to the console
//
//  @param content {string} what you want to be logged
Logger.prototype.dev = function (content) {
  if (! botUtils.isDev()) {
    return;
  }
  this.console(content);
};


Logger.prototype.console = function (content) {
  console.log(content);
};


//  for writing a warning to the log. uses bunyan info
//
//  @param content {string} what you want to be logged
Logger.prototype.warn = function (content) {
  if (botUtils.isDev()) {
    console.warn(content);
  } else {
    this.logger.warn(content);
  }
};


//  for writing errors to the log. uses bunyan warn
//
//  @param content {string} what you want to be logged
Logger.prototype.error = function (content) {
  if (botUtils.isDev()) {
    console.error(content);
  } else {
    this.logger.error(content);
  }
};


Logger.prototype.loggers = {
  abed: new Logger('abed'),
  test: new Logger('test'),
  messages: new Logger('messages'),
  internals: new Logger('internals'),
  jirabot: new Logger('jira'),
  githubbot: new Logger('github'),
  bitbucketbot: new Logger('bitbucket'),
  pagerdutybot: new Logger('pagerduty'),
  jenkins: new Logger('jenkins')
};


module.exports = Logger.prototype.loggers;
