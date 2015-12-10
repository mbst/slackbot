```
███████╗██╗      █████╗  ██████╗██╗  ██╗██████╗  ██████╗ ████████╗
██╔════╝██║     ██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔═══██╗╚══██╔══╝
███████╗██║     ███████║██║     █████╔╝ ██████╔╝██║   ██║   ██║   
╚════██║██║     ██╔══██║██║     ██╔═██╗ ██╔══██╗██║   ██║   ██║   
███████║███████╗██║  ██║╚██████╗██║  ██╗██████╔╝╚██████╔╝   ██║   
╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝  ╚═════╝    ╚═╝   
```

##About Slackbot

##How it works

###WebHooks
Slack has a link which other services can send `POST` requests to and, if the POST data are in the correct format, Slack will respond accordingly. For the details about Slack's expected payload format, check this link: [https://api.slack.com/incoming-webhooks](https://api.slack.com/incoming-webhooks)

To check what WebHooks are registered (and active), sign into Slack through the web and open `Incoming WebHooks` from this menu: [https://metabroadcast.slack.com/services](https://metabroadcast.slack.com/services).

###Slash commands
The LoveBot is an example of a slash command in use. If the user types in `/love user` then this sends a `POST` request to Slackbot which responds with a webhook to the Slack API, causing it to post something like: `@user if you were an ebay auction, I'd totally Buy It Now.` This is just an example - the microservice can be set up to respond in any way from the request and doesn't necessarily need to send information back to Slack.

To check what slash commands are registered (and active), sign into Slack through the web and open `Slash Commands` from this menu: [https://metabroadcast.slack.com/services](https://metabroadcast.slack.com/services).

###How is accesses Slack channels - about Slackbot's security

Slackbot needs two things to access MetaBroadcast's Slack channels - the `API Token` and the `WebHook URL`. Both of these are configured by logging into Slack via the web. Unfortunately, neither of these can be registered to an 'organisation' as a whole so it's possible that, if either the API Token or WebHook URL we're using are disabled, they were registered to a user that has since left. In this case, ask in chat if there is another one that should be used or if it would be appropriate to create a new one. Creating new API Tokens too liberally poses a security risk.

##Technologies Used

Mbst Slackbot is written in node.js but is currently **not** based on [BESK](https://bitbucket.org/mbst/besk) (refactor being considered for future versions). Here's a list of the NPM modules used.

* body-parser
* bunyan
* chai
* express
* hippie
* html-entities
* lodash
* mocha
* promise
* q
* request
* slack-node

##Working with Mbst Slackbot

###Introduction to Mbst Slackbot

Slackbot uses the express.js router to set up endpoints for individual bots that wait for `POST` requests from other services. Our rule is to only have one bot (and thus, one endpoint) for each action to make it more modular.

These requests can come from...

####External Services

Currently, bots are set up for:

* BitBucket
* GitHub
* Jenkins
* Jira
* Pagerduty

When the appropriate action is triggered on any of these services, they send the details of said action to Slackbot which will then report it in the appropriate channel. Each of these services needs to be set up individually to determine the triggering action(s) and where the details-of-action payload gets sent.

####Slack itself

The only such command right now is LoveBot - when a user types `/love user`, Slack sends a payload to Slackbot which includes the name of 'user'. Slackbot then processes this into a payload which is sent to Slack's incoming webhook URL (not a direct HTTP response) that causes the message that results.

###Running slackbot locally

1. Make sure that [node.js](https://nodejs.org/en/) is installed on your system.
2. Clone the repository to get a local copy of it.
3. `cd` to the root directory of the repository that should contain `package.json`.
4. Install the npm modules with `npm install`.
5. Copy `config/instance-config.sample.js` and rename it to `instance-config.js`.
6. Get the Slack API Token and WebHook URL and add them to the object in `instance-config.js`. From where, you ask? Well...
7. Run Slackbot with `node index.js`.

###Now what?

Since a lot of Slackbot's functionality involves waiting for requests from other services which are posting to Slackbot live and not to one's localhost, it's difficult to test or observe functionality when running it locally. However, it's possible to trigger the events by emulating the external services as opposed to using the live service itself.

If testing BitbucketBot, check out its [WebHook API documentation](https://confluence.atlassian.com/bitbucket/manage-webhooks-735643732.html) and use Chrome's [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) to send a `POST` request to the respective endpoint on your localhost (for Bitbucket it will likely be [http://localhost:8000/webhooks/bitbucket/](http://localhost:8000/webhooks/bitbucket/)).

There is a system in place to stop events triggered locally from reaching the Slack channels to prevent them from being spammed during development. To stop this from happening (if you're keen to test in real time - remember to inform the team to expect some spam), go to `internals/dispatcher.js` and comment out the following lines:

```if (botUtils.isDev()) {
  logger.log(messageObject);
  defer.resolve( messageObject );
  return defer.promise;
}```

**USE THIS WITH CAUTION.** This is purely for dev-testing and is not to be abused.

##Notes

* `config/instance-config.js` is deliberately kept in `.gitignore` as the access token and webhook URL **are not to be committed**. Populate them manually when cloning the repository.
* Keep the core well tested.
* The core is for registering bots and interacting with Slack.
* Bots are for specific tasks and should be isolated.
* Single responsibility principle: a bot should only do one thing and do it well.

##Future work

* Improve the loader to autoload bots from the `/bots` directory instead of registering them manually.
* Install monitoring & forever so the bot doesn't randomly get taken down.
* Work to improve the core based on the philosophy mentioned above: the core is for registering bots and interacting with Slack while the bots are for specific tasks.
* Jason mentioned in his handover that he'd love to open-source Slackbot properly and make it easy to configure for beginners.

##Reading

* [Express](http://expressjs.com/en/index.html) - a web application framework for node.js.
* [slack-node](https://www.npmjs.com/package/slack-node) - the npm module we use for easier interaction with the Slack API.

