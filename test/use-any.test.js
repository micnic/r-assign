'use strict';

const tap = require('tap');
const useAny = require('r-assign/lib/use-any');

tap.test('No arguments', (test) => {
	const getAny = useAny();

	test.ok(typeof getAny() === 'undefined');
	test.equal(getAny(null), null);
	test.end();
});

tap.test('Default value provided', (test) => {
	const getAny = useAny(null);

	test.equal(getAny(), null);
	test.equal(getAny(null), null);
	test.end();
});