var assert = require('chai').assert;
var Dispatcher = require('../../internals/dispatcher');

var dispatcher;

describe('Dispatcher', function () {
  beforeEach(function () {
    dispatcher = new Dispatcher();
  });

  it('should initialise with options object', function () {
    assert.typeOf(dispatcher.options, 'object');
  });


  describe('#write', function () {
    it('should write string to internal message array', function () {
      dispatcher.write('hello there slackbot');
      assert.strictEqual('hello there slackbot', dispatcher.message[0]);
    });
  });


  describe('#interpolate', function () {
    it('should write interpolated string to internal message array', function () {
      dispatcher.interpolate('hello %s %s', 'there', 'slackbot');
      assert.strictEqual('hello there slackbot', dispatcher.message[0]);
    });
  });

});
