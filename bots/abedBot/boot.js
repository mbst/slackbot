'use strict';
var router = require('express').Router();
var Dispatcher = require('../../internals/dispatcher');
var logger  = require('../.././internals/logger').abed;
var quotes = require('./abedQuotes.js');

var message_options = {
  username: 'Abed',
  color: '#ff0e0e'
};

router.route('/:token').post(function(req, res) {
  
  var body = req.body;
  var chatName = body.channel_name;
  var token = require('../../config/instance-config.js').tokens.abed;

  if (chatName !== 'anything-else') {
    logger.warn('AbedBot can only be invoked in #anything-else');
    res.end();
    return;
  }

  if (req.params.token !== token) {
    logger.warn('Invalid access token supplied.');
    res.end();
    return;
  }

  var quote = quotes.getQuote();
  var msg = new Dispatcher('#anything-else', message_options);
  
  msg
  	.chat(chatName)
  	.write(quote)
  	.avatar('http://fanaru.com/community/image/18689-community-abed-nadir-avatar.jpg')
		.send();

  res.end();
});

module.exports = { webhook: router };
