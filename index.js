'use strict';
var common      = require('./lib/common'),
    logger      = require('./lib/logger').global,
    express     = require('express'),
    bodyParser  = require('body-parser'),
    app         = express(),
    jiraBot     = require('./bots/jira'),
    dispatcher  = require('./lib/dispatcher');

// tell express to parse requests as JSON
app.use(bodyParser.json());

// initialise all the bots
app.use('/test', require('./bots/test'));
app.use('/webhooks/jira', jiraBot);

// boot the server
console.log('Bot ready @ http://dev.mbst.tv:'+common.port);
app.listen(common.port);