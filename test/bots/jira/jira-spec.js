var assert = require('chai').assert;
var hippie = require('hippie');

var jiraUtils = require('../../../bots/jira/resources/jira-utils');
var jiraWebhookStub = require('./stubs/issue_updated_resolved.json');

var devUrl = 'http://dev.mbst.tv:8000';

describe('Jira Bot', function () {
  describe('#endpoint: /webhooks/jira', function () {  
    it('it should return 200', function () {
      var endpoint = devUrl + '/webhooks/jira';
      return hippie()
        .json()
        .url(endpoint)
        .method('POST')
        .send(jiraWebhookStub)
        .expect(200);
    });
  });
});


describe('Jira Utils', function () {
  describe('#Formatter', function () {
    it('Should return valid message when given only first (taskdata) argument', function () {
      var output = jiraUtils.formatter( jiraWebhookStub );
      assert.equal(output, 'Jason Howmans closed issue <http://jira.metabroadcast.com/browse/MBST-11583|Work with team on improving ouputs>');
    });
    
    it('Should return empty string if no arguments are passed', function () {
      var output = jiraUtils.formatter();
      assert.equal(output, '');
    });
  });
});
