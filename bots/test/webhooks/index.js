'use strict';
var webhook     = require('express').Router();
var Dispatcher  = require('../../../internals/dispatcher');
// var hat = require('hat');

var options = {
  username: 'Bot'
};

var dispatcher = new Dispatcher('#anything-else', options);

// a test endpoint, just because its fun ;)
webhook.route('/').get(
function(req, res) {
  dispatcher.avatar('http://4.bp.blogspot.com/-WUaQ2KqGsDQ/U16s6Lyfa8I/AAAAAAAAAm0/S0QEvchffd8/s1600/khvQssw.png');
  dispatcher.write('✋Hai');
  dispatcher.send();
  res.end();
});

// webhook.route('/').post(function(req, res) {
	// var id = hat();
	// console.log(id);
// 	res.end();
// })
module.exports = webhook;
