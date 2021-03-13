'use strict';

const { test } = require('tap');
const { getAny, isAny, parseAny } = require('r-assign/lib/any');

test('getAny', ({ end, equals }) => {

	const getAnyNoDefault = getAny();

	equals(typeof getAnyNoDefault(), 'undefined');
	equals(getAnyNoDefault(null), null);

	const getAnyNull = getAny(null);

	equals(getAnyNull(), null);
	equals(getAnyNull(null), null);
	end();
});

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