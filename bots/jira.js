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
    } else if ( ev === 'jira:issue_deleted' ) {
        output.push('has deleted');
    } else if ( ev === 'jira:issue_updated' ) {
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
    var defer = q.defer();
    if (!_.isString(path)) {
        logger.error('jiraRequestWithAuth(): path argument must be string'); 
        defer.reject(new Error('path argument must be string'));
        return;
    }
    var _type = type || 'GET',
        _host = common.jira.host,
        _auth = common.jira.auth.user+':'+common.jira.auth.password;

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
    var defer = q.defer();
    if (!_.isString(issueID)) {
        logger.error('getIssueInfo(): issueID argument must be a string'); 
        defer.reject(new Error('issueID arg must be a string'));
        return;
    }
    var _endpoint = '/rest/api/2/issue/';
    jiraRequestWithAuth(_endpoint+issueID)
        .then(function(featuredata) {
        defer.resolve(featuredata)
    })
    return defer.promise;
}

//  Determine the chat to post to based on the component(s)
//
//  @param components {array}
function whichChat(components) {
    if (!_.isArray(components)) {
        return '#anything-else';
    }
    var chatname,
        name = components[0].name;

    // determine the chatname based on component name,
    // maybe a switch might be better for this... oh well
    if (name === 'Atlas') {
        chatname = '#atlas';
    }else if (name === 'Atlas Admin') {
        chatname = '#atlas-admin';
    }else if (name === 'Canary') {
        chatname = '#canary';
    }else if (name === 'Coyote') {
        chatname = '#coyote';
    }else if (name === 'Engage') {
        chatname = '#engage';
    }else if (name === 'Helios') {
        chatname = '#helios';
    }else if (name === 'Infra') {
        chatname = '#infra';
    }else if (name === 'Office') {
        chatname = '#office';
    }else if (name === 'metabroadcast.com') {
        chatname = '#metabroadcast-com';
    }else if (name === 'Voila') {
        chatname = '#voila';
    }else{
        chatname = '#anything-else'; // the default
    }
    return chatname;
}


//  Listen for incoming hooks from jira
router.route('/').post( function(req, res) {
    var taskdata = req.body || null;    

    // this is bad, but it'll stop overflow into anything else for now
    // if (chatname == '#anything-else') return;

    // determine if this request is for a top level
    // feature or a child issue
    if (_.isString(taskdata.issue.fields.customfield_10400)) {
        // send as issue
        var parent_issue = taskdata.issue.fields.customfield_10400;
        getIssueInfo(parent_issue).then(function(featuredata) {
            console.log(featuredata.fields.components); return;
            //var chatname = whichChat(taskdata.issue.fields.components);
            var response = formatter(taskdata, featuredata);
            dispatcher.send(chatname, response, {
                username: 'Jira',
                color: '#053663',
                icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
            })
            res.end();
        }, function(err) { if (err) throw err; });
    }else{ 
        // send as feature
        var chatname = whichChat(taskdata.issue.fields.components); return;
        var response = formatter(taskdata);
        dispatcher.send(chatname, response, {
            username: 'Jira',
            color: '#053663',
            icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
        })
        res.end();
    }
});

module.exports = router;