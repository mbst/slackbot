'use strict';
var _          = require('lodash');
var path       = require('path');
var logger     = require('./logger').internals;
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

function BotLoader () {
  // For making express deal with json and formdata payloads
  app.use( bodyParser.json({ limit: '5mb' }) );
  app.use( bodyParser.urlencoded({ extended: true }) );
  
  this.BOTS_DIR = '../bots';
  
  // For telling the loader which file to look for first in bot dir
  this.BOOT_FILE = 'boot.js';
  
  // For configuring default entrypoints for external services
  this.WEBHOOK_ENDPOINT = 'webhooks';
  this.COMMAND_ENDPOINT = 'commands';
}

BotLoader.prototype.requirePackage = function (packageName) {
  if (! _.isString(packageName)) {
    logger.warn('Package can\'t be loaded because `packageName` must be a String');
    return;
  }

  // TODO: Checks on whether the to-be-loaded directory / file exists.
  // See: http://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route

  var botPath = path.join(this.BOTS_DIR, packageName, this.BOOT_FILE);
  var loadedBot = require(botPath);

  if (! _.isObject(loadedBot)) {
    logger.warn('Package can\'t be loaded because the bot file isn\'t the correct format.');
    return;
  }

  return loadedBot;
};

BotLoader.prototype.register = function (name) {
  var hook = this.registerWebhook(name);
  var command = this.registerCommand(name);
  return hook && command;
};

BotLoader.prototype.registerWebhook = function (name) {
  var loadedBot = this.bot(name);
  if (_.has(loadedBot, 'webhook')) {
    app.use('/' + this.WEBHOOK_ENDPOINT + '/' + name, loadedBot.webhook);
    logger.console('✔︎ Loaded webhook listener [' + name + ']');
    return true;
  }
  return false;
};

BotLoader.prototype.registerCommand = function (name) {
  var loadedBot = this.bot(name);
  if (_.has(loadedBot, 'command')) {
    app.use('/' + this.COMMAND_ENDPOINT + '/' + name, loadedBot.command);
    logger.console('✔︎ Loaded command listener [' + name + ']');
    return true;
  }
  return false;
};

BotLoader.prototype.bot = function (botName) {
  var bootableBot = this.requirePackage(botName);
  return bootableBot;
};

BotLoader.prototype.boot = function (port) {
  app.listen(port);
  logger.console('Bot ready @ port ' + port);
};

module.exports = BotLoader;
