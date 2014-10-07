'use strict';
var NodeSlack   = require('node-slack'),
    slack       = new NodeSlack('metabroadcast', 'RojNtPhjwIfA8RERD0j9Xyni'),
    _           = require('lodash');


//  the dispatcher sends a message to a specified slack chat
//
//  @param chatname {string} name of the chat to post to
//  @param message {string} the message content
//  @param options {object}
function dispatcher(chatname, message, options) {
    if (!_.isString(chatname) || !_.isString(message)) {
        console.error('chatname and message args must be strings');
    }

    var options = options || {},
        _options = _.assign({
        color: '#250053',
        fallback: message,
        username: 'MetaBot',
        icon_url: ''
    }, options);

    var attachments = [{
        'title': ' ',
        'color': _options.color,
        'fallback': _options.fallback,
        'text': message,
        'mrkdwn_in': ['text', 'title', 'fallback']
    }];

    slack.send({
        'text': ' ',
        'channel': chatname,
        'username': _options.username,
        'icon_url': _options.icon_url,
        'attachments': attachments
    });

    console.log(chatname, message, _options);
}


module.exports = {
    send: dispatcher
};