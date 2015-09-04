var assert = require('chai').assert;
var hippie = require('hippie');

var jiraUtils = require('../../../bots/jira/resources/jira-utils');
var jiraWebhookStub = require('./stubs/issue_updated_resolved.json');

var devUrl = 'http://dev.mbst.tv:8000';

describe('Jira Bot', function () {
  describe('#endpoint: /webhooks/jira', function () {  
    it('returns 200', function () {
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
  describe('# Formatter', function () {
    it('Should return valid message when given only first (taskdata) argument', function () {
      var output = jiraUtils.formatter( jiraWebhookStub );
      assert.equal(output, 'Jason Howmans closed issue <http://jira.metabroadcast.com/browse/MBST-11583|Work with team on improving ouputs>');
    });
    
    it('Should return empty string if no arguments are passed', function () {
      var output = jiraUtils.formatter();
      assert.equal(output, '');
    });
  });
  
  describe('# Ticket Parser', function () {
    var validTicket = 'me, do a thing, MBST-1234, 2h';
    var invalidTicket = 'me, do a thing';
    var username = 'Jason';
    
    it('fails if not passed a ticket and username as strings', function () {
      assert.notOk( jiraUtils.ticketParser(101, null) );
    });
    
    it('fails if given an invalid string', function () {
      assert.notOk( jiraUtils.ticketParser(invalidTicket, username) );
    });
    
    it('outputs an object', function () {
      assert.isObject( jiraUtils.ticketParser(validTicket, username) );
    });
    
    it('should output correct summary property', function () {
      var check = jiraUtils.ticketParser(validTicket, username);
      
      check.then(function (parsed) {
        assert.property(parsed, 'summary');
        assert.equal(parsed.summary, 'do a thing');
        done();
      });
    });
    
    it('should output correct projectKey property', function () {
      var check = jiraUtils.ticketParser(validTicket, username);
      
      check.then(function (parsed) {
        assert.property(parsed, 'projectKey');
        assert.equal(parsed.projectKey, 'MBST-1234');
        done();
      });
    });
    
    it('should output correct assignee when \'me\' is used', function () {
      var check = jiraUtils.ticketParser(validTicket, username);
      
      check.then(function (parsed) {
        assert.property(parsed, 'assignee');
        assert.equal(parsed.assignee.fullName, 'Jason Howmans');
        done();
      });
    });
    
    it('should output correct assignee when \'@name\' is used', function () {
      var nameConversion = '@chris, do a thing, MBST-1234, 2h';
      var check = jiraUtils.ticketParser(nameConversion, username);
      
      check.then(function (parsed) {
        assert.property(parsed, 'assignee');
        assert.equal(parsed.assignee.fullName, 'Chris Jackson');
        done();
      });
    });
    
    it('should output correct estimate property', function (done) {
      var check = jiraUtils.ticketParser(validTicket, username);
      
      check.then(function (parsed) {
        assert.property(parsed, 'estimate');
        assert.equal(parsed.estimate, '2h');
        done();
      });
    });
  });
});
