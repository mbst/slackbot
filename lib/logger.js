'use strict';
var winston = require('winston'),
    _       = require('lodash');

//  The logger is for... logging. it keeps track of all 
//  logging processes in a single location, and uses
//  winston to do all the hard work
//  
//  

function Logger(logname) {
    var _logspath = './logs/';
    var _logname = logname || "slackbot";
    this.logname = _logname;
    this.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: _logspath+_logname+'.log' })
        ]
    });
}

Logger.prototype.log = function(content) {
    if (!_.isString(content)) return;
    this.logger.info(content);
}

module.exports = {
    global: new Logger('global'),
    jirabot: new Logger('jirabot')
}