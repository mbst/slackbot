'use strict';
var command     = require('express').Router();
var Dispatcher  = require('../../../internals/dispatcher'); 
var logger  = require('../../.././internals/logger').test;

var compliments = [
  'You look good today',
  'I like your eyes - can I touch them?',
  'You\'re the reason I got out of bed today',
  'People behind you at movies think you are the perfect height',
  'Strangers all wanna sit next to you on the bus',
  'You put the "Meta" in MetaBroadcast',
  'At least two friends are going to name their child and/or goldfish after you',
  'Some cultures celebrate %s day',
  '<3',
  'Wow, what an amazing human you are',
  'You\'re my favourite'
];

var options = {
  username: 'LoveBot',
  icon_emoji: ':heart:'
};

// a test endpoint, just because its fun ;)
command.route('/').post(
function(req, res) {  
  var body = req.body || {};
  var chatName = body.channel_name;
  var recipient = body.text; 
  var message = compliments[ Math.floor(Math.random() * compliments.length) ];
  
  logger.log(body);
  
  if (! recipient) {
    logger.warn('Must be a recipient');
    res.end();
    return;
  }
  
  var dispatcher = new Dispatcher('#anything-else', options);
  dispatcher.chat(chatName);
  dispatcher.color('#FF4B4B');
  
  if (message.indexOf('%s') > -1) {
    dispatcher.interpolate(message, recipient);
  } else {
    dispatcher.write(message);
  }
  
  dispatcher.recipient(recipient);
  
  dispatcher.send();
  res.end();
});

module.exports = command;
