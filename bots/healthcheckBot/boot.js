'use strict';
var router = require('express').Router();
var Dispatcher = require('../../internals/dispatcher');
var moment = require('moment');

var message_options = {
  username: 'HealthBot',
  color: '#88ff88'
};

var channel = '#testing-bots';

var sendUpdate = function() {
  var msg = new Dispatcher(channel, message_options);
  var time = moment().format('DD MMM, HH:mm');

  msg
    .chat(channel)
    .write('Automated Slackbot health report: ' + time)
    .avatar('http://4.bp.blogspot.com/-rrTvc825Oe0/Tw1rc1VTrcI/AAAAAAAAAEM/VV6uDl4LJR8/s200/Plus_Sign_Green.jpg')
    .send();

  //delete msg;
  //delete time;

};

sendUpdate();
var interval = setInterval(sendUpdate, 1980000);

module.exports = { webhook: router };
