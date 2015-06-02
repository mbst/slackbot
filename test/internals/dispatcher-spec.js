var assert = require('chai').assert;
var Dispatcher = require('../../internals/dispatcher');

var dispatcher;
var defaultChatname = '#anything-else';

describe('Dispatcher', function () {
  beforeEach(function () {
    dispatcher = new Dispatcher(defaultChatname);
  });


  it('should instantiate with options object', function () {
    assert.typeOf(dispatcher.options, 'object');
  });

  it('should instantiate with empty message array', function () {
    assert.typeOf(dispatcher.message, 'array');
    assert.lengthOf(dispatcher.message, 0);
  });

  it('should instantiate with passed in chat name', function () {
    assert.equal(dispatcher.chatname, defaultChatname);
  });

  describe('#botname', function () {
    it('should change the name of the bot that is shown in chat', function () {
      dispatcher.botname('Test Bot');
      assert.strictEqual('Test Bot', dispatcher.options.username);
    });

    it('should be chainable', function () {
      var check = dispatcher.botname('Test Bot');
      assert.instanceOf(check, Dispatcher);
    });
  });

  describe('#link', function () {
    it('should write a link to internal message array', function () {
      dispatcher.link('hello there slackbot');
      assert.lengthOf(dispatcher.message, 1);
    });

    it('should encode html entities', function () {
      dispatcher.link('<hello&slack>', 'http://mbst.tv');
      assert.strictEqual('<http://mbst.tv|&lt;hello&amp;slack&gt;>', dispatcher.message[0]);
    });

    it('should format link correctly', function () {
      dispatcher.link('hello slackbot', 'http://mbst.tv');
      assert.strictEqual('<http://mbst.tv|hello slackbot>', dispatcher.message[0]);
    });

    it('should be chainable', function () {
      var check = dispatcher.link('hello', 'http://mbst.tv');
      assert.instanceOf(check, Dispatcher);
    });
  });


  describe('#write', function () {
    it('should write string to internal message array', function () {
      dispatcher.write('hello there slackbot');
      assert.strictEqual('hello there slackbot', dispatcher.message[0]);
    });

    it('should be chainable', function () {
      var check = dispatcher.write('Hello slackbot');
      assert.instanceOf(check, Dispatcher);
    });
  });


  describe('#break', function () {
    it('should push a line break character before message, then into the internal messages array', function () {
      dispatcher.break('hello there slackbot');
      assert.strictEqual('\nhello there slackbot', dispatcher.message[0]);
    });

    it('should work without argument', function () {
      dispatcher.break();
      assert.strictEqual('\n', dispatcher.message[0]);
    });

    it('should be chainable', function () {
      var check = dispatcher.break('Hello slackbot');
      assert.instanceOf(check, Dispatcher);
    });
  });


  describe('#bold', function () {
    it('should write the provided string in markdown-formatted bold', function () {
      dispatcher.bold('hello there slackbot');
      assert.strictEqual('*hello there slackbot*', dispatcher.message[0]);
    });

    it('should be chainable', function () {
      var check = dispatcher.bold('Hello slackbot');
      assert.instanceOf(check, Dispatcher);
    });
  });


  describe('#interpolate', function () {
    it('should write interpolated string to internal message array', function () {
      dispatcher.interpolate('hello %s %s', 'there', 'slackbot');
      assert.strictEqual('hello there slackbot', dispatcher.message[0]);
    });

    it('should be chainable', function () {
      var check = dispatcher.interpolate('hello %s %s', 'there', 'slackbot');
      assert.instanceOf(check, Dispatcher);
    });
  });


  describe('#avatar', function () {
    it('should update the avatar image URL', function () {
      dispatcher.avatar('http://bukk.it/deal.gif');
      assert.strictEqual('http://bukk.it/deal.gif', dispatcher.options.iconUrl);
    });

    it('should be chainable', function () {
      var check = dispatcher.avatar('http://bukk.it/deal.gif');
      assert.instanceOf(check, Dispatcher);
    });
  });


  describe('#chat', function () {
    it('should update the specified chat', function () {
      dispatcher.chat('#test-chat');
      assert.strictEqual('#test-chat', dispatcher.chatname);
    });

    it('should automatically add hash to chat name, if its missing', function () {
      dispatcher.chat('test-chat');
      assert.strictEqual('#test-chat', dispatcher.chatname);
    });

    it('should be chainable', function () {
      var check = dispatcher.chat('#test-chat');
      assert.instanceOf(check, Dispatcher);
    });
  });


  describe('#send', function () {
    it('should return a promise', function () {
      dispatcher.write('Hello slackbot');
      dispatcher.chat('#anything-else');
      assert.typeOf(dispatcher.send().then, 'function');
    });

    it('should fail if message or chatname aren\'t populated', function (done) {
      dispatcher.message = null;
      dispatcher.chatname = null;
      dispatcher.send().then(
      function () { assert(false); done(); },
      function () { assert(true); done(); }
      );
    });
  });

});
