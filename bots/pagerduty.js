'use strict';
var express         = require('express'),
    common          = require('../lib/common'),
    logger          = require('../lib/logger').pagerdutybot,
    router          = express.Router(),
    dispatcher      = require('../lib/dispatcher'),
    _               = require('lodash'),
    Q               = require('q');


//  Used for parsing the incoming request
//
//  Pagerduty sometimes bundles up multiple events into a single request,
//  so we need to split them and deal with them individually
//
//  @param req {object} request body sent from pagerduty 
//
function parseRequest(req, callback) {
    if (!_.isArray(req.messages)) {
        logger.error('parseRequest(req, callback): req.messages isnt an array.')
        callback(null);
    }
    var _messages = req.messages;
    var callback = callback || function() {};
    _.forEach(_messages, callback);
}


//  Used for sending a single message
//
//  @param message_obj {object} a single message object sent from pagerduty
//
function sendMessage(message_obj) {
    if (!_.isObject(message_obj)) {
        return null;
    }

    var _message_options = {
        username: 'Pagerduty',
        color: '#47BA04',
        icon_url: 'https://pbs.twimg.com/profile_images/482648331181490177/4X_QI2Vu_400x400.png'
    };
    var message = new dispatcher('#support', _message_options), 
        _type = message_obj.type,
        _incident = message_obj.data.incident,
        _name = _incident.trigger_summary_data.subject || _incident.service.name,
        _incident_number = _incident.incident_number || '';

    message.write('Incident')

    // determine which type of message to send
    if (_type.match(/\.trigger$/i)) {
        message.write('triggered:')
               .write(_name)
               .write('#'+_incident_number);
    }else if (_type.match(/\.acknowledge/i)) {
        message.write('acknowledged:')
               .write(_name)
               .write('#'+_incident_number);
    }else if (_type.match(/\.resolve/i)) {
        message.write('resolved:')
               .write(_name)
               .write('#'+_incident_number);
    }else if (_type.match(/\.unacknowledge/i)) {
        message.write('unacknowledged:')
               .write(_name)
               .write('#'+_incident_number);
    }else if (_type.match(/\.assign/i)) {
        message.write(_name)
               .write('#'+_incident_number)
               .write('assigned to')
               .write(_incident.assigned_to_user.name);
    }else if (_type.match(/\.escalate/i)) {
        //message.write('escalated');
    }else if (_type.match(/\.delegate/i)) {
        message.write('delegated to')
               .write(_incident.assigned_to_user.name+'.');
    }

    // link for more details about the incident
    message.link('Details about this incident', _incident.html_url);

    message.send();
}

router.post('/', function(req, res) {
    var _body = req.body || null;
    parseRequest(_body, sendMessage);
    res.end();
})

module.exports = router;