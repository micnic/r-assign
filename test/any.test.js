'use strict';

const { test, equals, notOk, ok, throws } = require('tap');
const { getAny, isAny, parseAny } = require('r-assign/lib/any');

test('getAny', ({ end }) => {

	const getAnyNoDefault = getAny();

	equals(typeof getAnyNoDefault(), 'undefined');
	equals(getAnyNoDefault(null), null);

	const getAnyNull = getAny(null);

	equals(getAnyNull(), null);
	equals(getAnyNull(null), null);
	end();
});

test('isAny', ({ end }) => {
	notOk(isAny());
	ok(isAny(null));
	end();
});

test('parseAny', ({ end }) => {
	equals(parseAny(null), null);
	throws(() => {
		parseAny();
	});
	end();
});