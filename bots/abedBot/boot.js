'use strict';
var express     = require('express');
var Dispatcher = require('../../internals/dispatcher');

var router = express.Router();

router.route('/lol').get(function(req, res) {
  
  var message_options = {
    username: 'Abed',
    color: '#ff0e0e'
  };
  
  var msg = new Dispatcher('#anything-else', message_options);
  
  msg.write('Just testing hahah').bold(':)');

  msg.avatar('http://fanaru.com/community/image/18689-community-abed-nadir-avatar.jpg');
  
  msg.send();
  
  res.end();
});

module.exports = { webhook: router };
