var _          = require('lodash');
var logger     = require('../logger').internals;
var Promise    = require('promise');

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
      
      var userResult = _.find(res.members, function (member) {
        if (member.profile.first_name === username) {
          return true;
        }
        if (member.name === username) {
          return true;
        }
      });
      
      if (_.isEmpty(userResult)) {
        reject('No user could be found with name: ' + username);
        return;
      }
      
      resolve(userResult);
    });
  }); 
};
