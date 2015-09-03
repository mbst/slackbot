var net = require('net');
var assert = require('chai').assert;
var Loader = require('../../internals/bot-loader');

describe('Bot Loader', function () {
  var loader;
  
  beforeEach(function () {
    loader = new Loader();
  });
  
  it('is instance of loader', function () {
    assert.instanceOf(loader, Loader);
  });
  
  describe('Register bots', function () {
    it('register webhook', function () {
      assert( loader.registerWebhook('test') );
    });
    
    it('register command', function () {
      assert( loader.registerCommand('test') );
    });
  });
  
  describe('Server', function () {
    it('boots server on port', function (next) {
      var port = 9080;
      loader.boot(9080);
      var client = net.connect({port: port},
      function () {
        client.end();
        next();
      });
    });
  });


});
