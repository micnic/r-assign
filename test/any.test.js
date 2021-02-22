'use strict';

const tap = require('tap');
const { isAny, useAny } = require('r-assign/lib/any');

tap.test('isAny', (test) => {
	test.ok(isAny(null));
	test.notOk(isAny());
	test.end();
});

tap.test('useAny', (test) => {
	tap.test('No arguments', (t) => {
		const getAny = useAny();

		t.ok(typeof getAny() === 'undefined');
		t.equal(getAny(null), null);
		t.end();
	});

	tap.test('Default value provided', (t) => {
		const getAny = useAny(null);

		t.equal(getAny(), null);
		t.equal(getAny(null), null);
		t.end();
	});

	test.end();
});