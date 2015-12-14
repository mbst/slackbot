'use strict';
var express    = require('express');
var pagerduty  = require('./resources/pagerduty-service');

var router     = express.Router();

var token = 'c5879b78018f944ed3abfecf9bec88bc';

router.post('/:token', function(req, res) {

	var suppliedToken = req.params.token;
	if (suppliedToken === token) {
	  var _body = req.body || null;
	  pagerduty.parseRequest(_body, pagerduty.sendMessage);
	  res.end();
	} else {
		res.send({'error': 'unauthorized'})
		res.end();
	}

});

module.exports = { webhook: router };
