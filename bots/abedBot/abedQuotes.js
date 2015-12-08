module.exports = {
	quotes: [
		'Cool. Cool cool cool.',
		'Come with me if you don\'t want paint on your clothes.',
		'Six seasons and a movie!',
		'I remember when this show was about a community college.',
		'As far back as I can remember, I always wanted to be in a Mafia movie.'

	],
	getQuote: function() {
		return this.quotes[Math.floor((Math.random()*(this.quotes.length)))];
	}
}