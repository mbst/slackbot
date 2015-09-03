'use strict';
var express    = require('express');
var pagerduty  = require('./resources/pagerduty-service');

var router     = express.Router();

router.post('/', function(req, res) {
  var _body = req.body || null;
  pagerduty.parseRequest(_body, pagerduty.sendMessage);
  res.end();
});

module.exports = { webhook: router };
