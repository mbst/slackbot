var express = require('express'),
    NodeSlack = require('node-slack'),
    slack = new NodeSlack('metabroadcast', 'HZXBrDqVBF18oo2A3yQAVDU6'),
    app = express();
    //jira = require('./webhooks/jira');

// used for assigning jira webhooks to listen on specific uri
//app.use('/webhooks/jira', jira);

// app.use(function(req, res, next) {
//     console.log(req);
//     next();
// })

app.get('/test', function(req, res) {
    slack.send({
        channel: '#anything-else',
        username: "JiraBot",
        icon_emoji: "pineapple",
        attachments: [{
            "title": "Jira notification",
            "color": "#aa17ff",
            "fallback": "Oli Hall resolved Adapt Endpoint generation - class per endpoint in the feature Initial MetaEndpoint",
            "text": "Oli Hall resolved [Adapt Endpoint generation](http://metabroadcast.com) - class per endpoint in the feature [Initial MetaEndpoint](http://metabroadcast.com)"
        }]
    });

    res.end();
});

console.log('Bot ready @ http://dev.mbst.tv:1234');
app.listen('1234');
