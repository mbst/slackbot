'use strict';
var common      = require('./common'),
    logger      = require('./logger').general,
    NodeSlack   = require('node-slack'),
    slack       = new NodeSlack('metabroadcast', common.slack.token),
    _           = require('lodash');


//  The dispatcher constructor 
//
//  Provides a way to write messages and send them to slack
//
//  @param chatname {string} name of the chat to post to eg. #anything-else
//  @param options {object}
//
function Dispatcher(chatname, options) {
    this.chatname = chatname;
    var options = options || {};
    this.options = _.assign({
        color: '#250053',
        fallback: null,
        username: 'MetaBot',
        icon_url: ''
    }, options);
}

//  For sending the message to slack
Dispatcher.prototype.send = function() {
    if (!_.isString(this.chatname) || !this.message.length) {
        logger.error('Dispatcher.prototype.send(): chatname and message are both required to send a message');
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

    slack.send({
        'text': ' ',
        'channel': this.chatname,
        'username': this.options.username,
        'icon_url': this.options.icon_url,
        'attachments': _attachments
    });
}

//  For writing a message to the string in parts
Dispatcher.prototype.write = function(message) {
    if (_.isArray(this.message)) {
        this.message.push(message);
    }
    return this;
}

Dispatcher.prototype.link = function(text, link) {
    if (_.isArray(this.message)) {
        this.message.push('<'+link+'|'+text+'>');
    }
    return this;
}
Dispatcher.prototype.message = [];


module.exports = Dispatcher;