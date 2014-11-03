'use strict';
var common          = require('./lib/common'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    app             = express(),
    dispatcher      = require('./lib/dispatcher');

// tell express to parse requests as JSON
app.use(bodyParser.json());

// initialise all the bots
app.use('/test',                require('./bots/test'));
app.use('/webhooks/jira',       require('./bots/jira'));
app.use('/webhooks/github',     require('./bots/github'));
app.use('/webhooks/bitbucket',  require('./bots/bitbucket'));
app.use('/webhooks/pagerduty',  require('./bots/pagerduty'));

// boot the server
console.log('Bot ready @ http://dev.mbst.tv:'+common.port);
app.listen(common.port);