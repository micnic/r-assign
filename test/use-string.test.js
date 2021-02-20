'use strict';

const tap = require('tap');
const useString = require('r-assign/lib/use-string');

tap.test('No arguments', (test) => {
	const getString = useString();

	test.equal(getString(), '');
	test.equal(getString('data'), 'data');
	test.equal(getString(null), '');
	test.end();
});

tap.test('Default value provided', (test) => {
	const getString = useString('data');

	test.equal(getString(), 'data');
	test.equal(getString('data'), 'data');
	test.equal(getString(null), 'data');
	test.end();
});

tap.test('Invalid default value provided', (test) => {
	test.throws(() => {
		useString(null);
	});
	test.end();
});