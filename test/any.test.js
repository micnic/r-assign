'use strict';

const { test } = require('tap');
const { isAny, useAny, validateAny } = require('r-assign/lib/any');

test('isAny', ({ end, notOk, ok }) => {
	notOk(isAny());
	ok(isAny(null));
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

test('validateAny', ({ end, equals, throws }) => {
	equals(validateAny(null), null);
	throws(() => {
		validateAny();
	});
	end();
});