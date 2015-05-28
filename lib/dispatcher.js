'use strict';
var common    = require('./common');
var logger    = require('./logger').global;
var NodeSlack = require('node-slack');
var slack     = new NodeSlack('https://hooks.slack.com/services/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');
var _         = require('lodash');


//  The dispatcher constructor
//
//  Provides a way to write messages and send them to slack
//
//  @param chatname {string} name of the chat to post to eg. #anything-else
//  @param options {object}
//
function Dispatcher(chatname, options) {
  options = options || {};
  this.dev = false;
  this.chatname = chatname;
  this.message = [];
  this.options = _.assign({
    color: '#250053',
    fallback: null,
    username: 'MetaBot',
    iconUrl: ''
  }, options);
}


// Dev mode will tell the Dispatcher to log message objects to the console
// instead of sending to slack
//
// @param mode {Boolean}
Dispatcher.prototype.devMode = function (mode) {
  this.dev = mode || false;
};


//  For sending the message to slack
Dispatcher.prototype.send = function() {
  if (!_.isString(this.chatname) || !this.message.length) {
    logger.error('chatname and message are both required to send a message');
    return false;
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

  if (this.dev) {
    console.log(messageObject);
    this.message = [];
    return;
  }

  slack.send(messageObject);

  // clear message after its been sent
  this.message = [];
};


//  For writing a message to the string in parts
Dispatcher.prototype.write = function(message) {
  if (_.isArray(this.message)) {
    this.message.push(message);
  }
  return this;
};


Dispatcher.prototype.link = function(text, link) {
  if (_.isArray(this.message)) {
    this.message.push('<'+link+'|'+text+'>');
  }
  return this;
};


module.exports = Dispatcher;
