'use strict';
var express         = require('express'),
    router          = express.Router(),
    common          = require('../lib/common'),
    logger          = require('../lib/logger').jirabot,
    dispatcher      = require('../lib/dispatcher'),
    Jira            = require('../lib/jiraProvider'),
    https           = require('https'),
    _               = require('lodash'),
    q               = require('q');

//  Used for taking the request body and filtering it to output a
//  message string
//
//  @param taskdata {object} 
//  @param featuredata {object} omitting this causes the data 
//         to be treated as a parent feature, not an issue
//  @returns {string} slack message or null
//
function formatter(taskdata, featuredata) {
    if (!_.isObject(taskdata)) {
        logger.error('formatter(taskdata, featuredata): taskdata argument must be a object'); 
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
    output.push(user.displayName);
    if ( ev === 'jira:issue_created' ) {
        output.push('has created');
    } else if ( ev === 'jira:issue_deleted' ) {
        output.push('has deleted');
    } else if ( ev === 'jira:issue_updated' ) {
        if ( _.isEmpty(resolution) ) {
            return null;
        }else{
            output.push('has resolved');
        }
    }
    wording.type = (isFeature)? 'feature' : 'issue';
    output.push(wording.type);
    output.push('<'+_.escape(browseURL+issue.key)+'|'+_.escape(issue.fields.summary)+'>');
    if (!isFeature) {
        output.push('in the feature');
        output.push('<'+_.escape(browseURL+featuredata.key)+'|'+_.escape(featuredata.fields.summary)+'>');
    }
    return output.join(' ');
}


//  Listen for incoming hooks from jira
router.route('/').post( function(req, res) {
    var taskdata = req.body || null;
    if (_.isEmpty(taskdata)) {
        res.end();
        return;
    }

    var message_options = {
        username: 'Jira',
        color: '#053663',
        icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
    };
    var jira = new Jira();
    var message = new dispatcher('#mb-feeds', message_options);
    var parent_issue = taskdata.issue.fields.customfield_10400 || undefined;

    // determine if this request is for a top level feature or a child issue
    if (_.isString(parent_issue)) {
        // send as issue
        jira.getFeature(parent_issue).then(function(featuredata) {
            var response = formatter(taskdata, featuredata);
            if (response) {
                message.chatname = jira.getChatFromComponent(featuredata.fields.components);
                message.write(response).send();
            }
            res.end();
        }, function(err) { if (err) logger.error(err); });
    }else{ 
        console.log(JSON.stringify(taskdata))
        // send as feature
        var components = taskdata.fields.components? taskdata.fields.components : null;
        message.chatname = jira.getChatFromComponent(components);
        var response = formatter(taskdata);
        if (response) {
            message.write(response).send();
        }
        res.end();
    }
});

module.exports = router;