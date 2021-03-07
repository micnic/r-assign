'use strict';

const { test } = require('tap');
const { isAny, useAny, parseAny } = require('r-assign/lib/any');

test('isAny', ({ end, notOk, ok }) => {
	notOk(isAny());
	ok(isAny(null));
	end();
});

test('parseAny', ({ end, equals, throws }) => {
	equals(parseAny(null), null);
	throws(() => {
		parseAny();
	});
	end();
});

test('useAny', ({ end, equals }) => {

	const getAny = useAny();

	equals(typeof getAny(), 'undefined');
	equals(getAny(null), null);

	const getAnyNull = useAny(null);

	equals(getAnyNull(), null);
	equals(getAnyNull(null), null);
	end();
});