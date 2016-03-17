'use strict';
var express    = require('express');
var pagerduty  = require('./resources/pagerduty-service');
var logger     = require('../../internals/logger').pagerdutybot;

var router     = express.Router();

var token = 'c5879b78018f944ed3abfecf9bec88bc';

router.post('/:token', function(req, res) {

  logger.log(req.body);

	var suppliedToken = req.params.token;
	if (suppliedToken !== token) {
    logger.warn('Incorrect access token provided.');
    res.end();
    return;
	}

  var _body = req.body || null;
  pagerduty.parseRequest(_body, pagerduty.sendMessage);
  res.end();

});

module.exports = { webhook: router };
