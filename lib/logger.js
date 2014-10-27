'use strict';
var winston = require('winston'),
    _       = require('lodash');

//  the logger is for... logging. it keeps track of all 
//  logging processes in a single location, and uses
//  winston to do most of the hard work
//  
//  @param logname {string} name of the log file that will be saved in /logs
function Logger(logname) {
    var _logspath = './logs/';
    var _logname = logname || "general";
    this.logname = _logname;
    this.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: _logspath+_logname+'.log' })
        ]
    });
}

//  for writing normally to the log. uses winston.info
//
//  @param content {string} what you want to be logged
Logger.prototype.log = function(content) {
    if (!_.isString(content)) return;
    this.logger.info(content);
}

//  for writing errors to the log. uses winston.warn
//
//  @param content {string} what you want to be logged
Logger.prototype.error = function(content) {
    if (!_.isString(content)) return;
    this.logger.warn(content);
}

module.exports = {
    global: new Logger('global'),
    jirabot: new Logger('jirabot'),
    testbot: new Logger('testbot')
}