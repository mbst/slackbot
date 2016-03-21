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
  'You\'re my favourite',
  ', you fork that code like no one else.',
  'I\'d switch to emacs for you',
  ', don\'t make me talk Java to you',
  ', you double clicked my heart.',
  ', if you were a triangle, you\'d be acute.',
  ', you\'re sweeter than 3.14',
  ', I\'ll hold your hand tighter than my phone on the bath.',
  'I like your face. We should go to a place at the same time and say things to each other.',
  ' if you were an ebay auction, I\'d totally Buy It Now.',
  ', you auto-complete me.'
];

var options = {
  username: 'LoveBot'
};

// a test endpoint, just because its fun ;)
command.route('/:token').post(
function(req, res) {  
  var body = req.body || {};
  var chatName = body.channel_name;
  var recipient = body.text; 
  var message = compliments[ Math.floor(Math.random() * compliments.length) ];
  var token = require('../../../config/instance-config.js').tokens.test;
  
  if (! recipient) {
    logger.warn('Must be a recipient');
    res.end();
    return;
  }

  if (req.params.token !== token) {
    logger.warn('Invalid access token supplied.');
    res.end();
    return;
  }
  
  var dispatcher = new Dispatcher('#anything-else', options);
  dispatcher.chat(chatName);
  dispatcher.emoji(':heart:');
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
