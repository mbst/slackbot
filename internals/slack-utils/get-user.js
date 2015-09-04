var _ = require('lodash');
var Promise = require('promise');
var logger     = require('../logger').internals;

module.exports = function (username) {
  var self = this;
  
  if (! _.isString(username)) {
    logger.warn('Username property must be string');
    return false;
  }
  
  return new Promise( function (resolve, reject) {
    self.slackService.api('users.list', function (err, res) {
      if (err) {
        logger.error(err);
        reject(err);
        return;
      }
      
      var userResult = _.find(res.members, function (it) {
        if (it.profile.first_name === username) {
          return true;
        }
        if (it.name === username) {
          return true;
        }
      });
      
      if (_.isEmpty(userResult)) {
        var msg = 'No user could not be found';
        logger.warn(msg);
        reject(msg);
        return;
      }
      
      resolve(userResult);
    });
  }); 
};
