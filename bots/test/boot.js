'use strict';
var webhooks = require('./webhooks');
var commands = require('./commands');

module.exports = { 
  webhook: webhooks,
  command: commands
};