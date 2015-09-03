'use strict';
var command     = require('express').Router();
var Dispatcher  = require('../../../internals/dispatcher'); 
var logger      = require('../../.././internals/logger').jira;


var options = {
  username: 'LoveBot'
};

// a test endpoint, just because its fun ;)
command.route('/').post(
function(req, res) {  
  var body = req.body || {};
  
  res.end();
});

module.exports = command;
