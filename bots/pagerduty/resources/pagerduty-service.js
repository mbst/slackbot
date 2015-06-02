'use strict';
var _          = require('lodash');
var Dispatcher = require('../../../internals/dispatcher');
var logger     = require('../../../internals/logger').pagerdutybot;


//  Used for parsing the incoming request
//
//  Pagerduty sometimes bundles up multiple events into a single request,
//  so we need to split them and deal with them individually
//
//  @param req {object} request body sent from pagerduty
//
module.exports.parseRequest = function parseRequest (req, callback) {
    callback = callback || function() {};
    if (!_.isArray(req.messages)) {
        logger.error('parseRequest(req, callback): req.messages isnt an array.');
        callback(null);
    }

    var _messages = req.messages;

    _.forEach(_messages, callback);
};


//  Used for sending a single message
//
//  @param message_obj {object} a single message object sent from pagerduty
//
module.exports.sendMessage = function sendMessage (message_obj) {
    if (!_.isObject(message_obj)) {
        return null;
    }

    var colors = {
      triggered: '#D01D00',
      acknowledged: '#E5AB12'
    };

    var _message_options = {
        username: 'Pagerduty Incident',
        color: '#47BA04',
        icon_url: 'https://pbs.twimg.com/profile_images/482648331181490177/4X_QI2Vu_400x400.png'
    };
    var message             = new Dispatcher('#support', _message_options);

    var _type               = message_obj.type;
    var _incident           = message_obj.data.incident;
    var _incident_name      = _incident.trigger_summary_data.description;
    var _incident_number    = _incident.incident_number || '';
    var _assignee           = message_obj.data.assigned_to_user;

    // determine which type of message to send
    if (_type.match(/\.trigger$/i)) {
      message.bold('Triggered:')
             .write(_incident_name)
             .write('#'+_incident_number)
             .color(colors.triggered);
    } else if (_type.match(/\.acknowledge/i)) {
      message.bold('Acknowledged:')
             .write(_incident_name)
             .write('#'+_incident_number)
             .color(colors.acknowledged);
    } else if (_type.match(/\.resolve/i)) {
      message.bold('Resolved:')
             .write(_incident_name)
             .write('#'+_incident_number);
    // } else if (_type.match(/\.unacknowledge/i)) {
    //   message.write('unacknowledged:')
    //          .write(_incident_name)
    //          .write('#'+_incident_number);
    // } else if (_type.match(/\.assign/i)) {
    //   message.write(_incident_name)
    //          .write('#'+_incident_number)
    //          .write('assigned to')
    //          .write(_incident.assigned_to_user.name);
     } else {
       return;
     }
    // } else if (_type.match(/\.escalate/i)) {
    //     //message.write('escalated');
    //     return;
    // } else if (_type.match(/\.delegate/i)) {
    //     message.write('delegated to')
    //            .write(_incident.assigned_to_user.name+'.');
    // }

    if (_.has(_assignee, 'name')) {
      message.interpolate('assigned to: %s', _assignee.name);
    }

    // link for more details about the incident
    message.link('Details about this incident', _incident.html_url);

    message.send();
};
