var fs = require('fs');
var assert = require('chai').assert;
var Loggers = require('../../internals/logger');

var testLog;
var testLogFile;

describe('Logger', function () {
  beforeEach(function () {
    testLog = Loggers.test;
  });

  describe('#log', function () {
    it('should write a log to test file', function () {

    });
  });

  describe('#warn', function () {
    it('should write a warning to test file', function () {

    });
  });

  describe('#error', function () {
    it('should write a error to test file', function () {

    });
  });

  describe('#dev', function () {
    it('should only log in development mode', function () {

    });
  });

});
