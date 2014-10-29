'use strict';
var common      = require('../lib/common'),
    logger      = require('../lib/logger').general,
    _           = require('lodash'),
    https       = require('https'),
    Q           = require('q');

function SlackProvider = function() {
    this.token = common.slack.api_token;
    this.host = 'https://slack.com/api/';
}
