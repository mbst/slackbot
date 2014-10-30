'use strict';
var express         = require('express'),
    common          = require('../lib/common'),
    logger          = require('../lib/logger').pagerdutybot,
    router          = express.Router(),
    dispatcher      = require('../lib/dispatcher'),
    _               = require('lodash'),
    Q               = require('q');

router.post('/', function(req, res) {
    var _body = req.body || null;

    var _message_options = {
        username: 'Pagerduty',
        color: '#47BA04',
        icon_url: 'https://pbs.twimg.com/profile_images/482648331181490177/4X_QI2Vu_400x400.png'
    };
    var message = new dispatcher('#support', _message_options);
    console.log(JSON.stringify(_body));
})

module.exports = router;