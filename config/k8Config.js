module.exports = {
  "env": process.env.ENV || "prod",
  "jenkins_auth_password": process.env.JENKINS_AUTH_PASSWORD,
  "jenkins_auth_user": process.env.JENKINS_AUTH_USER,
  "jenkins_host": process.env.JENKINS_HOST || "ci.mbst.tv",
  "jira_auth_password": process.env.JIRA_AUTH_PASSWORD,
  "jira_auth_user": process.env.JIRA_AUTH_USER,
  "jira_host": process.env.JIRA_HOST || "jira.metabroadcast.com",
  "pagerduty_api_key": process.env.PAGERDUTY_API_KEY,
  "port": process.env.PORT || "3000",
  "slack_api_token": process.env.SLACK_API_TOKEN,
  "slack_webhook_url": process.env.SLACK_WEBHOOK_URL,
  "tokens": {
    "abed": process.env.TOKENS_ABED,
    "bitbucket": process.env.TOKENS_BITBUCKET,
    "github": process.env.TOKENS_GITHUB,
    "healthcheck": process.env.TOKENS_HEALTHCHECK,
    "jenkins": process.env.TOKENS_JENKINS,
    "jira": process.env.TOKENS_JIRA,
    "jiraSupport": process.env.TOKENS_JIRA_SUPPORT,
    "pagerduty": process.env.TOKENS_PAGERDUTY,
    "test": process.env.TOKENS_TEST
  }
};
