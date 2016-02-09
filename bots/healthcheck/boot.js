'use strict';
var router = require('express').Router();
var Dispatcher = require('../../internals/dispatcher');
var logger  = require('../.././internals/logger').healthcheck;
var moment = require('moment');

var message_options = {
  username: 'HealthBot',
  color: '#88ff88'
};

var channel = '#testing-bots';

router.route('/:token').get(function(req, res) {
  var healthbotToken = 'gK7hDUrWSNzMyCQXVpmnZSDS';
  var suppliedToken = req.params.token;
  if (suppliedToken !== healthbotToken) {
    logger.warn('Incorrect access token provided.');
    res.end();
    return;
  }

  res.send({
    'status': 'Good'
  });

});

router.route('/').post(function(req, res) {

  var body = req.body;
  var healthbotToken = 'IZXIWDTrQBldpQFzJbJccDPM';

  if (body.token !== healthbotToken) {
    logger.warn('Invalid access token supplied.');
    res.end();
    return;
  }

  var msg = new Dispatcher(channel, message_options);
  var time = moment().format('DD MMM, HH:mm');

  msg
    .chat(channel)
    .write('(' + time + ') - Slackbot is OK!')
    .avatar('http://4.bp.blogspot.com/-rrTvc825Oe0/Tw1rc1VTrcI/AAAAAAAAAEM/VV6uDl4LJR8/s200/Plus_Sign_Green.jpg')
    .send();

  res.end();
});

module.exports = { command: router };