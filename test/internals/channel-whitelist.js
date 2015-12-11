var whitelist = require('../../internals/channel-whitelist');

describe('Allowed chat channel inputs', function() {

	it('is true when an allowed channel is given with hash', function() {
		var result = whitelist('#atlas');
		expect(result).toBe(true);
	});

	it('is true when an allowed channel is given without hash', function() {
		var result = whitelist('voila');
		expect(result).toBe(true);
	});

	it('is true when an allowed channel is given with white space', function() {
		var result = whitelist('    coding   ');
		expect(result).toBe(true);
	});
});

describe('Disallowed chat channel inputs', function() {

	it('is false when a nonexistent channel is given', function() {
		var result = whitelist('this-suit-is-black-pause-naaaat');
		expect(result).toBe(false);
	});

	it('is false when an allowed channel is provided in incorrect format', function() {
		var result = whitelist('#    blog-posts');
		expect(result).toBe(false);
	});

	it('is false when provided channel is an int', function() {
		var result = whitelist(1337);
		expect(result).toBe(false);
	});

	it('is false when provided channel is a boolean', function() {
		var result = whitelist(true);
		expect(result).toBe(false);
	});

	it('is false when provided channel is an array', function() {
		var result = whitelist([1, 'hello']);
		expect(result).toBe(false);
	});

	it('is false when provided channel is an object', function() {
		var result = whitelist({'channel': 'anything-else'});
		expect(result).toBe(false);
	});

});