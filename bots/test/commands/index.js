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
  'You\'re the meta in MetaBroadcast',
  'At least two friends are going to name their child and/or goldfish after you',
  'Some cultures celebrate %s day',
  '<3'  
];

var options = {
  username: 'LoveBot'
};

// a test endpoint, just because its fun ;)
command.route('/').post(
function(req, res) {  
  var body = req.body || {};
  var chatName = body.channel_name;
  var username = body.user_name;
  var recipient = body.text; 
  var message = compliments[ Math.floor(Math.random() * compliments.length) ];
  
  logger.log(body);
  
  if (! recipient) {
    logger.warn('Must be a recipient');
    res.end();
    return;
  }
  
  var dispatcher = new Dispatcher(chatName, options);
  dispatcher.avatar('http://4.bp.blogspot.com/-WUaQ2KqGsDQ/U16s6Lyfa8I/AAAAAAAAAm0/S0QEvchffd8/s1600/khvQssw.png');
  dispatcher.color('#FF4B4B');
  
  if (message.indexOf('%s') > -1) {
    dispatcher.interpolate(message, username);
  } else {
    dispatcher.write(message);
  }
  
  dispatcher.recipient(recipient);
  
  dispatcher.send();
  res.end();
});

module.exports = command;
