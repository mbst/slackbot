'use strict';
var express     = require('express'),
    router      = express.Router(),
    logger      = require('../lib/logger').testbot,
    dispatcher  = require('../lib/dispatcher');

// a test endpoint, just because its fun ;)
router.route('/').get( function(req, res) {
    var output = [], options = {};
    output.push('Revolver Ocelot');    
    output.push('has updated issue');
    output.push('<http://metabroadcast.com|An issue>');
    output.push('in the feature <http://google.com|Something else>');
    options.username = 'TestBot';
    options.icon_url = 'http://4.bp.blogspot.com/-WUaQ2KqGsDQ/U16s6Lyfa8I/AAAAAAAAAm0/S0QEvchffd8/s1600/khvQssw.png';
    //dispatcher.send('#anything-else', output.join(' '), options);
    logger.log('Hello slack');
    res.end();
});

module.exports = router;