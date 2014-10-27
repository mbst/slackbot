'use strict';
var common      = require('./common'),
    NodeSlack   = require('node-slack'),
    slack       = new NodeSlack('metabroadcast', common.slack.token),
    _           = require('lodash');


//  The dispatcher sends a message to a specified slack chat
//
//  @param chatname {string} name of the chat to post to eg. #anything-else
//  @param options {object}
function Dispatcher(chatname, options) {
    if (!_.isString(chatname)) {
        console.error('chatname must be string');
    }
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
Dispatcher.prototype.message = [];


module.exports = Dispatcher;