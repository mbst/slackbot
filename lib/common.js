var instance_config = require('../config/instance-config.js') || {};

module.exports =  {
    port: instance_config.port || 8287,

    slack: {
        token: instance_config.slack_token
    },

    jira: {
        host: instance_config.jira_host,
        auth: {
            user: instance_config.jira_user,
            password: instance_config.jira_password
        }
    }
}