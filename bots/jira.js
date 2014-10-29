'use strict';
var express     = require('express'),
    common      = require('../lib/common'),
    logger      = require('../lib/logger').jirabot,
    router      = express.Router(),
    dispatcher  = require('../lib/dispatcher'),
    https       = require('https'),
    Jira        = require('../lib/jiraProvider'),
    _           = require('lodash'),
    q           = require('q');

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


//  Listen for incoming hooks from jira
router.route('/').post( function(req, res) {
    var taskdata = req.body || null;    
    var message_options = {
        username: 'Jira',
        color: '#053663',
        icon_url: 'https://confluence.atlassian.com/download/attachments/284366955/JIRA050?version=1&modificationDate=1336700125538&api=v2'
    };
    var jira = new Jira();
    var message = new dispatcher('#anything-else', message_options);

    // determine if this request is for a top level feature or a child issue
    if (_.isString(taskdata.issue.fields.customfield_10400)) {
        // send as issue
        var parent_issue = taskdata.issue.fields.customfield_10400;
        jira.getFeature(parent_issue).then(function(featuredata) {
            var response = formatter(taskdata, featuredata);
            message.chatname = jira.getChatFromComponent(featuredata.fields.components);
            message.write(response).send();
            res.end();
        }, function(err) { if (err) logger.error(err); });
    }else{ 
        // send as feature
        message.chatname = jira.getChatFromComponent(featuredata.fields.components);
        var response = formatter(taskdata);
        message.write(response).send();
        res.end();
    }
});

module.exports = router;