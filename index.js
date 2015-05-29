'use strict';
var common     = require('./internals/common');
var Loader     = require('./internals/bot-loader');
var logger     = require('./internals/logger').internals;
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

// Instantiate the Bot Loader
var load = new Loader();

// Tell Express to parse requests as JSON
app.use(bodyParser.json());

// Load all the bots
// TODO: Move express logic into bot loader, and pass endpoint as function arg
app.use('/test',               load.bot('test'));
app.use('/webhooks/jira',      load.bot('jira'));
app.use('/webhooks/github',    load.bot('github'));
app.use('/webhooks/bitbucket', load.bot('bitbucket'));
app.use('/webhooks/pagerduty', load.bot('pagerduty'));

// Boot the app
logger.dev('Bot ready @ http://dev.mbst.tv:' + common.port);
app.listen(common.port);
