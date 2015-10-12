var instance_config = require('../config/instance-config.js') || {};

module.exports =  {
  env: instance_config.env || 'dev',
  port: instance_config.port || 8287,

  slack: {
    integration_token: instance_config.slack_integration_token,
    api_token: instance_config.slack_api_token
  },

  jira: {
    host: instance_config.jira_host,
    auth: {
      user: instance_config.jira_auth_user,
      password: instance_config.jira_auth_password
    }
  }
};
