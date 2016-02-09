'use strict';
var router = require('express').Router();
var Dispatcher = require('../../internals/dispatcher');
var moment = require('moment');

var message_options = {
  username: 'HealthBot',
  color: '#88ff88'
};

var channel = '#testing-bots';

router.route('/').post(function(req, res) {

  var body = req.body;
  var healthbotToken = 'eV03fse45Zw6YUjijHFgcD1p';

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
    .a()
    .avatar('http://4.bp.blogspot.com/-rrTvc825Oe0/Tw1rc1VTrcI/AAAAAAAAAEM/VV6uDl4LJR8/s200/Plus_Sign_Green.jpg')
    .send();

  res.end();
});

module.exports = { webhook: router };