'use strict';
var _      = require('lodash');
var common = require('./common');

module.exports.isDev = function () {
  if (_.has(common, 'env')) {
    return common.env === 'dev';
  }
  return false;
};
