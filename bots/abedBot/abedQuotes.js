module.exports = {
	quotes: [
		'Cool. Cool cool cool.',
		'Cool. Cool cool cool.',
		'Cool. Cool cool cool.',
		'Come with me if you don\'t want paint on your clothes.',
		'I remember when this show was about a community college.',
		'As far back as I can remember, I always wanted to be in a Mafia movie.',
		'We\re like Goonies, except our story tracks logically.',
		'We\'re really filling in some plot holes here.',
		'That man saved my life...in a video game.',
		'This is amazing, and possible in real time!',
		'We\'re together, that makes this the perfect timeline.',
		'We named the yam \'Pam\'. It rhymed.',
		'I need help reacting to something.',
		'I painted a tunnel on the side of the library. When it dries, I\'m going for it.'
	],
	getQuote: function() {
		return this.quotes[Math.floor((Math.random()*(this.quotes.length)))];
	}
}