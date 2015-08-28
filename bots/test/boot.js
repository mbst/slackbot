'use strict';
var express     = require('express');
var router      = express.Router();
var logger      = require('../../internals/logger').testbot;
var Dispatcher  = require('../../internals/dispatcher');

var options = {
  username: 'Bot'
};

var dispatcher = new Dispatcher('#anything-else', options);

// a test endpoint, just because its fun ;)
router.route('/').get(
function(req, res) {
  dispatcher.avatar('http://4.bp.blogspot.com/-WUaQ2KqGsDQ/U16s6Lyfa8I/AAAAAAAAAm0/S0QEvchffd8/s1600/khvQssw.png');
  dispatcher.write('✋Hai');
  dispatcher.send();
  res.end();
});

module.exports = router;
