var assert = require('chai').assert;
var slackUtils = require('../../internals/slack-utils');

describe('Slack Utilities', function () {

  describe('# User details', function () {
    it('only take a string as an argument', function () {
      assert.notOk( slackUtils.getUser(true) );
    });
    
    it('returns a promise', function () {
      var userObject = slackUtils.getUser('Jason');
      assert.typeOf( userObject.then, 'function' );
    });
    
    it('outputs a user object', function (done) {
      var userObject = slackUtils.getUser('Jason');
      userObject.then(function (user) {
        assert.isObject(user);
        done();
      });
    });
  });
});
