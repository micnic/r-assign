'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { getAny, isAny, parseAny } = require('r-assign/lib/any');

test('getAny', ({ end }) => {

	const getAnyNoDefault = getAny();

	equal(typeof getAnyNoDefault(), 'undefined');
	equal(getAnyNoDefault(null), null);

	const getAnyNull = getAny(null);

	equal(getAnyNull(), null);
	equal(getAnyNull(null), null);
	end();
});

test('isAny', ({ end }) => {
	notOk(isAny());
	ok(isAny(null));
	end();
});

test('parseAny', ({ end }) => {
	equal(parseAny(null), null);
	throws(() => {
		parseAny();
	});
	end();
});