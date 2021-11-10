'use strict';

const { test, equal, ok } = require('tap');
const { getAny, isAny, parseAny } = require('r-assign/lib/any');

test('getAny', ({ end }) => {
	equal(getAny(), undefined);
	equal(getAny(null), null);

	end();
});

test('isAny', ({ end }) => {
	ok(isAny());
	ok(isAny(null));

	end();
});

test('parseAny', ({ end }) => {
	equal(parseAny(), undefined);
	equal(parseAny(null), null);

	end();
});