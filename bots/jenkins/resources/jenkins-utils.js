'use strict';
var Q = require('q');
var request = require('request');
var common = require('../../../internals/common');
var logger = require('../../../internals/logger').jenkins;

var jobs = [];

var jenkins = 'http://' + common.jenkins.auth.user + ':' + common.jenkins.auth.password + '@' + common.jenkins.host;

var sillyFallbackToCheckXMLForErrors = function (response) {
  if (response.indexOf('Error 404 Not Found') !== -1 || response.indexOf('This build requires parameters') !== -1) {
    return false;
  }
  return true;
};

/*
 get a list of jobs from jenkins
 http://ci.mbst.tv:8080/view/All/api/json
 */
function getJobs () {
  request(jenkins + '/view/All/api/json', function(error, response, body) {
    if (error || !sillyFallbackToCheckXMLForErrors(body)) {
      logger.log('✘ Couldn\'t get jobs [jenkins]');
    } else {
      try {
        body = JSON.parse(body);
      } catch (e) {
        logger.log('✘ Couldn\'t parse jobs JSON [jenkins]');
      }
      if (body.jobs) {
        jobs = body.jobs;
        logger.log('✔︎ Recieved Jobs [jenkins]');
      } else {
        logger.log('✘ Couldn\'t get jobs [jenkins]');
      }
    }
  });

  logger.log('\tGetting jobs [jenkins]');
}

/*
 get a single job from local cache
 */
function getJob(name) {
  var deferred = Q.defer();
  var found = [];

  if (jobs.length > 0) {
    found = jobs.filter(function (job) {
      if (job.name === name) {
        return job;
      }
    });
  }

  if (found.length > 0) {
    deferred.resolve(found[0]);
  } else {
    deferred.reject('Job `' + name + '` doesn\'t exist');
  }
  return deferred.promise;
}

/*
 get the status of a single job
 http://ci.mbst.tv:8080/job/:name/api/json
 */
function getJobStatus(name) {
  var deferred = Q.defer();

  getJob(name).then(function (success) {
    deferred.resolve('getting job status');
  }, deferred.reject);
  return deferred.promise;
}

/*
 get the params of a job, from the config.xml
 http://ci.mbst.tv:8080/job/:name/config.xml
 */
function getJobRequiredParams(name) {
  var deferred = Q.defer();

  getJob(name).then(function (success) {
    deferred.resolve('getting job required params');
  }, deferred.reject);
  return deferred.promise;
}

/*
 build a job
 http://ci.mbst.tv:8080/job/:name/build
 http://ci.mbst.tv:8080/job/:name/buildWithParameters
 */
function buildJob() {
  var deferred = Q.defer();

  var params = [];
  for (var i = 0, ii = arguments.length; i < ii; i += 1) {
    params.push(arguments[i]);
  }

  var name = params.shift();

  getJob(name).then(function (success) {
    getJobRequiredParams(name).then(function (success) {
      if (params) {
        var _params = {};
        params.forEach(function (param) {
          _params[param.split('=')[0]] = param.split('=')[1];
        });
        request({
          uri: jenkins + '/job/' + name + '/buildWithParameters',
          method: 'POST',
          form: _params
        }, function (error, response, body) {
          if (error || !sillyFallbackToCheckXMLForErrors(body)) {
            deferred.reject('There was a problem building the job');
          } else {
            deferred.resolve('building');
          }
        });
      } else {
        request(jenkins + '/job/' + name + '/build', function (error, response, body) {
          if (error || !sillyFallbackToCheckXMLForErrors(body)) {
            deferred.reject('There was a problem building the job');
          } else {
            deferred.resolve('building');
          }
        });
      }
    }, deferred.reject);
  }, deferred.reject);
  return deferred.promise;
}

getJobs();

module.exports = {
  commands: {
    build: buildJob
  }
};