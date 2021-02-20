'use strict';

const tap = require('tap');
const useBoolean = require('r-assign/lib/use-boolean');

tap.test('No arguments', (test) => {
	const getBoolean = useBoolean();

	test.equal(getBoolean(), false);
	test.equal(getBoolean(true), true);
	test.equal(getBoolean(false), false);
	test.equal(getBoolean(null), false);
	test.end();
});

tap.test('Default value provided', (test) => {
	const getBoolean = useBoolean(true);

	test.equal(getBoolean(), true);
	test.equal(getBoolean(true), true);
	test.equal(getBoolean(false), false);
	test.equal(getBoolean(null), true);
	test.end();
});

tap.test('Invalid default value provided', (test) => {
	test.throws(() => {
		useBoolean(null);
	});
	test.end();
});