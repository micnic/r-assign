import { test, equal, ok } from 'tap';
import rAssign, { any, isAny } from 'r-assign';

test('isAny', ({ end }) => {

	equal(isAny, any);

	ok(isAny());
	ok(isAny(null));

	end();
});

test('assign isAny', ({ end }) => {

	const value = {};

	equal(value, rAssign(isAny, value));

	end();
});