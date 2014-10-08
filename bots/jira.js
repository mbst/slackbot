'use strict';
var express     = require('express'),
    logger      = require('../lib/logger').jirabot,
    router      = express.Router(),
    dispatcher  = require('../lib/dispatcher'),
    http        = require('http'),
    _           = require('lodash');

//  used for taking the request body and filtering it
//  to output a message string
//  @param body {object}
//  @returns {string} slack message or null
function formatter(body) {
    if (!_.isObject(body)) {
        logger.error('formatter(): body argument must be object'); 
        return;
    }
    var output = [],
        ev          = body.webhookEvent,
        user        = body.user,
        issue       = body.issue,
        changelog   = body.changelog.items,
        resolution  = issue.fields.resolution || null;

    // get info about the parent issue
    getIssue(body.key);

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
    output.push('<http://metabroadcast.com|'+issue.fields.summary+'>');
    output.push('in the feature <http://metabroadcast.com|...>')
    return output.join(' ');
}

//  used for requesting the issue from jira
//
//  @param issueID {string} the id of the issue. eg: `MBST-9704`
function getIssue(issueID) {
    if (!_.isString(issueID)) {
        logger.error('getIssue(): issueID argument must be a string'); 
        return;
    }
    var _endpoint = 'jira.metabroadcast.com/rest/api/2/issue/'+issueID;

    // make the request to jira, and return project info
    http.get(endpoint, function(req, res) {
        var _body = req.body || null;
        console.log(_body);
    }).end();
}

// listen for incoming hooks from jira
router.route('/').post( function(req, res) {
    var _body = req.body || null;
    var response = formatter(_body);

    dispatcher.send('#anything-else', response, {
        username: 'Jira',
        color: '#053663',
        icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
    })
    res.end();
});

module.exports = router;