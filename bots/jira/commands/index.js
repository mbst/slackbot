'use strict';
var command     = require('express').Router();
var Dispatcher  = require('../../../internals/dispatcher'); 
var logger      = require('../../.././internals/logger').jirabot;


var message_options = {
  username: 'Jira',
  color: '#053663'
};
var message = new Dispatcher('#mb-feeds', message_options);
message.avatar('http://i.imgur.com/nB41VgE.png');

// a test endpoint, just because its fun ;)
command.route('/').post(
function(req, res) {  
  var body = req.body || {};
  
  res.end();
});

module.exports = command;
