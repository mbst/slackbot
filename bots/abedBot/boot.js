'use strict';
var router = require('express').Router();
var Dispatcher = require('../../internals/dispatcher');
var logger  = require('../.././internals/logger').abed;
var quotes = require('./abedQuotes.js');

var message_options = {
  username: 'Abed',
  color: '#ff0e0e'
};

router.route('/').post(function(req, res) {

  logger.log(req);
  
  var body = req.body;
  var chatName = body.channel_name;

  if (chatName !== 'anything-else') return;

  var msg = new Dispatcher('#anything-else', message_options);
  var quote = quotes.getQuote();
  
  msg
  	.chat(chatName)
  	.write(quote)
  	.avatar('http://fanaru.com/community/image/18689-community-abed-nadir-avatar.jpg')
		.send();

  res.end();
});

module.exports = { webhook: router };
