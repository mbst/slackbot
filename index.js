'use strict';
var common     = require('./internals/common');
var Loader     = require('./internals/bot-loader');
var bots       = new Loader();

// Load all the bots
bots.register('test');
bots.register('jira');
bots.registerWebhook('github');
bots.registerWebhook('bitbucket');
bots.registerWebhook('pagerduty');

bots.boot(common.port);
