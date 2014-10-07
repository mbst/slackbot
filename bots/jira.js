'use strict';

var express = require('express'),
    router = express.Router(),
    dispatcher = require('../lib/dispatcher');

//  used for taking the request body and filtering it
//  to output a message string
//  @param body {object}
//  @returns {string} slack message or null
function formatter(body) {
    if ( typeof body !== 'object' ) return null;
    var output = [],
        ev          = body.webhookEvent,
        user        = body.user,
        issue       = body.issue,
        changelog   = body.changelog.items,
        resolution  = issue.fields.resolution || null;

    // construct the response 
    output.push(user.displayName);
    if ( ev === 'jira:issue_created' ) {
        output.push('has created issue');
    } else
    if ( ev === 'jira:issue_deleted' ) {
        output.push('has deleted issue');
    } else
    if ( ev === 'jira:issue_updated' ) {
        if ( resolution === null ) {
            output.push('has updated issue');
        }else{
            output.push('has resolved issue');
        }
    }
    output.push(issue.fields.summary)
    output.push('in the feature ...')

    return output.join(' ');
}

// listen for incoming hooks from jira
router.route('/').post( function(req, res) {
    var body = req.body || null;
    var response = formatter(body);
    dispatcher.send('#anything-else', response, {
        username: 'Jira',
        color: '#053663',
        icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
    })
    res.end();
});

module.exports = router;