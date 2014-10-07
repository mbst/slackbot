'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    jiraHook = require('./webhooks/jira'),
    dispatcher = require('./lib/dispatcher');

// tell express to parse requests as JSON
app.use(bodyParser.json());

// used for listening to webhook requests from jira
app.use('/webhooks/jira', jiraHook);

// a test endpoint, just because its fun ;)
app.get('/test', function(req, res) {
    //dispatcher.send();
    res.end();
});

console.log('Bot ready @ http://dev.mbst.tv:8080');
app.listen('8080');
