'use strict';

const { test, equal, ok } = require('tap');
const { any, getAny, isAny, parseAny } = require('r-assign/lib/any');

test('getAny', ({ end }) => {
	equal(getAny(), undefined);
	equal(getAny(null), null);

	end();
});

test('isAny', ({ end }) => {
	equal(isAny, any);

	ok(isAny());
	ok(isAny(null));

	end();
});

test('parseAny', ({ end }) => {
	equal(parseAny(), undefined);
	equal(parseAny(null), null);

	end();
});