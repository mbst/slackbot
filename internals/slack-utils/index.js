var common = require('../common');
var Slack = require('slack-node');

function slackUtils () {
  var slack = new Slack(common.slack.api_token);
  this.slackService = slack;
}

slackUtils.prototype.getUser = require('./get-user');

module.exports = new slackUtils();
