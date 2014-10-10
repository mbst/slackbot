'use strict';
var express     = require('express'),
    common      = require('../lib/common'),
    logger      = require('../lib/logger').jirabot,
    router      = express.Router(),
    dispatcher  = require('../lib/dispatcher'),
    https       = require('https'),
    _           = require('lodash'),
    q           = require('q');

//  Used for taking the request body and filtering it to output a
//  message string
//
//  @param taskdata {object} 
//  @param featuredata {object} omitting this causes the data 
//         to be treated as a parent feature, not an issue
//  @returns {string} slack message or null
function formatter(taskdata, featuredata) {
    if (!_.isObject(taskdata)) {
        logger.error('formatter(): taskdata argument must be a object'); 
        return; 
    }
    var output      = [],
        isFeature   = (_.isObject(featuredata))? false : true,
        ev          = taskdata.webhookEvent,
        user        = taskdata.user,
        issue       = taskdata.issue,
        resolution  = issue.fields.resolution || null,
        browseURL   = 'http://jira.metabroadcast.com/browse/',
        wording     = {};

    // construct the response 
    wording.type = (isFeature)? 'feature' : 'issue';
    output.push(user.displayName);
    if ( ev === 'jira:issue_created' ) {
        output.push('has created');
    } else
    if ( ev === 'jira:issue_deleted' ) {
        output.push('has deleted');
    } else
    if ( ev === 'jira:issue_updated' ) {
        if ( _.isNull(resolution) ) {
            output.push('has updated');
        }else{
            output.push('has resolved');
        }
    }
    output.push(wording.type);
    output.push('<'+browseURL+issue.key+'|'+issue.fields.summary+'>');
    if (!isFeature) {
        output.push('in the feature');
        output.push('<'+browseURL+featuredata.key+'|'+featuredata.fields.summary+'>');
    }
    return output.join(' ');
}


//  Used for making requests to jira
//
//  @param path {string}
//  @param type {string} 'GET' by default
function jiraRequestWithAuth(path, type) {
    if (!_.isString(path)) {
        logger.error('jiraRequestWithAuth(): path argument must be string'); 
        return;
    }
    var _type = type || 'GET',
        _host = common.jira.host,
        _auth = common.jira.auth.user+':'+common.jira.auth.password,
        defer = q.defer();

    var options = {
        hostname: _host,
        path: path,
        method: _type,
        auth: _auth
    }

    https.request(options, function(res) {
        var _body = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            _body += chunk;
        });
        res.on('end', function() {
            var data = JSON.parse(_body);
            defer.resolve(data);
        })
    }).end();
    return defer.promise;
}


//  Used for requesting the issue and its parent feature from jira
//
//  @param issueID {string} the id of the issue. eg: `MBST-9704` or `23927`
function getIssueInfo(issueID) {
    if (!_.isString(issueID)) {
        logger.error('getIssueInfo(): issueID argument must be a string'); 
        return;
    }
    var defer = q.defer();
    var _endpoint = '/rest/api/2/issue/';
    jiraRequestWithAuth(_endpoint+issueID)
        .then(function(featuredata) {
        defer.resolve(featuredata)
    })
    return defer.promise;
}


// listen for incoming hooks from jira
router.route('/').post( function(req, res) {
    var taskdata = req.body || null;    

    console.log(taskdata);

    // determine if this request is for a top level
    // feature or a child issue
    if (_.isString(taskdata.issue.fields.customfield_10400)) {
        // send as issue
        var parent_issue = taskdata.issue.fields.customfield_10400;
        getIssueInfo(parent_issue).then(function(featuredata) {
            var response = formatter(taskdata, featuredata);
            dispatcher.send('#anything-else', response, {
                username: 'Jira',
                color: '#053663',
                icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
            })
            res.end();
        });
    }else{ 
        // send as feature
        var response = formatter(taskdata);
        dispatcher.send('#anything-else', response, {
            username: 'Jira',
            color: '#053663',
            icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
        })
        res.end();
    }
});

module.exports = router;