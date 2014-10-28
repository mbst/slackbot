'use strict';
var express     = require('express'),
    common      = require('../lib/common'),
    logger      = require('../lib/logger').jirabot,
    _           = require('lodash'),
    https       = require('https'),
    Q           = require('q');

function JiraProvider() {
    this.host = common.jira.host;
}


//  Used for making secure http requests to jira
//
//  @param path {string}
//  @param type {string} 'GET' by default
//
JiraProvider.prototype.requestWithAuth = function(path, type) {
    var defer = Q.defer();
    if (!_.isString(path)) {
        logger.error('JiraProvider.prototype.requestWithAuth(path, type): path argument must be string'); 
        defer.reject(new Error('path argument must be string'));
        return;
    }
    var _type = type || 'GET',
        _host = this.host,
        _auth = common.jira.auth.user+':'+common.jira.auth.password;

    var options = {
        hostname: _host,
        path: path,
        method: _type,
        auth: _auth
    }

    console.log(options)

    https.request(options, function(res) {
        var _body = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            _body += chunk;
        });
        res.on('end', function() {
            var data = JSON.parse(_body);
            defer.resolve(data);
        })
    }).end();
    return defer.promise;
}


//  Used for returning information about a feature from Jira
//
//  @param featureId {string}
//  
JiraProvider.prototype.getFeature = function(featureId) {
    var defer = Q.defer();
    var _endpoint = '/rest/api/2/issue/';
    if (!_.isString(featureId)) {
        logger.error('JiraProvider.prototype.getFeature(featureId): featureId argument must be a string'); 
        defer.reject(new Error('featureId arg must be a string'));
        return;
    }
    this.requestWithAuth(_endpoint+featureId).then(function(featuredata) {
        defer.resolve(featuredata)
    });
    return defer.promise;
}

module.exports = JiraProvider;