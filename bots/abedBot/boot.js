'use strict';
var router = require('express').Router();
var Dispatcher = require('../../internals/dispatcher');
var logger  = require('../.././internals/logger').abed;
var quotes = require('./abedQuotes.js');

var message_options = {
  username: 'Abed',
  color: '#ff0e0e'
};

router.route('/').get(function(req, res) {
  
  var msg = new Dispatcher('#anything-else', message_options);
  var quote = quotes.getQuote();
  
  msg.write(quote);

  msg.avatar('http://fanaru.com/community/image/18689-community-abed-nadir-avatar.jpg');
  
  msg.send();

  res.send({'numbers': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]})
  res.end();
});

module.exports = { webhook: router };
