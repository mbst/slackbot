'use strict';
var command     = require('express').Router();
var Dispatcher  = require('../../../internals/dispatcher');
var logger      = require('../../.././internals/logger').jenkins;
var utils       = require('../resources/jenkins-utils');

/*
 token=K97zxmTZtzaayL1MdxzEC9X6
 team_id=T0001
 team_domain=example
 channel_id=C2147483705
 channel_name=test
 user_id=U2147483697
 user_name=Steve
 command=/weather
 text=94070
 */

// a test endpoint, just because its fun ;)
command.route('/').post(
  function(req, res) {
    var body = req.body || {};
    var reply = 'I didn\'t understand. Sorry';
    var request = [];
    var command;
    var params = {};

    if (body.text.length > 0) {
      request = body.text.split(' ');

      if (request.length <= 0) {
        reply += ' - not enough params sent.';
      } else {
        command = request.shift();

        if (!utils.commands[command]) {
          reply += ' - ' + command + ' not found.';
        } else {
          utils.commands[command].apply(this, request).then(function (msg) {
            console.log(msg);
            res.send(msg);
          }, function (error) {
            console.log(error);
            res.send(error);
          });
          return;
        }
      }
    }

    res.send(reply);
  });

module.exports = command;