'use strict';
var util      = require('util');
var _         = require('lodash');
var Q         = require('Q');
var utils     = require('./utils');
var logger    = require('./logger').internals;
var Slack     = require('slack-node');

var slack = new Slack();
slack.setWebhook('https://hooks.slack.com/services/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'); // TODO: moov into config


//  The dispatcher constructor
//
//  Provides a way to write messages and send them to slack
//
//  @param chatname {string} name of the chat to post to eg. #anything-else
//  @param options {object}
//
function Dispatcher(chatname, options) {
  options = options || {};
  this.chatname = chatname;
  this.message = [];
  this.options = _.assign({
    color: '#250053',
    fallback: null,
    username: 'MetaBot',
    iconUrl: ''
  }, options);
}


//  For sending the message to slack
Dispatcher.prototype.send = function() {
  var defer = Q.defer();
  if (! _.isString(this.chatname) || ! this.message.length) {
    logger.error('chatname and message are both required to send a message');
    defer.reject();
    return defer.promise;
  }
  var _message = this.message.join(' ');
  var _attachments = [{
    'title': ' ',
    'color': this.options.color,
    'fallback': this.options.fallback || _message,
    'text': _message,
    'mrkdwn_in': ['text', 'title']
  }];

  var messageObject = {
    'text': ' ',
    'channel': this.chatname,
    'username': this.options.username,
    'icon_url': this.options.iconUrl,
    'attachments': _attachments
  };

  if (utils.isDev()) {
    console.log(messageObject);
    this.message = [];
    defer.resolve();
    return defer.promise;
  }

  slack.webhook(messageObject, function (err, res) {
    if (err) {
      console.error(err, res);
      defer.reject();
    }

    // clear message after message has been sent
    this.message = [];
    defer.resolve();
  });

  return defer.promise;
};


// Change the color of the output
Dispatcher.prototype.color = function (cssColor) {
  this.options.color = cssColor;
  return this;
};


// Change the icon assigned to the massage
Dispatcher.prototype.avatar = function (iconUrl) {
  this.options.icon_url = iconUrl;
  return this;
};


// For interpolating a string, printf style, then adding with this.write. Give
// the function a string with %s flags, and it will replace them with the strings
// supplied as subsequent arguments.
Dispatcher.prototype.interpolate = function (/* arguments: first param is message str. all after that are %s replacements */) {
  if (! _.isArguments(arguments)) {
    console.log('No arguments object');
    return;
  }
  var msg = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  _.forEach(args, function (str) {
    msg = util.format(msg, str);
  });
  this.write(msg);
  return this;
};


//  For writing a message to the string in parts
Dispatcher.prototype.write = function(message) {
  if (_.isArray(this.message)) {
    this.message.push(message);
  }
  return this;
};


Dispatcher.prototype.chat = function (chatName) {
  if (_.isString(chatName)) {
    this.chatname = (chatName.indexOf('#') > -1) ? chatName : '#' + chatName;
  }
};


Dispatcher.prototype.link = function(text, link) {
  if (_.isArray(this.message)) {
    this.message.push('<' + link + '|' + text + '>');
  }
  return this;
};


module.exports = Dispatcher;
