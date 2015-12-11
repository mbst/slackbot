var _ = require('lodash');

var allowedList = [
	'#anything-else',
	'#atlas',
	'#blog-posts',
	'#coding',
	'#infra',
	'#listings',
	'#mb-feeds',
	'#office',
	'#pull-requests',
	'#support',
	'#team-tools',
	'#user-tools',
	'#ux',
	'#voila',
	'#websites'
]

module.exports = function(channel) {

	if (!_.isString(channel)) {
		return false;
	}

	channel = channel.trim();

	if (channel.charAt(0) !== '#') {
		channel = '#' + channel;
	}

	if (allowedList.indexOf(channel) > -1) {
		return true;
	}

	return false;

}