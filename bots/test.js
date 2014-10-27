'use strict';
var express     = require('express'),
    router      = express.Router(),
    logger      = require('../lib/logger').testbot,
    dispatcher  = require('../lib/dispatcher');

// a test endpoint, just because its fun ;)
router.route('/').get( function(req, res) {
    var output = [], options = {};
    output.push('✋');    
    output.push('🌏');
    options.username = 'Bot';
    options.icon_url = 'http://4.bp.blogspot.com/-WUaQ2KqGsDQ/U16s6Lyfa8I/AAAAAAAAAm0/S0QEvchffd8/s1600/khvQssw.png';
    var message = dispatcher('#anything-else', options);
    dispatcher.message = output;
    dispatcher.send();
    logger.log('Hello slack');
    res.end();
});

module.exports = router;