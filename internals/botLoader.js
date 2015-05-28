'use strict';
var _      = require('lodash');
var path   = require('path');
var logger = require('./logger').internals;

function BotLoader () {
  this.BOTS_DIR = '../bots';
  this.BOOT_FILE = 'boot.js';
}

BotLoader.prototype.requirePackage = function (packageName) {
  if (! _.isString(packageName)) {
    logger.warn('Package can\'t be loaded because `packageName` must be a String');
    return;
  }

  var botPath = path.join(this.BOTS_DIR, packageName, this.BOOT_FILE)
  var loadedBot = require(botPath);

  if (! _.isObject(loadedBot)) {
    logger.warn('Package can\'t be loaded because the bot file isn\'t the correct format.');
    return;
  }

  return loadedBot;
};

BotLoader.prototype.bot = function (botName) {
  var bootableBot = this.requirePackage(botName);
  logger.dev('Loaded bot ' + botName);
  return bootableBot;
};

module.exports = BotLoader;
