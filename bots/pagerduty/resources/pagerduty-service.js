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
      acknowledged: '#E5AB12',
      resolved: '#47BA04'
    };

    var _message_options = {
        username: 'Incident - Pagerduty',
        color: colors.resolved
    };

    var message = new Dispatcher('#support', _message_options);
    message.avatar( 'http://i.imgur.com/CsoyiUT.jpg' );

    var _type               = message_obj.type;
    var _incident           = message_obj.data.incident;
    var _incident_name      = _incident.trigger_summary_data.description || 'incident';
    var _incident_number    = _incident.incident_number || '';
  
    if (!_incident_name) {
      logger.log(_incident);
    }

    // determine which type of message to send
    // TODO: more explicit in every action whether true / false
    if (_type.match(/\.trigger/i)) {
      message.bold('Triggered:')
             .link(_incident_name, _incident.html_url)
             .write('#'+_incident_number)
             .color(colors.triggered);
    } else if (_type.match(/\.acknowledge/i)) {
      message.bold('Acknowledged:')
             .link(_incident_name, _incident.html_url)
             .write('#'+_incident_number)
             .color(colors.acknowledged);
    } else if (_type.match(/\.resolve/i)) {
      message.bold('Resolved:')
             .link(_incident_name, _incident.html_url)
             .write('#'+_incident_number);
     } else {
       logger.log({'not_sent': JSON.stringify(message_obj)});
       return;
     }

     var userName;
    if (_.has(_incident, 'resolved_by_user')) {
      userName = _.has(_incident.resolved_by_user, 'name') ? _incident.resolved_by_user.name : '';
      message.interpolate('resolved by: %s', userName);
    } else if (_.has(_incident, 'assigned_to_user')) {
      userName = _.has(_incident.assigned_to_user, 'name') ? _incident.assigned_to_user.name : '';
      message.interpolate('assigned to: %s', userName);
    }

    message.send();
};
