'use strict';
var express        = require('express');
var _              = require('lodash');
var bitbucketUtils = require('./resources/bitbucket-utils');

var router     = express.Router();

router.post('/', function(req, res) {
  var _body = req.body || null;

  // decide from the request where to send the data
  if (_.has(_body, 'pullrequest_created')) {
    bitbucketUtils.handlePullRequest(_body);
  }
  res.end();
})

module.exports = router;
