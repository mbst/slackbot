'use strict';
var express     = require('express');
var router      = express.Router();
var logger      = require('../lib/logger').testbot;
var Dispatcher  = require('../lib/dispatcher');

var options = {
  username: 'Bot',
  iconUrl: 'http://4.bp.blogspot.com/-WUaQ2KqGsDQ/U16s6Lyfa8I/AAAAAAAAAm0/S0QEvchffd8/s1600/khvQssw.png'
};
var dispatcher = new Dispatcher('#anything-else', options);

// a test endpoint, just because its fun ;)
router.route('/').get(
function(req, res) {
  var output = [];
  output.push('✋');
  output.push('🌏');
  dispatcher.message = output;
  dispatcher.devMode(true);
  dispatcher.send();
  logger.log('Hello slack');
  res.end();
});

module.exports = router;
