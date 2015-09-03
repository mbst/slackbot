'use strict';
var express        = require('express');
var _              = require('lodash');
var bitbucketUtils = require('./resources/bitbucket-utils');
var router         = express.Router();

router.route('/').post(function(req, res) {
  var _body = req.body || null;
  
  // end the response here if any of the request data is missing
  if (! _body) {
      res.end('not enough data to continue');
      return;
  }
  
  // decide from the request where to send the data
  if (_.has(_body, 'pullrequest')) {
    bitbucketUtils.handlePullRequest(_body);
  }
  res.end();
});

module.exports = { webhook: router };
