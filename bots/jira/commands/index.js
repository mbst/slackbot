'use strict';
var command     = require('express').Router();
var Dispatcher  = require('../../../internals/dispatcher'); 
var logger      = require('../../../internals/logger').jirabot;
var Jira        = require('../resources/jira-service');
var jiraUtils   = require('../resources/jira-utils');

var jiraService = new Jira();

var message_options = {
  username: 'Jira',
  color: '#053663'
};
var dispatcher = new Dispatcher('#mb-feeds', message_options);
dispatcher.avatar('http://i.imgur.com/nB41VgE.png');

command.route('/').post(
function(req, res) {  
  var body = req.body || {};
  var message = body.text;
  var command = body.command;
  var userName = body.user_name;
  var chatName = body.channel_name;
  
  logger.log({incomingCommand: body});
  
  dispatcher.chat(chatName);
  
  if (command === '/ticket') {
    var ticketParser = jiraUtils.ticketParser(message, userName);
    
    if (! ticketParser) {
      dispatcher.write('Ticket could not be created :(').send();
      res.end();
      return;
    }
    
    ticketParser.then(
    function (ticket) {
      jiraService.createTicket(ticket.summary, ticket.projectKey, ticket.assignee, ticket.estimate).then(
      function (res) {
        var ticketNumber = res.key;
        dispatcher.write('Your ticket was created!')
                  .link('[Go to ticket]', 'https://jira.metabroadcast.com/browse/' + ticketNumber)
                  .send();
      }, 
      function () {
        dispatcher.write('Oh deer. Your ticket couldn\'t be created :(')
                  .send();
      });
    });
  } else {
    logger.warn({message: 'Invalid slash command', command: command});
  }
  
  res.end();
});

module.exports = command;
