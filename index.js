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

// init jira bot
app.use('/webhooks/jira', jiraBot);

// a test endpoint, just because its fun ;)
app.get('/test', function(req, res) {
    var output = [], options = {};
    // construct the response
    output.push('Revolver Ocelot');    
    output.push('has updated issue');
    output.push('<http://metabroadcast.com|An issue>');
    output.push('in the feature <http://google.com|Something else>');
    options.username = 'TestBot';
    options.icon_url = 'http://4.bp.blogspot.com/-WUaQ2KqGsDQ/U16s6Lyfa8I/AAAAAAAAAm0/S0QEvchffd8/s1600/khvQssw.png';
    //dispatcher.send('#anything-else', output.join(' '), options);
    res.end();
});

console.log('Bot ready @ http://dev.mbst.tv:'+common.port);
app.listen(common.port);
